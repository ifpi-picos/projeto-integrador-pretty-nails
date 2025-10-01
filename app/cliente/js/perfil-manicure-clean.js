document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
        alert("ID da manicure não encontrado.");
        return;
    }

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        alert("ID da manicure inválido.");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "../../cadastro-e-login/cadastro-e-login.html";
        return;
    }

    try {
        const resposta = await fetch(`${API_BASE_URL}/auth/manicures/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) {
            if (resposta.status === 404) {
                throw new Error("Manicure não encontrada.");
            } else {
                throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
            }
        }

        const manicure = await resposta.json();
        preencherPerfil(manicure);
    } catch (erro) {
        console.error("Erro ao carregar dados da manicure:", erro);
        alert(erro.message || "Erro ao carregar o perfil. Tente novamente mais tarde.");
    }

    // Botão para ver feedbacks
    const feedbackBtn = document.getElementById("ver-feedbacks-btn");
    feedbackBtn.addEventListener("click", async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/feedbacks/manicure/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Erro ao buscar feedbacks");
            }

            const data = await res.json();
            const feedbacks = data.feedbacks || [];

            if (feedbacks.length === 0) {
                Swal.fire("Sem avaliações", "Esta manicure ainda não possui avaliações.", "info");
                return;
            }

            const html = feedbacks.map(fb => {
                const nome = fb.usuario.nome || "Cliente anônimo";
                const comentario = fb.comentario || "";
                const nota = parseInt(fb.estrelas) || 0;
                const foto = fb.usuario.foto || "https://cdn-icons-png.flaticon.com/512/847/847969.png";

                // Criando estrelas preenchidas e vazias
                const estrelasCheias = "★".repeat(nota);
                const estrelasVazias = "☆".repeat(5 - nota);
                const estrelas = `<span class="estrelas-ativas">${estrelasCheias}</span><span class="estrelas-inativas">${estrelasVazias}</span>`;

                return `
        <div class="avaliacao-card">
            <div class="avaliacao-header">
                <img src="${foto}" alt="Foto do cliente" class="avaliacao-foto">
                <div>
                    <p class="avaliacao-nome">${nome}</p>
                    <p class="avaliacao-estrelas">${estrelas}</p>
                </div>
            </div>
            <p class="avaliacao-comentario">"${comentario}"</p>
        </div>
    `;
            }).join("");



            Swal.fire({
                title: "Avaliações dos Clientes",
                html,
                width: 600,
                scrollbarPadding: false,
                confirmButtonText: "Fechar"
            });

        } catch (erro) {
            console.error(erro);
            Swal.fire("Erro", "Não foi possível carregar os feedbacks.", "error");
        }
    });
});


function preencherPerfil(manicure) {
    // Informações básicas
    document.getElementById("profile-img").src = manicure.foto || "imagens/user.png";
    document.getElementById("profile-img").alt = manicure.nome || "Manicure";
    document.getElementById("nome").textContent = manicure.nome || "Nome não informado";
    document.getElementById("biografia").textContent = manicure.biografia || "Biografia não disponível.";

    // Exibir avaliação (estrelas e total de feedbacks)
    const mediaEstrelas = parseFloat(manicure.estrelas) || 0;
    
    // Buscar total de feedbacks para exibir a quantidade
    fetch(`${API_BASE_URL}/feedback/manicure/${manicure.id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.ok ? response.json() : { feedbacks: [] })
    .then(data => {
        const totalFeedbacks = data.feedbacks ? data.feedbacks.length : 0;
        displayStars(mediaEstrelas, totalFeedbacks);
    })
    .catch(error => {
        console.error('Erro ao carregar feedbacks:', error);
        // Exibe apenas as estrelas sem a contagem de feedbacks
        displayStars(mediaEstrelas, 0);
    });

    document.getElementById("telefone").textContent = manicure.telefone || "Telefone não informado";
    document.getElementById("email").textContent = manicure.email || "E-mail não informado";

    // Endereço
    const endereco = `${manicure.rua || "Rua não informada"}, ${manicure.numero || ""} - ${manicure.cidade || ""}, ${manicure.estado || ""}`;
    document.getElementById("endereco").textContent = endereco;

    // Dias de trabalho - mostrar todos os dias com os selecionados destacados
    const diasContainer = document.getElementById('dias-trabalho');
    const diasAbreviados = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const diasTrabalho = manicure.dias_trabalho || [];

    // Limpa o container
    diasContainer.innerHTML = '';

    // Cria um item para cada dia da semana
    for (let i = 0; i < 7; i++) {
        const diaItem = document.createElement('div');
        const isSelected = diasTrabalho.includes(i);
        diaItem.className = isSelected ? 'day-item active' : 'day-item inactive';

        diaItem.innerHTML = `
        <div>${diasAbreviados[i]}</div>
    `;

        // Só adiciona evento de clique se o dia estiver disponível
        if (isSelected) {
            diaItem.style.cursor = 'pointer';
            diaItem.addEventListener('click', function () {
                // Remove seleção de outros dias
                document.querySelectorAll('.day-item').forEach(d => d.classList.remove('selected'));
                this.classList.add('selected');

                // Calcula a data correspondente
                const data = calcularDataParaDiaSemana(i);
                document.getElementById('data-selecionada').textContent =
                    `Data selecionada: ${formatarData(data)}`;

                // Armazena a data selecionada
                sessionStorage.setItem('dataSelecionada', data.toISOString());
            });
        }

        diasContainer.appendChild(diaItem);
    }    // Horários disponíveis
    if (manicure.horarios && Array.isArray(manicure.horarios) && manicure.horarios.length > 0) {
        const horariosContainer = document.getElementById('horarios');
        horariosContainer.innerHTML = manicure.horarios
            .map(horario => `
                <div class="horario-btn" data-value="${horario}">
                    ${horario}
                </div>
            `)
            .join('');

        // Adiciona eventos aos botões de horário
        document.querySelectorAll('.horario-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    } else {
        document.getElementById('horarios').innerHTML = '<span class="hour">Nenhum horário cadastrado</span>';
    }

    // Serviços oferecidos
    const servicosSelect = document.getElementById('servico');
    const servicosList = document.getElementById('servicos');

    // Limpa opções existentes
    servicosSelect.innerHTML = '<option value="">Selecione um serviço</option>';
    servicosList.innerHTML = '';

    if (manicure.servicos && Array.isArray(manicure.servicos) && manicure.servicos.length > 0) {
        manicure.servicos.forEach(servico => {
            // Converte o preço para número
            const preco = typeof servico.preco === 'string'
                ? parseFloat(servico.preco.replace(',', '.'))
                : servico.preco;

            // Formata o preço
            const precoFormatado = preco.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            // Adiciona ao select
            const option = document.createElement('option');
            option.value = servico.nome;
            option.textContent = `${servico.nome} (${precoFormatado})`;
            servicosSelect.appendChild(option);

            // Adiciona à lista
            const item = document.createElement('div');
            item.className = 'servico-item';
            item.innerHTML = `
                <span>${servico.nome}</span>
                <span class="price">${precoFormatado}</span>
            `;
            servicosList.appendChild(item);
        });
    } else {
        servicosList.innerHTML = '<span class="service">Nenhum serviço cadastrado</span>';
        document.getElementById('servico').innerHTML = `
        <option value="">Nenhum serviço disponível</option>
    `;
    }

    // Regras
    const regrasContainer = document.getElementById('regras');
    if (manicure.regras && Array.isArray(manicure.regras) && manicure.regras.length > 0) {
        // Junta todas as regras com quebras de linha
        const textoRegras = manicure.regras
            .map(regra => `✓ ${regra}`)
            .join('\n');

        // Cria um elemento de parágrafo para as regras
        regrasContainer.innerHTML = `
            <div class="regras-texto">
                ${textoRegras.replace(/\n/g, '<br>')}
            </div>
        `;
    } else {
        regrasContainer.innerHTML = '<div class="regras-texto">Nenhuma regra específica</div>';
    }
}

// Função para calcular a data para um dia da semana (0=Domingo, 1=Segunda, etc.)
function calcularDataParaDiaSemana(diaIndex) {
    const hoje = new Date();
    const diaAtual = hoje.getDay(); // 0-6 (Domingo-Sábado)
    const diferencaDias = (diaIndex - diaAtual + 7) % 7;

    // Se for o mesmo dia, avança 1 semana
    const diasParaAdicionar = diferencaDias === 0 ? 7 : diferencaDias;

    const data = new Date(hoje);
    data.setDate(hoje.getDate() + diasParaAdicionar);
    return data;
}

// Função para formatar a data (ex: "Quinta-feira, 15/02/2024")
function formatarData(data) {
    const opcoes = {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    return data.toLocaleDateString('pt-BR', opcoes);
}

// No seu formulário de agendamento, modifique o submit para pegar a data selecionada
document.getElementById('agendamento-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const dataSelecionada = sessionStorage.getItem('dataSelecionada');

    const data = new Date(dataSelecionada);
    const horarioSelecionado = document.querySelector('.horario-btn.selected')?.dataset.value;


    // Combine data e horário
    const [hora, minuto] = horarioSelecionado.split(':');
    data.setHours(parseInt(hora), parseInt(minuto || 0), 0, 0);

    // Agora você pode enviar 'data' para o servidor
    console.log('Data e horário selecionados:', data);

    // Inicializar modal de referências
    initReferenciaModal();
});

// Função para exibir as estrelas
function displayStars(rating, totalFeedbacks) {
    const starsContainer = document.getElementById('starsContainer');
    const ratingNumber = document.getElementById('ratingNumber');
    const ratingCount = document.getElementById('ratingCount');
    
    if (!starsContainer || !ratingNumber || !ratingCount) return;
    
    const stars = starsContainer.querySelectorAll('i');
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Reset all stars
    stars.forEach(star => {
        star.className = 'fas fa-star';
    });

    // Fill stars based on rating
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars[i].classList.add('active');
        } else if (i === fullStars && hasHalfStar) {
            stars[i].className = 'fas fa-star-half-alt active';
        }
    }

    // Update rating number and count
    ratingNumber.textContent = rating.toFixed(1);
    ratingCount.textContent = `(${totalFeedbacks} ${totalFeedbacks === 1 ? 'avaliação' : 'avaliações'})`;
}

