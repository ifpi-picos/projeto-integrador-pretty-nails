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
                    <span class="star" data-value="1">★</span>
                    <span class="star" data-value="2">★</span>
                    <span class="star" data-value="3">★</span>
                    <span class="star" data-value="4">★</span>
                    <span class="star" data-value="5">★</span>
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
function setupStarRating() {
    document.querySelectorAll('.rating').forEach(ratingDiv => {
        const stars = Array.from(ratingDiv.querySelectorAll('.star'));
        let selected = 0;
        stars.forEach((star, idx) => {
            star.addEventListener('mouseenter', function() {
                stars.forEach((s, i) => {
                    s.classList.toggle('hovered', i <= idx);
                });
            });
            star.addEventListener('mouseleave', function() {
                stars.forEach(s => s.classList.remove('hovered'));
            });
            star.addEventListener('click', function() {
                if (selected === idx + 1) {
                    // Se clicar na mesma estrela já selecionada, desmarca todas
                    selected = 0;
                } else {
                    selected = idx + 1;
                }
                stars.forEach((s, i) => {
                    s.classList.toggle('selected', i < selected);
                });
            });
        });
    });

    // Simula o envio de feedback
    document.querySelectorAll('.submit-feedback').forEach(button => {
        button.addEventListener('click', function() {
            const requestItem = this.closest('.request-item');
            const stars = requestItem.querySelectorAll('.star.selected').length;
            if (stars === 0) {
                alert('Por favor, selecione uma avaliação');
                return;
            }
            alert('Avaliação enviada com sucesso! (Simulação)');
            requestItem.querySelector('.feedback-section').innerHTML = `
                <p style="text-align: center; color: green;">Obrigado pelo seu feedback!</p>
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