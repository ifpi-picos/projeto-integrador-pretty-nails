function sortAgendamentos(agendamentos) {
    // Definir a ordem de prioridade dos status
    const statusOrder = {
        'pendente': 1,
        'confirmado': 2,
        'concluido': 3,
        'recusado': 4,
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
            status: agendamento.status,
            feedback: agendamento.feedback,
            manicureId: manicure.id,
            servico: agendamento.servico,
            observacoes: agendamento.observacoes
        })}
            </div>
        `;

        container.appendChild(manicureCard);
    });
    setupStarRating();
}

// Função para formatar o status para exibição
function formatStatus(status) {
    const statusMap = {
        'pendente': 'Pendente',
        'confirmado': 'Confirmado',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado',
        'recusado': 'Recusado'
    };
    return statusMap[status] || status;
}

function createRequestHtml(request) {
    const date = new Date(request.data);
    const dateStr = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    let feedbackHtml = '';
    if (request.status === 'concluido' && !request.avaliado) {
        // Mostra formulário para novo feedback APENAS se não estiver avaliado
        feedbackHtml = `
            <div class="feedback-section">
                <h4>Avalie o serviço:</h4>
                <div class="rating" data-request-id="${request.id}">
                    <input type="radio" id="star5-${request.id}" name="rating-${request.id}" value="5" />
                    <label for="star5-${request.id}" class="star">★</label>
                    <input type="radio" id="star4-${request.id}" name="rating-${request.id}" value="4" />
                    <label for="star4-${request.id}" class="star">★</label>
                    <input type="radio" id="star3-${request.id}" name="rating-${request.id}" value="3" />
                    <label for="star3-${request.id}" class="star">★</label>
                    <input type="radio" id="star2-${request.id}" name="rating-${request.id}" value="2" />
                    <label for="star2-${request.id}" class="star">★</label>
                    <input type="radio" id="star1-${request.id}" name="rating-${request.id}" value="1" />
                    <label for="star1-${request.id}" class="star">★</label>
                </div>
                <h4>Escreva sobre sua experiência:</h4>
                <div class="text-container">
                    <textarea id="text-feedback-${request.id}" placeholder="Conte como foi sua experiência..."></textarea>
                </div>
                <button class="submit-feedback" data-request-id="${request.id}" data-manicure-id="${request.manicureId}">
                    <i class="fas fa-paper-plane"></i> Enviar Avaliação
                </button>
            </div>
        `;
    }

    return `
        <div class="request-item" data-request-id="${request.id}">
            <div class="request-meta">
                <div class="request-date">${dateStr}</div>
                <div class="request-time">${request.horaInicio}</div>
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

function setupStarRating() {
    document.querySelectorAll('.rating').forEach(ratingDiv => {
        const stars = ratingDiv.querySelectorAll('.star');
        const inputs = ratingDiv.querySelectorAll('input[type="radio"]');

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                // Marca o input correspondente
                inputs[index].checked = true;

                // Atualiza visualização das estrelas
                stars.forEach((s, i) => {
                    s.classList.toggle('selected', i <= index);
                });
            });

            star.addEventListener('mouseover', () => {
                const checkedIndex = [...inputs].findIndex(input => input.checked);
                if (checkedIndex === -1) {
                    stars.forEach((s, i) => {
                        s.classList.toggle('hovered', i <= index);
                    });
                }
            });

            star.addEventListener('mouseout', () => {
                stars.forEach(s => s.classList.remove('hovered'));
            });
        });
    });

    // Configuração do envio de feedback
    document.querySelectorAll('.submit-feedback').forEach(button => {
        button.addEventListener('click', async function () {
            const requestId = this.getAttribute('data-request-id');
            const manicureId = this.getAttribute('data-manicure-id');
            const feedbackSection = this.closest('.feedback-section');
            const ratingInput = feedbackSection.querySelector('input[name="rating-' + requestId + '"]:checked');
            const comment = feedbackSection.querySelector('#text-feedback-' + requestId).value;

            if (!ratingInput) {
                alert('Por favor, selecione uma avaliação com as estrelas');
                return;
            }

            const rating = ratingInput.value;
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`${API_BASE_URL}/api/feedbacks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        agendamento_id: requestId,
                        manicure_id: manicureId,
                        estrelas: rating,
                        comentario: comment
                    })
                });

                if (!response.ok) {
                    throw new Error('Erro ao enviar feedback');
                }

                // Atualiza a interface após envio bem-sucedido
                feedbackSection.innerHTML = `
                    <div class="feedback-success">
                        <i class="fas fa-check-circle"></i>
                        <p>Avaliação enviada com sucesso!</p>
                        <div class="stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
                        ${comment ? `<p class="feedback-comment">"${comment}"</p>` : ''}
                    </div>
                `;

                // Opcional: recarregar os agendamentos para atualizar a lista
                // loadAgendamentos();

            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao enviar avaliação. Tente novamente mais tarde.');
            }
        });
    });
}

// Função para carregar agendamentos
async function loadAgendamentos() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Faça login para ver seus agendamentos', 'error');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/agendamentos/meus-agendamentos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Erro ao buscar agendamentos');

        const data = await response.json();
        const agendamentos = data.agendamentos?.comoCliente || [];
        renderManicures(agendamentos);

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar agendamentos', 'error');
    }
}

// Carrega os agendamentos quando a página é carregada
document.addEventListener('DOMContentLoaded', loadAgendamentos);