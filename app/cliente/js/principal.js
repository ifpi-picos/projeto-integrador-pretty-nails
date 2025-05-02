// principal.js
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
        // Cria uma imagem temporária para verificar o carregamento
        const img = new Image();
        img.src = box.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
        
        img.onload = function() {
            // Quando a imagem carregar, remove o skeleton
            window.skeletonLoader.remove(box);
        };
        
        img.onerror = function() {
            // Em caso de erro, também remove o skeleton após um pequeno delay
            setTimeout(() => {
                window.skeletonLoader.remove(box);
            }, 500);
        };
    });
}

async function adicionarPerfis() {
    const container = document.getElementById("perfis-container");
    
    try {
        console.log("Carregando perfis...");

        if (!cachedManicures) {
            const resposta = await fetch("https://back-end-u9vj.onrender.com/manicures");

            if (!resposta.ok) {
                throw new Error("Erro ao buscar manicures.");
            }

            cachedManicures = await resposta.json();
            console.log("Dados recebidos da API:", cachedManicures);
        } else {
            console.log("Usando dados em cache:", cachedManicures);
        }

        container.innerHTML = ""; // Limpa os perfis existentes

        if (cachedManicures.length === 0) {
            container.innerHTML = "<p>Nenhum perfil encontrado.</p>";
            return;
        }

        cachedManicures.forEach(manicure => {
            const link = document.createElement("a");
            link.href = `perfil-manicure.html?id=${manicure.id}`;
            link.classList.add("perfil-link");
            
            const perfilDiv = document.createElement("div");
            perfilDiv.className = "perfil";
            
            const img = document.createElement("img");
            img.src = manicure.foto || 'imagens/perfil_cliente.png';
            img.alt = manicure.name;
            
            // Configura o carregamento da imagem do perfil
            img.onload = function() {
                window.skeletonLoader.remove(img);
            };
            
            const nomeDiv = document.createElement("div");
            nomeDiv.className = "perfil-nome";
            nomeDiv.textContent = manicure.name;
            
            const estrelasDiv = document.createElement("div");
            estrelasDiv.className = "estrelas";
            estrelasDiv.textContent = "★★★★★";
            
            perfilDiv.appendChild(img);
            perfilDiv.appendChild(nomeDiv);
            perfilDiv.appendChild(estrelasDiv);
            link.appendChild(perfilDiv);
            container.appendChild(link);
            
            // Remove o skeleton dos elementos internos
            window.skeletonLoader.remove(nomeDiv);
            window.skeletonLoader.remove(estrelasDiv);
        });
        
    } catch (error) {
        console.error("Erro ao carregar manicures:", error);
        container.innerHTML = "<p>Erro ao carregar perfis.</p>";
    } finally {
        // Remove skeletons restantes em caso de erro ou sucesso
        window.skeletonLoader.removeAll();
    }
}