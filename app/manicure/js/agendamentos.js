// Função para renderizar as solicitações pendentes (código original mantido)
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
        const cliente = agendamento.cliente || {
            nome: 'Cliente',
            foto: 'imagens/user.png'
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

}

function updateAgendamentoStatus(id, status) {
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Faça login para continuar', 'error');
        return;
    }

    fetch(`${API_BASE_URL}/api/agendamentos/${id}/status`, {
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
        document.querySelector(`.solicitacao-card[data-id="${id}"]`).remove();
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

// NOVAS FUNÇÕES PARA TABS E AGENDAMENTOS POR STATUS

function renderAgendamentos(containerId, agendamentos, type) {
    const container = document.getElementById(containerId);

    if (!agendamentos || agendamentos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <p>Nenhum agendamento ${getEmptyStateText(type)}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    agendamentos.forEach(agendamento => {
        const cliente = agendamento.cliente || {
            nome: 'Cliente',
            foto: 'imagens/user.png'
        };

        const date = new Date(agendamento.data_hora);
        const dateStr = date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const card = document.createElement('div');
        card.className = 'cliente-card';
        card.dataset.id = agendamento.id;

        card.innerHTML = `
            <div class="cliente-header">
                <img src="${cliente.foto}" alt="${cliente.nome}" class="cliente-photo">
                <div class="cliente-info">
                    <h3>${cliente.nome}</h3>
                </div>
                <span class="status-badge status-${agendamento.status ? agendamento.status.toLowerCase() : ''}">${agendamento.status || ''}</span>
            </div>
            <div class="agendamento-details">
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
            <div class="agendamento-actions">
                ${getActionButtons(type, agendamento.status)}
            </div>
        `;

        container.appendChild(card);
    });

    setupActionButtonsTabs(containerId, type);
}

function getEmptyStateText(type) {
    switch(type) {
        case 'pendentes': return 'pendente';
        case 'confirmados': return 'confirmado';
        case 'em_andamento': return 'em andamento';
        case 'concluidos': return 'concluído';
        case 'historico': return 'no histórico';
        default: return '';
    }
}

function getActionButtons(type, status) {
    if (type === 'pendentes') {
        return `
            <button class="action-button btn-confirm" data-action="confirmar">
                <i class="fas fa-check"></i> Confirmar
            </button>
            <button class="action-button btn-cancel" data-action="recusar">
                <i class="fas fa-times"></i> Recusar
            </button>
        `;
    }

    if (type === 'confirmados') {
        if (status === 'confirmado') {
            return `
                <button class="action-button btn-secondary" data-action="iniciar">
                    <i class="fas fa-play"></i> Iniciar
                </button>
                <button class="action-button btn-cancel" data-action="cancelar">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            `;
        }
        return '';
    }

    if (type === 'em_andamento') {
        if (status === 'em_andamento') {
            return `
                <button class="action-button btn-confirm" data-action="concluir">
                    <i class="fas fa-flag-checkered"></i> Concluir
                </button>
            `;
        }
        return '';
    }

    // Para concluídos, histórico, etc, normalmente não há ações
    return '';
}

function setupActionButtonsTabs(containerId, type) {
    const container = document.getElementById(containerId);

    container.querySelectorAll('.action-button').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.cliente-card');
            const agendamentoId = card.dataset.id;
            const action = this.dataset.action;

            handleAgendamentoAction(agendamentoId, action, type);
        });
    });
}

async function handleAgendamentoAction(id, action, type) {
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Faça login para continuar', 'error');
        return;
    }

    let status;
    let endpoint = `${API_BASE_URL}/api/agendamentos/${id}/status`;

    switch(action) {
        case 'confirmar': status = 'confirmado'; break;
        case 'recusar': status = 'recusado'; break;
        case 'iniciar': status = 'em_andamento'; break;
        case 'concluir': status = 'concluido'; break;
        case 'cancelar': status = 'cancelado'; break;
        default: return;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error('Erro ao atualizar agendamento');

        const data = await response.json();
        showNotification(`Agendamento ${getActionSuccessMessage(action)}`, 'success');

        // Recarrega os agendamentos apropriados
        loadAgendamentos();

    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao atualizar agendamento', 'error');
    }
}

function getActionSuccessMessage(action) {
    switch(action) {
        case 'confirmar': return 'confirmado com sucesso';
        case 'recusar': return 'recusado com sucesso';
        case 'iniciar': return 'iniciado com sucesso';
        case 'concluir': return 'concluido com sucesso';
        case 'cancelar': return 'cancelado com sucesso';
        default: return 'atualizado com sucesso';
    }
}

// Função para carregar todos os agendamentos das tabs
async function loadAgendamentos() {
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Faça login para ver seus agendamentos', 'error');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Pendentes
        const pendentesResponse = await fetch(`${API_BASE_URL}/api/agendamentos/pendentes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const pendentesData = await pendentesResponse.json();
        renderAgendamentos('pendentes-container', pendentesData.agendamentos, 'pendentes');

        // Confirmados
        const confirmadosResponse = await fetch(`${API_BASE_URL}/api/agendamentos/confirmados`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const confirmadosData = await confirmadosResponse.json();
        renderAgendamentos('confirmados-container', confirmadosData.agendamentos, 'confirmados');

        // Em andamento
        const andamentoResponse = await fetch(`${API_BASE_URL}/api/agendamentos/em-andamento`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const andamentoData = await andamentoResponse.json();
        renderAgendamentos('em-andamento-container', andamentoData.agendamentos, 'em_andamento');
        
        // Em andamento
        const concluidoResponse = await fetch(`${API_BASE_URL}/api/agendamentos/concluidos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const concluidoData = await concluidoResponse.json();
        renderAgendamentos('concluido-container', concluidoData.agendamentos, 'concluidos');

        // Histórico
        const historicoResponse = await fetch(`${API_BASE_URL}/api/agendamentos/historico`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const historicoData = await historicoResponse.json();
        renderAgendamentos('historico-container', historicoData.agendamentos, 'historico');

    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao carregar agendamentos', 'error');
    }
}

// Função para mostrar notificação
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.classList.remove('show');
        notification.style.display = 'none';
    }, 3000);
}

// Configura os tabs
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-button');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.agendamentos-container').forEach(container => {
                container.classList.add('hidden');
            });
            const tabId = this.dataset.tab;
            document.getElementById(`${tabId}-container`).classList.remove('hidden');
        });
    });
}

// Carrega as solicitações pendentes ao carregar a página (mantém compatibilidade com tela antiga)
document.addEventListener('DOMContentLoaded', () => {
    // Se for página com tabs, inicializa tabs e carrega todos os agendamentos
    if (document.querySelector('.tab-button')) {
        setupTabs();
        loadAgendamentos();
        document.getElementById('pendentes-container').classList.remove('hidden');
    } else {
        // Página antiga: só solicitações pendentes
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Faça login para ver suas solicitações', 'error');
            window.location.href = 'login.html';
            return;
        }

        fetch(`${API_BASE_URL}/api/agendamentos/pendentes`, {
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
    }
});