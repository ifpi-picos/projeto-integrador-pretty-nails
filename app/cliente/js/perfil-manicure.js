document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
        alert("ID da manicure não encontrado.");
        return;
    }

    // 🔐 Buscar o token do localStorage
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "login.html"; // redireciona para login, se preferir
        return;
    }

    try {
        const resposta = await fetch(`https://back-end-u9vj.onrender.com/manicures/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) throw new Error("Erro ao buscar informações da manicure.");

        const manicure = await resposta.json();
        preencherPerfil(manicure);
    } catch (erro) {
        console.error("Erro ao carregar dados da manicure:", erro);
        alert("Erro ao carregar o perfil. Tente novamente mais tarde.");
    }
});

function preencherPerfil(manicure) {
    document.getElementById("profile-img").src = manicure.foto || "imagens/perfil_cliente.png";
    document.getElementById("profile-img").alt = manicure.name || "Manicure";

    document.getElementById("nome").textContent = manicure.name || "Nome não informado";
    document.getElementById("biografia").textContent = manicure.biografia || "Biografia não disponível.";
    document.getElementById("telefone").textContent = manicure.telefone || "Telefone não informado";
    document.getElementById("email").textContent = manicure.email || "E-mail não informado"

    const endereco = `${manicure.rua || "Rua não informada"}, ${manicure.numero || ""} - ${manicure.cidade || ""}, ${manicure.estado || ""}`;
    document.getElementById("endereco").textContent = endereco;
}
