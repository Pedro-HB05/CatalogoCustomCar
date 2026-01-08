// cadastro.js
async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("emailCadastro").value;
  const password = document.getElementById("passwordCadastro").value;

  try {
    const response = await fetch("http://localhost:5072/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      alert("Cadastro realizado com sucesso! Faça login agora.");
    } else {
      const error = await response.text();
      alert("Erro no cadastro: " + error);
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao conectar com a API");
  }
}
