let cachedManicures = null;

document.addEventListener("DOMContentLoaded", () => {
    // Inicia o carregamento dos perfis
    adicionarPerfis();
    
    // Configura o carregamento das imagens de tema
    setupThemeImages();
});

// Configura o carregamento das imagens de tema
function setupThemeImages() {
    const themeBoxes = document.querySelectorAll('.theme-box[data-skeleton]');
    
    themeBoxes.forEach(box => {
        const img = new Image();
        img.src = box.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
        
        img.onload = () => window.skeletonLoader.remove(box);
        img.onerror = () => setTimeout(() => window.skeletonLoader.remove(box), 500);
    });
}

async function adicionarPerfis() {
    const container = document.getElementById("perfis-container");
    
    try {
        console.log("Carregando perfis...");

        const token = localStorage.getItem('token'); // Busca o token salvo após login

        if (!token) {
            throw new Error("Token não encontrado. Usuário não autenticado.");
        }

        if (!cachedManicures) {
            const resposta = await fetch(`${API_BASE_URL}/auth/manicures`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho
                }
            });

            if (!resposta.ok) {
                throw new Error("Erro ao buscar manicures.");
            }

            cachedManicures = await resposta.json();
            console.log("Dados recebidos da API:", cachedManicures);
        } else {
            console.log("Usando dados em cache:", cachedManicures);
        }

        container.innerHTML = "";

        // Adaptação: acessar o array de manicures corretamente
        const listaManicures = cachedManicures.manicures || [];

        if (listaManicures.length === 0) {
            container.innerHTML = "<p>Nenhum perfil encontrado.</p>";
            return;
        }

        listaManicures.forEach(manicure => {
            const link = document.createElement("a");
            link.href = `perfil-manicure.html?id=${manicure.id}`;
            link.classList.add("perfil-link");
            
            const perfilDiv = document.createElement("div");
            perfilDiv.className = "perfil";
            
            const img = document.createElement("img");
            img.src = manicure.foto || 'imagens/user.png';
            img.alt = manicure.nome || "Manicure";
            
            img.onload = () => window.skeletonLoader.remove(img);
            
            const nomeDiv = document.createElement("div");
            nomeDiv.className = "perfil-nome";
            nomeDiv.textContent = manicure.nome || "Sem nome";
            
            const estrelasDiv = document.createElement("div");
            estrelasDiv.className = "estrelas";
            estrelasDiv.textContent = "★★★★★";
            
            perfilDiv.appendChild(img);
            perfilDiv.appendChild(nomeDiv);
            perfilDiv.appendChild(estrelasDiv);
            link.appendChild(perfilDiv);
            container.appendChild(link);

            window.skeletonLoader.remove(nomeDiv);
            window.skeletonLoader.remove(estrelasDiv);
        });

    } catch (error) {
        console.error("Erro ao carregar manicures:", error);
        container.innerHTML = "<p>Erro ao carregar perfis.</p>";
    } finally {
        window.skeletonLoader.removeAll();
    }
}
