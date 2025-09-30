let cachedManicures = null;

// Função para renderizar estrelas baseada na média
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHtml = '';
    
    // Estrelas preenchidas
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star active" data-brilho="suave"></i>';
    }
    
    // Meia estrela se necessário
    if (hasHalfStar && fullStars < 5) {
        starsHtml += '<i class="fas fa-star-half-alt active" data-brilho="suave"></i>';
    }
    
    // Estrelas vazias
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

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
            const resposta = await fetch(`${API_BASE_URL}/api/users/manicures`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho
                }
            });

            if (!resposta.ok) {
                throw new Error("Erro ao buscar manicures.");
            }

            const data = await resposta.json();
            cachedManicures = data.success ? data.manicures : [];
            console.log("Dados recebidos da API:", cachedManicures);
        } else {
            console.log("Usando dados em cache:", cachedManicures);
        }

        container.innerHTML = "";

        // Os dados já vêm ordenados por estrelas (maior para menor)
        const listaManicures = cachedManicures;

        if (listaManicures.length === 0) {
            container.innerHTML = `
                <div class="empty-state-simple">
                    <i class="fas fa-star-half-alt"></i>
                    <h3>Nenhuma manicure bem avaliada no momento</h3>
                    <p>Aguarde novas avaliações ou explore outros perfis</p>
                </div>
            `;
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
            estrelasDiv.setAttribute("data-brilho", "");
            
            // Usar a média de estrelas do banco de dados
            const mediaEstrelas = parseFloat(manicure.estrelas) || 0;
            estrelasDiv.innerHTML = renderStars(mediaEstrelas);
            
            // Adicionar a média como número
            const ratingNumber = document.createElement("span");
            ratingNumber.className = "rating-number";
            ratingNumber.textContent = mediaEstrelas.toFixed(1);
            estrelasDiv.appendChild(ratingNumber);
            
            perfilDiv.appendChild(img);
            perfilDiv.appendChild(nomeDiv);
            perfilDiv.appendChild(estrelasDiv);
            link.appendChild(perfilDiv);
            container.appendChild(link);

            window.skeletonLoader.remove(nomeDiv);
            window.skeletonLoader.remove(estrelasDiv);
            
            // Ativar brilho nas estrelas após adicioná-las ao DOM
            setTimeout(() => {
                if (window.brilhoManager) {
                    window.brilhoManager.porAvaliacao(estrelasDiv, mediaEstrelas);
                }
            }, 100);
        });

    } catch (error) {
        console.error("Erro ao carregar manicures:", error);
        container.innerHTML = "<p>Erro ao carregar perfis.</p>";
    } finally {
        window.skeletonLoader.removeAll();
    }
}
