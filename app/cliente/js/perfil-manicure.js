document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
        alert("ID da manicure não encontrado.");
        return;
    }

    // Verifica se o ID é válido
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        alert("ID da manicure inválido.");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "login.html";
        return;
    }

    try {
        const resposta = await fetch(`https://back-end-jf0v.onrender.com/auth/manicures/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) {
            if (resposta.status === 404) {
                throw new Error("Manicure não encontrada.");
            } else {
                throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
            }
        }

        const manicure = await resposta.json();
        preencherPerfil(manicure);
    } catch (erro) {
        console.error("Erro ao carregar dados da manicure:", erro);
        alert(erro.message || "Erro ao carregar o perfil. Tente novamente mais tarde.");
    }
});

function preencherPerfil(manicure) {
    document.getElementById("profile-img").src = manicure.foto || "imagens/perfil_cliente.png";
    document.getElementById("profile-img").alt = manicure.nome || "Manicure";

    document.getElementById("nome").textContent = manicure.nome || "Nome não informado";
    document.getElementById("biografia").textContent = manicure.biografia || "Biografia não disponível.";
    document.getElementById("telefone").textContent = manicure.telefone || "Telefone não informado";
    document.getElementById("email").textContent = manicure.email || "E-mail não informado";

    const endereco = `${manicure.rua || "Rua não informada"}, ${manicure.numero || ""} - ${manicure.cidade || ""}, ${manicure.estado || ""}`;
    document.getElementById("endereco").textContent = endereco;
}
