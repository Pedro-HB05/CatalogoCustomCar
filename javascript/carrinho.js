/* MENSAGEM DE SUCESSO */
function mostrarMensagemSucesso(texto) {
    const toast = document.createElement("div");
    toast.className = "toast-sucesso";
    toast.innerText = texto;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* MENSAGEM DE ERRO */
function mostrarMensagemErro(texto) {
    const toast = document.createElement("div");
    toast.className = "toast-erro";
    toast.innerText = texto;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* =ATUALIZAR TOTAL */
function atualizarTotal() {
    let totalCarrinho = 0;
    const carProduto = document.getElementsByClassName("produto-carrinho");

    for (let i = 0; i < carProduto.length; i++) {
        const produtoPreco = parseFloat(
            carProduto[i].querySelector(".preco-produto").innerText
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim()
        ) || 0;

        const produtoQuantidade = parseInt(
            carProduto[i].querySelector(".quantidade-input").value
        ) || 0;

        totalCarrinho += produtoPreco * produtoQuantidade;
    }

    document.querySelector("#totalCarrinho").innerText =
        "R$" + totalCarrinho.toFixed(2).replace(".", ",");
}

/* REMOVER PRODUTO */
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

/* SALVAR CARRINHO */
function salvarCarrinho() {
    const produtos = [];
    const carProduto = document.getElementsByClassName("produto-carrinho");

    for (let i = 0; i < carProduto.length; i++) {
        const item = carProduto[i];

        produtos.push({
            titulo: item.querySelector("strong").innerText,
            descricao: item.querySelector("td:nth-child(2)").innerText,
            preco: item.querySelector(".preco-produto").innerText,
            quantidade: item.querySelector(".quantidade-input").value,
            imagem: item.querySelector("img").src
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(produtos));
}

/* ADICIONAR PRODUTO */
function addProdutoCarrinho(event) {
    const button = event.target;
    const card = button.closest(".card");

    const titulo = card.querySelector(".card-title").innerText;

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const produtoExistente = carrinho.find(item => item.titulo === titulo);

    if (produtoExistente) {
        produtoExistente.quantidade++;
        mostrarMensagemSucesso(`Quantidade de "${titulo}" atualizada no carrinho`);
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

/* CONTADOR DO CARRINHO */
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const contador = document.querySelector("#contadorCarrinho");

    const totalItens = carrinho.reduce((total, item) => {
        return total + Number(item.quantidade);
    }, 0);

    if (contador) {
        contador.innerText = totalItens;
    }
}

/* CARREGAR CARRINHO */
function carregarCarrinho() {
    const bodyTabela = document.querySelector("#listaCarrinho");
    if (!bodyTabela) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    bodyTabela.innerHTML = "";

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
                <input type="number" min="1"
                    value="${produto.quantidade}"
                    class="form-control quantidade-input"
                    style="width:70px;margin:auto;">
            </td>
            <td class="preco-produto">${produto.preco}</td>
            <td>
                <button class="btn btn-danger btn-sm remover-produto">
                    🗑 Remover
                </button>
            </td>
        `;

        bodyTabela.appendChild(tr);

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

/* FINALIZAR COMPRA */
function finalizarCompra() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    if (carrinho.length === 0) {
        mostrarMensagemErro("O carrinho está vazio! Adicione produtos antes de finalizar.");
        return;
    }

    mostrarMensagemSucesso("Compra finalizada com sucesso!");

    localStorage.removeItem("carrinho");

    const bodyTabela = document.querySelector("#listaCarrinho");
    if (bodyTabela) bodyTabela.innerHTML = "";

    atualizarContadorCarrinho();
    document.querySelector("#totalCarrinho").innerText = "R$0,00";
}

/* INICIAR EVENTOS */
function iniciarEventos() {
    const botoes = document.getElementsByClassName("adicionar-ao-carrinho");

    for (let i = 0; i < botoes.length; i++) {
        botoes[i].addEventListener("click", addProdutoCarrinho);
    }

    // Seleciona botão pela classe
    const botoesFinalizar = document.getElementsByClassName("finalizar-compra");
    for (let i = 0; i < botoesFinalizar.length; i++) {
        botoesFinalizar[i].addEventListener("click", finalizarCompra);
    }

    atualizarContadorCarrinho();
}

/* DOM READY */
document.addEventListener("DOMContentLoaded", () => {
    iniciarEventos();
    carregarCarrinho();
});