// ===== FUNCIONALIDADE DO MODAL DE REFERÊNCIAS =====

let referenciaModalData = {
    modal: null,
    selectedTheme: null,
    temasData: null
};

// Inicializar modal de referências (chamado do DOMContentLoaded principal)
function initReferenciaModal() {
    const referenciaBtn = document.getElementById('referencia-btn');
    const modal = document.getElementById('referencia-modal');
    const fecharModal = document.getElementById('fechar-modal');
    const removerReferencia = document.getElementById('remover-referencia');

    referenciaModalData.modal = modal;

    // Abrir modal
    if (referenciaBtn) {
        referenciaBtn.addEventListener('click', abrirModalReferencia);
    }

    // Fechar modal
    if (fecharModal) {
        fecharModal.addEventListener('click', fecharModalReferencia);
    }

    // Fechar modal clicando fora
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                fecharModalReferencia();
            }
        });
    }

    // Remover referência selecionada
    if (removerReferencia) {
        removerReferencia.addEventListener('click', removerReferenciaEscolhida);
    }
}

async function abrirModalReferencia() {
    const modal = referenciaModalData.modal;
    if (!modal) return;

    // Carregar temas salvos
    await carregarTemasSalvos();
    
    // Mostrar modal
    modal.style.display = 'block';
}

