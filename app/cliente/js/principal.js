//pega dados do login
document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`https://back-end-u9vj.onrender.com/usuario/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            // Token inválido - redireciona para login
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
            return;
        }
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const usuario = await response.json();
        const primeiroNome = usuario.nome.split(' ')[0];
        document.getElementById('user-name').textContent = primeiroNome;
        
        if (usuario.foto) {
            document.getElementById('user_avatar').src = usuario.foto;
        }
    } catch (error) {
        console.error('Falha ao carregar dados:', error);
        // Tratamento de erro adicional se necessário
    }
});

//Primiro nome na nav bar
document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');

    let nomeCompleto = localStorage.getItem('userName') || 'Usuário';

    let primeiroNome = nomeCompleto.split(' ')[0];

    document.getElementById('user-name').textContent = primeiroNome;

    try {
        const response = await fetch(`https://back-end-u9vj.onrender.com/usuario/${userId}`,{
            method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
        });
        const usuario = await response.json();

        if (usuario) {
            primeiroNome = usuario.nome.split(' ')[0]; // Pegando o primeiro nome da API
            document.getElementById('user-name').textContent = primeiroNome;
            document.getElementById('user_avatar').src = usuario.foto || 'imagens/avatar.jpg';
        }
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
    }
});


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
            const resposta = await fetch("https://back-end-u9vj.onrender.com/manicures", {
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

            img.onload = () => window.skeletonLoader.remove(img);

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
