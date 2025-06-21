// Função para renderizar os agendamentos para manicure
function renderSolicitacoes(agendamentos) {
    const container = document.getElementById('solicitacoes-container');
    container.innerHTML = '';

    if (agendamentos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <p>Nenhuma solicitação pendente no momento</p>
            </div>
        `;
        return;
    }

    agendamentos.forEach(agendamento => {
        // Garante que o objeto cliente sempre exista
        const cliente = agendamento.cliente || {
            nome: 'Cliente',
            foto: 'imagens/perfil_cliente.png'
        };

        const date = new Date(agendamento.data_hora);
        const dateStr = date.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const solicitacaoCard = document.createElement('div');
        solicitacaoCard.className = 'solicitacao-card';
        solicitacaoCard.dataset.id = agendamento.id;

        solicitacaoCard.innerHTML = `
            <div class="solicitacao-header">
                <img src="${cliente.foto}" alt="${cliente.nome}" class="cliente-photo">
                <div class="cliente-info">
                    <h3>${cliente.nome}</h3>
                    <div class="cliente-rating">
                        <i class="fas fa-star"></i>
                        <span>4.8</span>
                    </div>
                </div>
            </div>
            
            <div class="solicitacao-details">
                <div class="detail-row">
                    <i class="fas fa-calendar-day"></i>
                    <span>${dateStr}</span>
                </div>
                <div class="detail-row">
                    <i class="fas fa-clock"></i>
                    <span>${timeStr}</span>
                </div>
                <div class="detail-row">
                    <i class="fas fa-hand-sparkles"></i>
                    <span>${agendamento.servico}</span>
                </div>
                ${agendamento.observacoes ? `
                <div class="detail-row">
                    <i class="fas fa-comment"></i>
                    <span>${agendamento.observacoes}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="solicitacao-actions">
                <button class="btn-accept" data-id="${agendamento.id}">
                    <i class="fas fa-check"></i> Aceitar
                </button>
                <button class="btn-reject" data-id="${agendamento.id}">
                    <i class="fas fa-times"></i> Recusar
                </button>
            </div>
        `;

        container.appendChild(solicitacaoCard);
    });

    // Configura os eventos dos botões
    setupActionButtons();
}

function setupActionButtons() {
    document.querySelectorAll('.btn-accept').forEach(btn => {
        btn.addEventListener('click', () => updateAgendamentoStatus(btn.dataset.id, 'confirmado'));
    });

    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', () => updateAgendamentoStatus(btn.dataset.id, 'recusado'));
    });
}

// Função para atualizar o status do agendamento
function updateAgendamentoStatus(id, status) {
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Faça login para continuar', 'error');
        return;
    }

    fetch(`https://back-end-jf0v.onrender.com/api/agendamentos/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao atualizar agendamento');
        return response.json();
    })
    .then(data => {
        showNotification(`Agendamento ${status === 'confirmado' ? 'aceito' : 'recusado'} com sucesso`, 'success');
        // Remove o card da solicitação
        document.querySelector(`.solicitacao-card[data-id="${id}"]`).remove();
        
        // Se não houver mais solicitações, mostra o empty state
        if (document.querySelectorAll('.solicitacao-card').length === 0) {
            document.getElementById('solicitacoes-container').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-check"></i>
                    <p>Nenhuma solicitação pendente no momento</p>
                </div>
            `;
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao atualizar agendamento', 'error');
    });
}

// Função para mostrar notificação
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Carrega as solicitações quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Faça login para ver suas solicitações', 'error');
        window.location.href = 'login.html';
        return;
    }

    fetch('https://back-end-jf0v.onrender.com/api/agendamentos/pendentes', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao carregar solicitações');
        return response.json();
    })
   .then(data => {
    renderSolicitacoes(data.agendamentos || []);
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao carregar solicitações', 'error');
    });
});