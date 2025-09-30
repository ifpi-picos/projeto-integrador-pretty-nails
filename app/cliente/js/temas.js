// Configuração dos temas disponíveis
const temasConfig = {
    'francesinha': {
        nome: 'Unhas Francesinha',
        icon: '💅',
        variacoes: [
            {
                titulo: 'Francesinha Clássica',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-francesinha-1-730x730.jpg',
                descricao: 'O clássico da elegância francesa com ponta branca e base nude.'
            },
            {
                titulo: 'Francesinha Colorida',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-francesinha-15-730x730.jpg',
                descricao: 'Versão moderna com pontas coloridas para um look mais jovem.'
            },
            {
                titulo: 'Francesinha Invertida',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-francesinha-8-730x730.jpg',
                descricao: 'Inovação na base da unha criando um visual único e sofisticado.'
            }
        ]
    },
    'nude': {
        nome: 'Unhas Nude',
        icon: '🤎',
        variacoes: [
            {
                titulo: 'Nude Clássico',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-nude-21-730x730.jpg',
                descricao: 'Tons naturais que combinam com qualquer ocasião.'
            },
            {
                titulo: 'Nude Rosé',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-nude-1-730x730.jpg',
                descricao: 'Delicado tom rosado para um visual romântico.'
            },
            {
                titulo: 'Nude Francês',
                imagem: 'https://www.oibonita.com.br/wp-content/uploads/2023/03/unhas-nude-4-730x811.jpg',
                descricao: 'Combinação perfeita entre nude e francesinha.'
            }
        ]
    },
    'florais': {
        nome: 'Unhas Florais',
        icon: '🌸',
        variacoes: [
            {
                titulo: 'Flores Delicadas',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-florais-1-730x730.jpg',
                descricao: 'Pequenas flores para um look feminino e romântico.'
            },
            {
                titulo: 'Flores Tropicais',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-florais-10-730x730.jpg',
                descricao: 'Cores vibrantes inspiradas na natureza tropical.'
            },
            {
                titulo: 'Aquarela Floral',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-florais-5-730x730.jpg',
                descricao: 'Técnica de aquarela criando flores suaves e artísticas.'
            }
        ]
    },
    'metalica': {
        nome: 'Unhas Metálicas',
        icon: '✨',
        variacoes: [
            {
                titulo: 'Dourado Luxo',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-metalicas-1-730x730.jpg',
                descricao: 'Brilho dourado para ocasiões especiais.'
            },
            {
                titulo: 'Prata Moderna',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-metalicas-8-730x730.jpg',
                descricao: 'Visual futurista com acabamento prateado.'
            },
            {
                titulo: 'Rose Gold',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-metalicas-15-730x730.jpg',
                descricao: 'Tendência rose gold para um look sofisticado.'
            }
        ]
    },
    'gliter': {
        nome: 'Unhas com Glitter',
        icon: '✨',
        variacoes: [
            {
                titulo: 'Glitter Total',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-glitter-1-730x730.jpg',
                descricao: 'Brilho completo para arrasar na festa.'
            },
            {
                titulo: 'Glitter Degradê',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-glitter-10-730x730.jpg',
                descricao: 'Efeito gradiente com glitter nas pontas.'
            },
            {
                titulo: 'Glitter Accent',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-glitter-5-730x730.jpg',
                descricao: 'Destaque em uma unha para um toque especial.'
            }
        ]
    },
    'neon': {
        nome: 'Unhas Neon',
        icon: '🌈',
        variacoes: [
            {
                titulo: 'Neon Pink',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-neon-1-730x730.jpg',
                descricao: 'Rosa vibrante que chama atenção.'
            },
            {
                titulo: 'Neon Mix',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-neon-8-730x730.jpg',
                descricao: 'Combinação de cores neon para um visual ousado.'
            },
            {
                titulo: 'Neon Gradient',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-neon-15-730x730.jpg',
                descricao: 'Degradê neon para um efeito único.'
            }
        ]
    },
    'transparente': {
        nome: 'Unhas Transparentes',
        icon: '💎',
        variacoes: [
            {
                titulo: 'Glass Nails',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-transparentes-1-730x730.jpg',
                descricao: 'Efeito vidro para um look minimalista.'
            },
            {
                titulo: 'Transparente com Detalhes',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-transparentes-10-730x730.jpg',
                descricao: 'Base transparente com pequenos detalhes decorativos.'
            },
            {
                titulo: 'Transparente Colorido',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-transparentes-5-730x730.jpg',
                descricao: 'Leve toque de cor sobre base transparente.'
            }
        ]
    },
    'animais': {
        nome: 'Unhas com Print Animal',
        icon: '🐆',
        variacoes: [
            {
                titulo: 'Oncinha Clássica',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-animais-1-730x730.jpg',
                descricao: 'Print de onça para um visual selvagem.'
            },
            {
                titulo: 'Zebra Moderna',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-animais-8-730x730.jpg',
                descricao: 'Listras de zebra em versão estilizada.'
            },
            {
                titulo: 'Snake Print',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-animais-15-730x730.jpg',
                descricao: 'Textura de cobra para um look ousado.'
            }
        ]
    },
    'frutas': {
        nome: 'Unhas com Frutas',
        icon: '🍓',
        variacoes: [
            {
                titulo: 'Morangos Fofos',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-frutas-1-730x730.jpg',
                descricao: 'Desenhos de morangos para um visual divertido.'
            },
            {
                titulo: 'Frutas Tropicais',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-frutas-10-730x730.jpg',
                descricao: 'Abacaxi, melancia e outras frutas do verão.'
            },
            {
                titulo: 'Frutas Minimalistas',
                imagem: 'https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-frutas-5-730x730.jpg',
                descricao: 'Representações simples e elegantes de frutas.'
            }
        ]
    }
};

