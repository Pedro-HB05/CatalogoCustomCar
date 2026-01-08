function toggleMenu() {
    const dropdown = document.getElementById("dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

window.onclick = function(event) {
    if (!event.target.matches('.avatar')) {
        const dropdown = document.getElementById("dropdown");
        if (dropdown) dropdown.style.display = "none";
    }
}

function updateAvatarMenu() {
    const dropdown = document.getElementById("dropdown");
    const token = localStorage.getItem("token");

    dropdown.innerHTML = "";

    if (token) {
        // Usuário logado → mostra Área do Cliente e Sair
        const clienteLink = document.createElement("a");
        clienteLink.href = "cliente.html"; 
        clienteLink.textContent = "Área do Cliente";
        dropdown.appendChild(clienteLink);

        const logoutLink = document.createElement("a");
        logoutLink.href = "index.html";
        logoutLink.textContent = "Sair";
        logoutLink.onclick = logout;
        dropdown.appendChild(logoutLink);
    } else {
        // Usuário não logado → mostra Login e Área do Cliente
        const loginLink = document.createElement("a");
        loginLink.href = "login.html";
        loginLink.textContent = "Login";
        dropdown.appendChild(loginLink);

        const clienteLink = document.createElement("a");
        clienteLink.href = "#"; // apenas âncora
        clienteLink.textContent = "Área do Cliente";
        clienteLink.onclick = () => {
            alert("Você precisa estar logado para acessar a área do cliente!");
            window.location.href = "login.html";
        };
        dropdown.appendChild(clienteLink);
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    updateAvatarMenu();
    window.location.href = "login.html";
}

window.onload = updateAvatarMenu;
