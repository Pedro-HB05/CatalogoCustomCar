async function login() {
  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("passwordLogin").value;

  try {
    const response = await fetch("http://localhost:5072/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token); // salva token
      localStorage.setItem("userName", data.name); // salva nome
      window.location.href = "cliente.html"; // redireciona
    } else {
      const error = await response.text();
      alert("Erro no login: " + error);
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao conectar com a API");
  }
}