// Elementos da página
const gallery = document.getElementById('gallery');
const detail = document.getElementById('detail');
const previewImg = document.getElementById('previewImg');
const temaTitle = document.getElementById('tema-title');
const overlayTitle = document.getElementById('overlayTitle');
const desc = document.getElementById('desc');
const saveBtn = document.getElementById('saveBtn');
const saveIcon = saveBtn?.querySelector('.icon');
const saveLabel = saveBtn?.querySelector('.label');
const themeTitle = document.getElementById('themeTitle');

let currentKey = null;
let currentTheme = null;

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Aguarda o skeleton loader estar disponível
    setTimeout(() => {
        initializePage();
    }, 100);
});

function initializePage() {
    // Detecta o tema pela URL ou usa um padrão
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('tema') || 'nude'; // padrão: nude
    
    currentTheme = temasConfig[themeParam];
    
    if (!currentTheme) {
        console.error('Tema não encontrado:', themeParam);
        currentTheme = temasConfig.nude; // fallback
    }
    
    // Simula carregamento
    setTimeout(() => {
        loadThemeContent();
    }, 1500);
}

function loadThemeContent() {
    // Remove skeleton do título
    if (window.skeletonLoader) {
        window.skeletonLoader.remove(themeTitle);
    }
    
    // Atualiza o título
    themeTitle.textContent = `${currentTheme.icon} ${currentTheme.nome}`;
    
    // Limpa e popula a galeria
    gallery.innerHTML = '';
    
    currentTheme.variacoes.forEach((variacao, index) => {
        const card = createThemeCard(variacao, index);
        gallery.appendChild(card);
    });
    
    // Remove skeleton dos cards após um pequeno delay para cada um
    const cards = gallery.querySelectorAll('.theme-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            if (window.skeletonLoader) {
                window.skeletonLoader.remove(card);
                const img = card.querySelector('.theme-image');
                const title = card.querySelector('.theme-title');
                if (img) window.skeletonLoader.remove(img);
                if (title) window.skeletonLoader.remove(title);
            }
        }, 200 * index);
    });
}

function createThemeCard(variacao, index) {
    const card = document.createElement('div');
    card.className = 'theme-card';
    card.dataset.title = variacao.titulo;
    card.dataset.img = variacao.imagem;
    card.dataset.desc = variacao.descricao;
    
    card.innerHTML = `
        <img src="${variacao.imagem}" alt="${variacao.titulo}" class="theme-image" 
             onerror="this.src='imagens/user.png'">
        <div class="theme-title">${variacao.titulo}</div>
    `;
    
    // Adiciona evento de clique
    card.addEventListener('click', () => openDetail(variacao));
    
    return card;
}

function openDetail(variacao) {
    if (!detail) return; // Se não existe seção de detalhes, apenas retorna
    
    previewImg.src = variacao.imagem;
    temaTitle.textContent = variacao.titulo;
    overlayTitle.textContent = variacao.titulo;
    desc.textContent = variacao.descricao;

    currentKey = encodeURIComponent(variacao.imagem);

    gallery.style.display = 'none';
    detail.classList.add('active');
    
    if (saveBtn) {
        updateSaveUI();
    }
}

// Event listeners para navegação
if (detail) {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            detail.classList.remove('active');
            gallery.style.display = 'grid';
        });
    }
}

// Funções de favoritos
function isSaved(key) {
    return localStorage.getItem('pretty_saved_' + key) === '1';
}

function setSaved(key, val) {
    localStorage.setItem('pretty_saved_' + key, val ? '1' : '0');
}

function updateSaveUI() {
    if (!currentKey || !saveBtn) return;
    const saved = isSaved(currentKey);
    saveBtn.setAttribute('aria-pressed', saved ? 'true' : 'false');
    saveBtn.classList.toggle('saved', saved);
    if (saveIcon) saveIcon.textContent = saved ? '❤' : '♡';
    if (saveLabel) saveLabel.textContent = saved ? 'Salvo' : 'Salvar';
}

// Evento do botão salvar
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        if (!currentKey) return;
        const willSave = !isSaved(currentKey);
        setSaved(currentKey, willSave);
        updateSaveUI();
    });
}