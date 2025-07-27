function sortAgendamentos(agendamentos) {
    // Definir a ordem de prioridade dos status
    const statusOrder = {
        'pendente': 1,
        'confirmado': 2,
        'concluido': 3,
        'cancelado': 4
    };

    // Ordenar os agendamentos
    return agendamentos.sort((a, b) => {
        // Primeiro ordena por status
        const statusComparison = statusOrder[a.status] - statusOrder[b.status];
        if (statusComparison !== 0) return statusComparison;

        // Se status for igual, ordena por data (mais recente primeiro)
        return new Date(b.data_hora) - new Date(a.data_hora);
    });
}

// Função para renderizar os dados com a ordenação correta
function renderManicures(agendamentos) {
    const container = document.getElementById('manicures-container');
    container.innerHTML = '';

    // Ordenar os agendamentos antes de renderizar
    const sortedAgendamentos = sortAgendamentos(agendamentos);

    if (sortedAgendamentos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <p>Nenhum agendamento encontrado</p>
            </div>
        `;
        return;
    }

    sortedAgendamentos.forEach(agendamento => {
        const manicure = agendamento.manicure || {};
        const date = new Date(agendamento.data_hora);
        const dateStr = date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });

        const manicureCard = document.createElement('div');
        manicureCard.className = 'manicure-card';

        manicureCard.innerHTML = `
            <div class="manicure-header">
                <img src="${manicure.foto || 'imagens/user.png'}" alt="${manicure.nome || 'Manicure'}" class="manicure-photo">
                <div class="manicure-info">
                    <h3>${manicure.nome || 'Manicure'}</h3>
                    <span class="status-badge status-${agendamento.status}">${formatStatus(agendamento.status)}</span>
                </div>
            </div>
            <div class="requests-list">
                ${createRequestHtml({
            id: agendamento.id,
            data: agendamento.data_hora,
            horaInicio: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            horaFim: '', // Se houver horaFim, adicione aqui
            status: agendamento.status,
            feedback: agendamento.feedback,
            servico: agendamento.servico,
            observacoes: agendamento.observacoes
        })}
            </div>
        `;

        container.appendChild(manicureCard);
    });
    setupStarRating(); // Ativa os eventos de avaliação
}

// Função para formatar o status para exibição
function formatStatus(status) {
    const statusMap = {
        'pendente': 'Pendente',
        'confirmado': 'Confirmado',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
}

// Função para criar o HTML de cada requisição (mantida igual)
function createRequestHtml(request) {
    const date = new Date(request.data);
    const dateStr = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    let feedbackHtml = '';
    if (request.status === 'concluido' && !request.feedback) {
        feedbackHtml = `
            <div class="feedback-section">
                <h4>Avalie o serviço:</h4>
                
                <div class="rating" data-request-id="${request.id}">
    <input type="radio" id="star5" name="rating" value="5" />
    <label for="star5">★</label>
    <input type="radio" id="star4" name="rating" value="4" />
    <label for="star4">★</label>
    <input type="radio" id="star3" name="rating" value="3" />
    <label for="star3">★</label>
    <input type="radio" id="star2" name="rating" value="2" />
    <label for="star2">★</label>
    <input type="radio" id="star1" name="rating" value="1" />
    <label for="star1">★</label>
</div>
                <h4>Escreva sobre sua experiência:</h4>
                <div class="text-container">
                    <textarea id="text-feedback"></textarea>
                </div>
                <button class="submit-feedback">Enviar Avaliação</button>
            </div>
        `;
    }

    return `
        <div class="request-item" data-request-id="${request.id}">
            <div class="request-meta">
                <div class="request-date">${dateStr}</div>
                <div class="request-time">${request.horaInicio}${request.horaFim ? ' às ' + request.horaFim : ''}</div>
            </div>
            <div class="request-details">
                <div class="detail-row">
                    <i class="fas fa-hand-sparkles"></i>
                    <span>${request.servico}</span>
                </div>
                ${request.observacoes ? `
                <div class="detail-row">
                    <i class="fas fa-comment"></i>
                    <span>${request.observacoes}</span>
                </div>
                ` : ''}
            </div>
            ${feedbackHtml}
        </div>
    `;
}

// Configura o sistema de avaliação por estrelas (mantida igual)
// Configura o sistema de avaliação por estrelas (versão corrigida para seleção múltipla)
function setupStarRating() {
    document.querySelectorAll('.rating').forEach(ratingDiv => {
        const stars = ratingDiv.querySelectorAll('.star');
        let selectedRating = 0;
        let hoverRating = 0;

        // Adiciona eventos para cada estrela
        stars.forEach(star => {
            const value = parseInt(star.getAttribute('data-value'));

            // Mouse entra na estrela
            star.addEventListener('mouseenter', () => {
                if (selectedRating === 0) { // Só mostra hover se nenhuma estrela estiver selecionada
                    hoverRating = value;
                    updateStars();
                }
            });

            // Mouse sai da estrela
            star.addEventListener('mouseleave', () => {
                hoverRating = 0;
                updateStars();
            });

            // Clica na estrela
            star.addEventListener('click', () => {
                selectedRating = value;
                updateStars();

                // Atualiza o valor escondido para o formulário (se necessário)
                ratingDiv.setAttribute('data-selected', selectedRating);
            });
        });

        // Atualiza a aparência das estrelas
        function updateStars() {
            stars.forEach(star => {
                const value = parseInt(star.getAttribute('data-value'));

                // Estrela selecionada (amarela sólida)
                star.classList.toggle('selected', value <= selectedRating);

                // Estrela com hover (amarelo claro, apenas quando não selecionada e sem seleção prévia)
                star.classList.toggle('hovered',
                    value <= hoverRating &&
                    selectedRating === 0
                );
            });
        }
    });

    // Envio do feedback (mantido igual)
    document.querySelectorAll('.submit-feedback').forEach(button => {
        button.addEventListener('click', function () {
            const requestItem = this.closest('.request-item');
            const rating = requestItem.querySelector('.rating')?.getAttribute('data-selected') || 0;
            const feedbackText = requestItem.querySelector('#text-feedback')?.value || '';

            if (rating === "0") {
                alert('Por favor, selecione uma avaliação com as estrelas');
                return;
            }

            // Simulação de envio (substituir por chamada real à API)
            console.log(`Avaliação: ${rating} estrelas | Feedback: ${feedbackText}`);

            // Feedback visual
            requestItem.querySelector('.feedback-section').innerHTML = `
                <div class="feedback-success">
                    <i class="fas fa-check-circle"></i>
                    <p>Avaliação enviada com sucesso!(simulação)</p>
                </div>
            `;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Faça login para ver seus agendamentos', 'error');
        return;
    }

    fetch(`${API_BASE_URL}/api/agendamentos/meus-agendamentos`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar agendamentos');
            return response.json();
        })
        .then(res => {
            const data = res.agendamentos?.comoCliente || [];
            renderManicures(data);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar agendamentos', 'error');
        });
});