function fecharModalReferencia() {
    const modal = referenciaModalData.modal;
    if (modal) {
        modal.style.display = 'none';
    }
}

async function carregarTemasSalvos() {
    try {
        // Carregar dados dos temas se ainda não foi carregado
        if (!referenciaModalData.temasData) {
            const response = await fetch('../../data/temas.json');
            referenciaModalData.temasData = await response.json();
        }

        // Buscar temas salvos no localStorage
        const temasSalvos = [];
        
        // Percorrer todos os temas e variações para encontrar os salvos
        Object.keys(referenciaModalData.temasData).forEach(categoria => {
            const tema = referenciaModalData.temasData[categoria];
            tema.variacoes.forEach((variacao, index) => {
                const key = `${categoria}_${index}`;
                if (localStorage.getItem('pretty_saved_' + key) === '1') {
                    temasSalvos.push({
                        key: key,
                        categoria: categoria,
                        variacao: variacao,
                        temaData: tema
                    });
                }
            });
        });

        // Renderizar temas salvos
        renderizarTemasSalvos(temasSalvos);

    } catch (error) {
        console.error('Erro ao carregar temas salvos:', error);
        mostrarErroCarregamento();
    }
}

function renderizarTemasSalvos(temasSalvos) {
    const container = document.getElementById('temas-salvos');
    const noThemes = document.getElementById('no-saved-themes');

    if (!container) return;

    // Limpar container
    container.innerHTML = '';

    if (temasSalvos.length === 0) {
        // Mostrar mensagem de nenhum tema salvo
        container.style.display = 'none';
        if (noThemes) {
            noThemes.style.display = 'block';
        }
        return;
    }

    // Esconder mensagem de nenhum tema
    container.style.display = 'grid';
    if (noThemes) {
        noThemes.style.display = 'none';
    }

    // Renderizar cada tema salvo
    temasSalvos.forEach(tema => {
        const card = criarCardTema(tema);
        container.appendChild(card);
    });
}

