// Favoritos JavaScript
let temasConfig = {};
let favoritosData = [];
let loadFavoritosTimeout = null;
let isLoadingFavoritos = false;

// Função para tocar áudio de favoritar
function playFavoriteSound() {
    console.log('playFavoriteSound() chamada');
    try {
        // Primeiro tenta o arquivo MP3 real
        const audio = new Audio('../../audios/pop.mp3');
        audio.volume = 0.5;
        
        // Se falhar ao carregar, usa som sintético
        audio.onerror = function() {
            console.log('Arquivo pop.mp3 não encontrado, usando som sintético...');
            playFallbackSound();
        };
        
        // Tenta tocar o áudio
        audio.play().then(() => {
            console.log('Áudio MP3 tocado com sucesso!');
        }).catch(err => {
            console.log('Erro ao tocar áudio MP3:', err);
            playFallbackSound();
        });
    } catch (err) {
        console.log('Erro ao carregar áudio:', err);
        playFallbackSound();
    }
}

// Função de fallback que cria um som sintético
function playFallbackSound() {
    try {
        console.log('Tentando criar som sintético...');
        
        // Cria um contexto de áudio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Resume o contexto se estiver suspenso (necessário em alguns navegadores)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Cria um oscilador para gerar o som
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Conecta os nós
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configura o som (frequência e volume) - som mais simples
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // Nota C5
        oscillator.type = 'sine'; // Onda senoidal (mais suave)
        
        // Envelope de volume (fade in/out)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
        
        // Toca o som
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        
        console.log('Som sintético tocado com sucesso!');
    } catch (err) {
        console.log('Erro ao tocar som sintético:', err);
        
        // Fallback final: beep do sistema (se disponível)
        try {
            if (window.speechSynthesis) {
                // Usa o sintetizador de voz para fazer um som curto
                const utterance = new SpeechSynthesisUtterance('');
                utterance.volume = 0.1;
                utterance.rate = 10;
                utterance.pitch = 2;
                window.speechSynthesis.speak(utterance);
            }
        } catch (e) {
            console.log('Nenhum método de áudio disponível');
        }
    }
}

// Carrega os temas do JSON (mesmo código do temas.js)
async function loadTemasFromJSON() {
    try {
        console.log('Carregando temas para favoritos...');
        const response = await fetch('../../data/temas.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Converte o formato JSON para o formato esperado
        temasConfig = {};
        for (const [key, tema] of Object.entries(data)) {
            temasConfig[key] = {
                nome: tema.nome,
                icon: tema.icone,
                categoria: tema.categoria,
                variacoes: tema.variacoes.map(variacao => ({
                    titulo: variacao.titulo,
                    imagem: variacao.imagem,
                    descricao: variacao.descricao,
                    preco: variacao.preco,
                    tempo: variacao.tempo
                }))
            };
        }
        
        console.log('Temas carregados para favoritos:', Object.keys(temasConfig));
        return true;
    } catch (error) {
        console.error('Erro ao carregar temas:', error);

        return false;
    }
}

// Função para obter todos os favoritos salvos
function getFavoritos() {
    const favoritos = [];
    
    // Percorre todos os itens do localStorage procurando por favoritos
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pretty_saved_') && localStorage.getItem(key) === '1') {
            const imageUrl = decodeURIComponent(key.replace('pretty_saved_', ''));
            
            // Procura a variação correspondente nos temas
            for (const [temaId, tema] of Object.entries(temasConfig)) {
                for (const variacao of tema.variacoes) {
                    if (variacao.imagem === imageUrl) {
                        favoritos.push({
                            temaId: temaId,
                            tema: tema,
                            variacao: variacao,
                            key: key
                        });
                        break;
                    }
                }
            }
        }
    }
    
    return favoritos;
}

// Função para remover um favorito
function removeFavorito(key, buttonElement = null) {
    console.log('Removendo favorito:', key);
    
    // Toca o áudio de favoritar/desfavoritar
    console.log('Tocando áudio de desfavoritar...');
    playFavoriteSound();
    
    // Encontra o card correspondente
    let cardToRemove = null;
    if (buttonElement) {
        cardToRemove = buttonElement.closest('.favorito-card');
    } else {
        // Fallback: procura pela key
        const favoritosGrid = document.getElementById('favoritos-grid');
        const buttons = favoritosGrid.querySelectorAll('.remove-favorite');
        buttons.forEach(btn => {
            if (btn.dataset.key === key) {
                cardToRemove = btn.closest('.favorito-card');
            }
        });
    }
    
    if (cardToRemove) {
        // Adiciona animação de saída
        cardToRemove.style.transform = 'scale(0.8)';
        cardToRemove.style.opacity = '0';
        cardToRemove.style.transition = 'all 0.3s ease';
        
        // Adiciona feedback visual no botão
        const button = cardToRemove.querySelector('.remove-favorite');
        if (button) {
            button.style.color = '#ff4757';
            button.querySelector('i').className = 'fas fa-heart-broken';
        }
        
        // Remove do localStorage e atualiza após a animação
        setTimeout(() => {
            localStorage.setItem(key, '0');
            console.log('Favorito removido, recarregando lista...');
            loadFavoritos();
        }, 300);
    } else {
        // Fallback caso não encontre o card
        console.log('Card não encontrado, removendo diretamente...');
        localStorage.setItem(key, '0');
        loadFavoritos();
    }
}

