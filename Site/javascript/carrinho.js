/* ============================= */
/* MENSAGENS */
/* ============================= */
function mostrarMensagemSucesso(texto) {
    const toast = document.createElement("div");
    toast.className = "toast-sucesso";
    toast.innerText = texto;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

function mostrarMensagemErro(texto) {
    const toast = document.createElement("div");
    toast.className = "toast-erro";
    toast.innerText = texto;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

/* ============================= */
/* TOTAL DO CARRINHO */
/* ============================= */
function atualizarTotal() {
    let totalCarrinho = 0;
    const produtos = document.getElementsByClassName("produto-carrinho");

    for (let i = 0; i < produtos.length; i++) {
        const preco = parseFloat(
            produtos[i].querySelector(".preco-produto").innerText
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
        ) || 0;

        const quantidade = parseInt(
            produtos[i].querySelector(".quantidade-input").value
        ) || 0;

        totalCarrinho += preco * quantidade;
    }

    document.querySelector("#totalCarrinho").innerText =
        "R$" + totalCarrinho.toFixed(2).replace(".", ",");
}

/* ============================= */
/* CONTADOR DO CARRINHO */
/* ============================= */
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const contador = document.querySelector("#contadorCarrinho");

    const totalItens = carrinho.reduce((total, item) => {
        return total + Number(item.quantidade);
    }, 0);

    if (contador) contador.innerText = totalItens;
}

/* ============================= */
/* REMOVER PRODUTO */
/* ============================= */
function removerProduto(event) {
    const produto = event.target.closest(".produto-carrinho");
    if (!produto) return;

    const titulo = produto.querySelector("strong").innerText;

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho = carrinho.filter(item => item.titulo !== titulo);

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    produto.remove();
    atualizarContadorCarrinho();
    atualizarTotal();
}

/* ============================= */
/* SALVAR CARRINHO */
/* ============================= */
function salvarCarrinho() {
    const produtos = [];
    const linhas = document.getElementsByClassName("produto-carrinho");

    for (let i = 0; i < linhas.length; i++) {
        const item = linhas[i];

        produtos.push({
            imagem: item.querySelector("img").src,
            titulo: item.querySelector("strong").innerText,
            descricao: item.querySelector("td:nth-child(2)").innerText,
            preco: item.querySelector(".preco-produto").innerText,
            quantidade: item.querySelector(".quantidade-input").value
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(produtos));
}

/* ============================= */
/* ADICIONAR AO CARRINHO */
/* ============================= */
function addProdutoCarrinho(event) {
    const card = event.target.closest(".card");
    const titulo = card.querySelector(".card-title").innerText;

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const produtoExistente = carrinho.find(item => item.titulo === titulo);

    if (produtoExistente) {
        produtoExistente.quantidade++;
        mostrarMensagemSucesso(`Quantidade de "${titulo}" atualizada`);
    } else {
        carrinho.push({
            imagem: card.querySelector(".card-img-top").src,
            titulo: titulo,
            descricao: card.querySelector(".card-text").innerText,
            preco: card.querySelector(".preco-produto").innerText,
            quantidade: 1
        });
        mostrarMensagemSucesso(`"${titulo}" adicionado ao carrinho`);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

/* ============================= */
/* CARREGAR CARRINHO */
/* ============================= */
function carregarCarrinho() {
    const tabela = document.querySelector("#listaCarrinho");
    if (!tabela) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    tabela.innerHTML = "";

    carrinho.forEach(produto => {
        const tr = document.createElement("tr");
        tr.classList.add("produto-carrinho");

        tr.innerHTML = `
            <td>
                <img src="${produto.imagem}" width="80"><br>
                <strong>${produto.titulo}</strong>
            </td>
            <td>${produto.descricao}</td>
            <td>
                <input type="number" min="1" value="${produto.quantidade}"
                       class="form-control quantidade-input"
                       style="width:70px;margin:auto;">
            </td>
            <td class="preco-produto">${produto.preco}</td>
            <td>
                <button class="btn btn-danger btn-sm remover-produto">🗑</button>
            </td>
        `;

        tabela.appendChild(tr);

        tr.querySelector(".remover-produto")
            .addEventListener("click", removerProduto);

        tr.querySelector(".quantidade-input")
            .addEventListener("change", () => {
                salvarCarrinho();
                atualizarContadorCarrinho();
                atualizarTotal();
            });
    });

    atualizarContadorCarrinho();
    atualizarTotal();
}

/* ============================= */
/* FINALIZAR COMPRA (SALVA PEDIDOS) */
/* ============================= */
function finalizarCompra() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    if (carrinho.length === 0) {
        mostrarMensagemErro("O carrinho está vazio!");
        return;
    }

    let pedidos = JSON.parse(localStorage.getItem("userPedidos")) || [];

    const total = document.querySelector("#totalCarrinho").innerText;
    const data = new Date().toLocaleDateString("pt-BR");

    const itens = carrinho.map(item =>
        `${item.quantidade}x ${item.titulo}`
    ).join(" | ");

    pedidos.push({
        data: data,
        itens: itens,
        total: total
    });

    localStorage.setItem("userPedidos", JSON.stringify(pedidos));

    mostrarMensagemSucesso("Compra finalizada com sucesso!");

    localStorage.removeItem("carrinho");

    document.querySelector("#listaCarrinho").innerHTML = "";
    document.querySelector("#totalCarrinho").innerText = "R$0,00";
    atualizarContadorCarrinho();
}

/* ============================= */
/* INICIAR EVENTOS */
/* ============================= */
function iniciarEventos() {
    document.querySelectorAll(".adicionar-ao-carrinho")
        .forEach(btn => btn.addEventListener("click", addProdutoCarrinho));

    document.querySelectorAll(".finalizar-compra")
        .forEach(btn => btn.addEventListener("click", finalizarCompra));

    atualizarContadorCarrinho();
}

/* ============================= */
/* DOM READY */
/* ============================= */
document.addEventListener("DOMContentLoaded", () => {
    iniciarEventos();
    carregarCarrinho();
});