document.addEventListener("DOMContentLoaded", async () => {
    // Obtém o ID da manicure pela URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
        alert("ID da manicure não encontrado.");
        return;
    }

    try {
        const resposta = await fetch(`https://back-end-u9vj.onrender.com/manicures/${id}`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar informações da manicure.");
        }

        const manicure = await resposta.json();
        preencherPerfil(manicure);

    } catch (erro) {
        console.error("Erro ao carregar dados da manicure:", erro);
        alert("Erro ao carregar o perfil. Tente novamente mais tarde.");
    }
});

function preencherPerfil(manicure) {
    const foto = document.getElementById("profile-img");
    const nome = document.getElementById("nome");
    const telefone = document.getElementById("telefone");
    const endereco = document.getElementById("endereco");
    foto.src = manicure.foto || "imagens/perfil_cliente.png";
    foto.alt = manicure.name;
    nome.textContent = manicure.name;
    telefone.textContent = manicure.telefone || "Telefone não informado";
    endereco.textContent = `${manicure.rua || "Rua não informada"}, ${manicure.numero || ""} ${manicure.cidade || ""}, ${manicure.estado || ""}`;
}