// Função para criar um card de favorito
function createFavoritoCard(favorito) {
    const card = document.createElement('div');
    card.className = 'favorito-card';
    card.dataset.temaId = favorito.temaId;
    card.dataset.variacao = favorito.variacao.titulo;
    
    // Informações de preço e tempo
    let infoHtml = '';
    if (favorito.variacao.preco || favorito.variacao.tempo) {
        infoHtml = `
            <div class="favorito-info">
                ${favorito.variacao.preco ? `<span class="favorito-price">R$ ${favorito.variacao.preco.toFixed(2)}</span>` : '<span></span>'}
                ${favorito.variacao.tempo ? `<span class="favorito-time"><i class="fas fa-clock"></i> ${favorito.variacao.tempo}</span>` : ''}
            </div>
        `;
    }
    
    card.innerHTML = `
        <button class="remove-favorite" title="Remover dos favoritos" data-key="${favorito.key}">
            <i class="fas fa-heart"></i>
        </button>
        <img src="${favorito.variacao.imagem}" alt="${favorito.variacao.titulo}" class="favorito-image" 
             onerror="this.src='imagens/imagem.png'">
        <div class="favorito-content">
            <h3 class="favorito-title">${favorito.variacao.titulo}</h3>
            <p class="favorito-description">${favorito.variacao.descricao}</p>
            ${infoHtml}
        </div>
    `;
    
    // Adiciona event listener para o botão de remover
    const removeBtn = card.querySelector('.remove-favorite');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Impede que o clique se propague para o card
        const key = e.target.closest('.remove-favorite').dataset.key;
        const buttonElement = e.target.closest('.remove-favorite');
        removeFavorito(key, buttonElement);
    });
    
    // Adiciona evento de clique para navegar para o tema
    card.addEventListener('click', (e) => {
        // Não navega se clicou no botão de remover
        if (e.target.closest('.remove-favorite')) return;
        
        // Feedback visual antes de navegar
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0.7';
        
        // Navega para a página do tema com parâmetros para abrir diretamente a variação específica
        // O parâmetro 'variacao' contém a URL da imagem codificada para identificar o modelo exato
        setTimeout(() => {
            const imageUrl = encodeURIComponent(favorito.variacao.imagem);
            window.location.href = `temas.html?tema=${favorito.temaId}&variacao=${imageUrl}`;
        }, 150);
    });
    
    return card;
}

// Função para carregar e exibir favoritos com debounce
function loadFavoritos() {
    // Cancela carregamento anterior se ainda estiver pendente
    if (loadFavoritosTimeout) {
        clearTimeout(loadFavoritosTimeout);
    }
    
    // Se já está carregando, agenda para depois
    if (isLoadingFavoritos) {
        loadFavoritosTimeout = setTimeout(() => {
            loadFavoritos();
        }, 200);
        return;
    }
    
    isLoadingFavoritos = true;
    
    const emptyState = document.getElementById('empty-state');
    const favoritosGrid = document.getElementById('favoritos-grid');
    
    const favoritos = getFavoritos();
    
    if (favoritos.length === 0) {
        // Mostra estado vazio
        emptyState.style.display = 'block';
        favoritosGrid.style.display = 'none';
        isLoadingFavoritos = false;
    } else {
        // Mostra lista de favoritos
        emptyState.style.display = 'none';
        favoritosGrid.style.display = 'grid';
        
        // Limpa a grid
        favoritosGrid.innerHTML = '';
        
        // Cria cards para cada favorito
        favoritos.forEach((favorito, index) => {
            // Cria skeleton primeiro
            const skeleton = createSkeletonCard();
            favoritosGrid.appendChild(skeleton);
            
            // Remove skeleton e adiciona card real após delay
            setTimeout(() => {
                const card = createFavoritoCard(favorito);
                favoritosGrid.replaceChild(card, skeleton);
                
                // Marca como concluído quando o último card for adicionado
                if (index === favoritos.length - 1) {
                    isLoadingFavoritos = false;
                }
            }, 200 * (index + 1));
        });
    }
}

// Função para criar skeleton de loading
function createSkeletonCard() {
    const skeleton = document.createElement('div');
    skeleton.className = 'favorito-skeleton';
    skeleton.innerHTML = `
        <div class="skeleton-img"></div>
        <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-desc"></div>
        </div>
    `;
    return skeleton;
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Iniciando página de favoritos...');
    
    // Carrega os temas primeiro
    await loadTemasFromJSON();
    
    // Carrega os favoritos após um pequeno delay
    setTimeout(() => {
        loadFavoritos();
    }, 500);
});

// Escuta mudanças no localStorage para atualizar em tempo real
window.addEventListener('storage', function(e) {
    if (e.key && e.key.startsWith('pretty_saved_')) {
        loadFavoritos();
    }
});