// Função para renderizar os dados
function renderManicures(agendamentos) {
    const container = document.getElementById('manicures-container');
    container.innerHTML = '';

    agendamentos.forEach(agendamento => {
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
                </div>
            </div>
            <div class="requests-list">
                <div class="request-item" data-request-id="${agendamento.id}">
                    <div class="request-date">${dateStr}</div>
                    <div class="request-time">${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div class="status status-${agendamento.status.toLowerCase()}">${agendamento.status}</div>
                    <div class="service">Serviço: ${agendamento.servico}</div>
                    <div class="observacoes">${agendamento.observacoes ? 'Obs: ' + agendamento.observacoes : ''}</div>
                </div>
            </div>
        `;

        container.appendChild(manicureCard);
    });
}

// Função para criar o HTML de cada requisição
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
                <textarea placeholder="Como foi seu atendimento?"></textarea>
                <button class="submit-feedback">Enviar Avaliação</button>
            </div>
        `;
    }

    return `
        <div class="request-item" data-request-id="${request.id}">
            <div class="request-date">${dateStr}</div>
            <div class="request-time">${request.horaInicio} às ${request.horaFim}</div>
            <div class="status status-${request.status.toLowerCase()}">${request.status}</div>
            ${feedbackHtml}
        </div>
    `;
}

// Configura o sistema de avaliação por estrelas
function setupStarRating() {
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const stars = this.parentElement.querySelectorAll('.star');
            const value = parseInt(this.getAttribute('data-value'));
            
            stars.forEach((star, index) => {
                if (index < value) {
                    star.classList.add('selected');
                } else {
                    star.classList.remove('selected');
                }
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