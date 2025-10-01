// Configuração dos temas - carregado dinamicamente do JSON
let temasConfig = {};

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

// Função para carregar temas do arquivo JSON
async function loadTemasFromJSON() {
    try {
        console.log('Tentando carregar temas do JSON...');
        const response = await fetch('../../data/temas.json');
        console.log('Resposta do fetch:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dados carregados do JSON:', data);
        
        // Converte o formato JSON para o formato esperado pelo código existente
        temasConfig = {};
        for (const [key, tema] of Object.entries(data)) {
            temasConfig[key] = {
                nome: tema.nome,
                icon: tema.icone,
                categoria: tema.categoria,
                popularidade: tema.popularidade,
                duracao: tema.duracao,
                descricao: tema.descricao,
                tags: tema.tags,
                preco_base: tema.preco_base,
                dificuldade: tema.dificuldade,
                variacoes: tema.variacoes.map(variacao => ({
                    titulo: variacao.titulo,
                    imagem: variacao.imagem,
                    descricao: variacao.descricao,
                    preco: variacao.preco,
                    tempo: variacao.tempo
                }))
            };
        }
        
        console.log('Temas carregados com sucesso:', Object.keys(temasConfig));
        return true;
    } catch (error) {
        console.error('Erro ao carregar temas do JSON:', error);
        
        console.log('Usando dados de fallback. Temas disponíveis:', Object.keys(temasConfig));
        return false;
    }
}

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
document.addEventListener('DOMContentLoaded', async function() {
    // Carrega os temas do JSON primeiro
    await loadTemasFromJSON();
    
    // Aguarda o skeleton loader estar disponível
    setTimeout(() => {
        initializePage();
    }, 100);
});

async function initializePage() {
    // Detecta o tema pela URL ou usa um padrão
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('tema') || 'nude'; // padrão: nude
    const variacaoParam = urlParams.get('variacao'); // variação específica para abrir
    
    console.log('Tema detectado da URL:', themeParam);
    console.log('Variação específica:', variacaoParam);
    console.log('Temas disponíveis:', Object.keys(temasConfig));
    
    currentTheme = temasConfig[themeParam];
    
    if (!currentTheme) {
        console.error('Tema não encontrado:', themeParam);
        currentTheme = temasConfig.nude || Object.values(temasConfig)[0]; // fallback
    }
    
    console.log('Tema atual:', currentTheme);
    
    // Simula carregamento
    setTimeout(() => {
        loadThemeContent();
        
        // Se há uma variação específica, abre ela automaticamente
        if (variacaoParam) {
            const imageUrl = decodeURIComponent(variacaoParam);
            const variacao = currentTheme.variacoes.find(v => v.imagem === imageUrl);
            if (variacao) {
                setTimeout(() => {
                    openDetail(variacao);
                }, 500); // Pequeno delay para garantir que a galeria foi carregada
            }
        }
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
    
    // Constrói as informações extras (preço e tempo)
    let extraInfo = '';
    if (variacao.preco || variacao.tempo) {
        extraInfo = '<div class="card-info">';
        if (variacao.preco) {
            extraInfo += `<span class="price">R$ ${variacao.preco.toFixed(2)}</span>`;
        }
        if (variacao.tempo) {
            extraInfo += `<span class="time"><i class="fas fa-clock"></i> ${variacao.tempo}</span>`;
        }
        extraInfo += '</div>';
    }
    
    card.innerHTML = `
        <img src="${variacao.imagem}" alt="${variacao.titulo}" class="theme-image" 
             onerror="this.src='imagens/imagem.png'">
        <div class="theme-title">${variacao.titulo}</div>
        ${extraInfo}
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

    // Adiciona informações extras de preço e tempo
    let existingInfo = detail.querySelector('.detail-extra-info');
    if (existingInfo) {
        existingInfo.remove();
    }
    
    if (variacao.preco || variacao.tempo) {
        const extraInfo = document.createElement('div');
        extraInfo.className = 'detail-extra-info';
        extraInfo.style.cssText = `
            display: flex;
            gap: 15px;
            margin: 15px 0;
            padding: 12px;
            background: rgba(255, 192, 203, 0.1);
            border-radius: 8px;
            font-size: 0.9rem;
        `;
        
        let infoContent = '';
        if (variacao.preco) {
            infoContent += `<span style="color: #e91e63; font-weight: 600;"><i class="fas fa-tag"></i> Preço médio:R$ ${variacao.preco.toFixed(2)}</span>`;
        }
        if (variacao.tempo) {
            infoContent += `<span style="color: #666;"><i class="fas fa-clock"></i> Tempo médio: ${variacao.tempo}</span>`;
        }
        
        extraInfo.innerHTML = infoContent;
        desc.parentNode.insertBefore(extraInfo, desc.nextSibling);
    }

    currentKey = encodeURIComponent(variacao.imagem);

    gallery.style.display = 'none';
    detail.classList.add('active');
    
    if (saveBtn) {
        updateSaveUI();
    }
}

// Event listeners para navegação
// Botão de voltar do card de detalhes para a galeria
const backToGalleryBtn = document.getElementById('backToGallery');
if (backToGalleryBtn) {
    backToGalleryBtn.addEventListener('click', () => {
        const detail = document.getElementById('detail');
        const gallery = document.getElementById('gallery');
        if (detail && gallery) {
            detail.classList.remove('active');
            gallery.style.display = 'grid';
        }
    });
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
        console.log('Botão de salvar clicado!');
        if (!currentKey) return;
        const willSave = !isSaved(currentKey);
        setSaved(currentKey, willSave);
        updateSaveUI();
        
        // Toca o áudio de favoritar
        console.log('Tocando áudio de favoritar...');
        playFavoriteSound();
    });
}