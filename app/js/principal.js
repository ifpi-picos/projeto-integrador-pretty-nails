// Rolagem perfil bem avaliados
const container = document.getElementById("perfis-container");

let isDown = false;
let startX;
let scrollLeft;

container.addEventListener("mousedown", (e) => {
    isDown = true;
    container.classList.add("active"); // Adiciona um efeito ao clicar
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
});

container.addEventListener("mouseleave", () => {
    isDown = false;
    container.classList.remove("active");
});

container.addEventListener("mouseup", () => {
    isDown = false;
    container.classList.remove("active");
});

container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 3; // Ajuste a velocidade de rolagem
    container.scrollLeft = scrollLeft - walk;
});

// Função para adicionar os perfis das manicures na tela principal
async function adicionarPerfis() {
    try {
        const resposta = await fetch("https://back-end-u9vj.onrender.com/manicures");
        if (!resposta.ok) {
            throw new Error("Erro ao buscar manicures.");
        }
        const manicures = await resposta.json();

        console.log('manicures', manicures);

        const container = document.getElementById("perfis-container");
        container.innerHTML = ""; // Limpa os perfis existentes

        manicuresFiltradas.forEach(manicure => {
            const card = document.createElement("div");
            card.classList.add("perfil");
            card.innerHTML = `
                <a href="perfil_manicure.html?id=${manicure.id}">
                    <img src="${manicure.foto || 'https://via.placeholder.com/150'}" alt="${manicure.name}">
                    <div class="perfil-nome">${manicure.name}</div>
                    <div class="estrelas">${'★'.repeat(manicure.rating)}</div>
                </a>
            `;
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error("Erro ao carregar manicures:", error);
    }
}

// Chama a função para exibir os perfis assim que a página for carregada
document.addEventListener("DOMContentLoaded", adicionarPerfis);