function criarCardTema(tema) {
    const card = document.createElement('div');
    card.className = 'tema-card';
    card.dataset.key = tema.key;

    card.innerHTML = `
        <img src="${tema.variacao.imagem}" alt="${tema.variacao.titulo}" 
             onerror="this.src='imagens/imagem.png'">
        <div class="tema-card-content">
            <div class="tema-card-title">${tema.variacao.titulo}</div>
            <div class="tema-card-category">${tema.temaData.titulo}</div>
        </div>
    `;

    // Adicionar evento de clique
    card.addEventListener('click', () => selecionarTema(tema, card));

    return card;
}

function selecionarTema(tema, cardElement) {
    // Remover seleção anterior
    const cards = document.querySelectorAll('.tema-card');
    cards.forEach(card => card.classList.remove('selected'));

    // Adicionar seleção atual
    cardElement.classList.add('selected');

    // Salvar tema selecionado
    referenciaModalData.selectedTheme = tema;

    // Mostrar referência selecionada
    mostrarReferenciaSelecionada(tema);

    // Fechar modal
    setTimeout(() => {
        fecharModalReferencia();
    }, 300);
}

function mostrarReferenciaSelecionada(tema) {
    const referenciaPreview = document.getElementById('referencia-selecionada');
    const referenciaImg = document.getElementById('referencia-img');

    if (referenciaPreview && referenciaImg) {
        referenciaImg.src = tema.variacao.imagem;
        referenciaImg.alt = tema.variacao.titulo;
        referenciaPreview.style.display = 'block';
    }
}

function removerReferenciaEscolhida() {
    const referenciaPreview = document.getElementById('referencia-selecionada');
    
    if (referenciaPreview) {
        referenciaPreview.style.display = 'none';
    }

    // Limpar dados selecionados
    referenciaModalData.selectedTheme = null;
}

function mostrarErroCarregamento() {
    const container = document.getElementById('temas-salvos');
    const noThemes = document.getElementById('no-saved-themes');

    if (container) {
        container.style.display = 'none';
    }

    if (noThemes) {
        noThemes.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>Erro ao carregar temas salvos.</p>
            <p>Tente novamente mais tarde.</p>
        `;
        noThemes.style.display = 'block';
    }
}

// Função para obter referência selecionada (para uso futuro no envio do agendamento)
function obterReferenciaSelecionada() {
    return referenciaModalData.selectedTheme;
}