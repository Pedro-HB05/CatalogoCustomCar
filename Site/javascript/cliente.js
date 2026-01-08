// ======== CARREGAR DADOS AO ABRIR ========
window.onload = function () {
    loadUserData();
};

// ======== FUNÇÃO PRINCIPAL DE CARREGAR DADOS ========
function loadUserData() {
    const email = localStorage.getItem("userEmail") || "";
    const password = localStorage.getItem("userPassword") || "";
    const endereco = localStorage.getItem("userEndereco") || "";
    const cartao = localStorage.getItem("userCartao") || "";
    const avatar = localStorage.getItem("userAvatar") || "imagens/avatar.png";

    document.getElementById("userEmail").value = email;
    document.getElementById("userPassword").value = password;
    document.getElementById("userEndereco").value = endereco;
    document.getElementById("userCartao").value = cartao;
    document.getElementById("userAvatar").src = avatar;

    // CARREGAR PEDIDOS
    const pedidos = JSON.parse(localStorage.getItem("userPedidos")) || [];
    const pedidoList = document.getElementById("pedidoList");
    pedidoList.innerHTML = "";

    if (pedidos.length === 0) {
        pedidoList.innerHTML = "<p>Nenhum pedido realizado.</p>";
        return;
    }

    pedidos.forEach((pedido, index) => {
        const div = document.createElement("div");
        div.className = "pedido-item";

        div.innerHTML = `
            <span>Pedido #${index + 1}</span><br>
            <strong>Data:</strong> ${pedido.data}<br>
            <strong>Itens:</strong> ${pedido.itens}<br>
            <strong>Total:</strong> ${pedido.total}
        `;

        pedidoList.appendChild(div);
    });
}

// ======== FUNÇÃO PARA SALVAR AVATAR ========
function saveAvatar() {
    const fileInput = document.getElementById("avatarInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Selecione uma imagem primeiro!");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const dataURL = e.target.result;
        document.getElementById("userAvatar").src = dataURL;
        localStorage.setItem("userAvatar", dataURL);
        alert("Foto atualizada com sucesso!");
    };

    reader.readAsDataURL(file);
}

// ======== FUNÇÃO PARA SALVAR EMAIL E SENHA ========
function saveEmailSenha() {
    const email = document.getElementById("userEmail").value;
    const password = document.getElementById("userPassword").value;

    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);
    alert("Email e senha atualizados!");
}

// ======== FUNÇÃO PARA SALVAR ENDEREÇO ========
function saveEndereco() {
    const endereco = document.getElementById("userEndereco").value;
    localStorage.setItem("userEndereco", endereco);
    alert("Endereço atualizado!");
}

// ======== FUNÇÃO PARA SALVAR CARTÃO ========
function saveCartao() {
    const cartao = document.getElementById("userCartao").value;
    localStorage.setItem("userCartao", cartao);
    alert("Cartão atualizado!");
}

// ======== FUNÇÃO PARA LIMPAR PEDIDOS ========
function limparPedidos() {
    localStorage.removeItem("userPedidos");
    loadUserData(); // recarrega a lista vazia
    alert("Histórico de pedidos limpo!");
}
