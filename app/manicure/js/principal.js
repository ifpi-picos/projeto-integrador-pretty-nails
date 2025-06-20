document.addEventListener("DOMContentLoaded", () => {
    console.log("Script principal.js carregado!");
    adicionarPerfis();
});

// Função para adicionar os perfis das manicures na tela principal
async function adicionarPerfis() {
    try {
        console.log("Carregando perfis...");

        const resposta = await fetch("http://localhost:3000/manicures");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar manicures.");
        }

        const manicures = await resposta.json();
        console.log("Dados recebidos da API:", manicures);

        const container = document.getElementById("perfis-container");
        container.innerHTML = ""; // Limpa os perfis existentes

        if (manicures.length === 0) {
            container.innerHTML = "<p>Nenhum perfil encontrado.</p>";
            return;
        }

        manicures.forEach(manicure => {
            const card = document.createElement("div");
            card.classList.add("perfil");
            card.innerHTML = `
                <img src="${manicure.foto || 'imagens/perfil_cliente.png'}" alt="${manicure.name}">
                <div class="perfil-nome">${manicure.name}</div>
                <div class="estrelas">★★★★★</div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar manicures:", error);
        document.getElementById("perfis-container").innerHTML = "<p>Erro ao carregar perfis.</p>";
    }
}
