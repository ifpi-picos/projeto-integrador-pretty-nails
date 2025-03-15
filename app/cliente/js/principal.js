document.addEventListener("DOMContentLoaded", () => {
    adicionarPerfis();
});

// Função para adicionar os perfis das manicures na tela principal
async function adicionarPerfis() {
    try {
        console.log("Carregando perfis...");

        const resposta = await fetch("https://back-end-u9vj.onrender.com/manicures");

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
            const link = document.createElement("a");
            link.href = `perfil-manicure.html?id=${manicure.id}`;
            link.classList.add("perfil-link");
            link.innerHTML = `
                <div class="perfil">
                    <img src="${manicure.foto || 'imagens/perfil_cliente.png'}" alt="${manicure.name}">
                    <div class="perfil-nome">${manicure.name}</div>
                    <div class="estrelas">★★★★★</div>
                </div>
            `;
            container.appendChild(link);
        });
    } catch (error) {
        console.error("Erro ao carregar manicures:", error);
        document.getElementById("perfis-container").innerHTML = "<p>Erro ao carregar perfis.</p>";
    }
}

