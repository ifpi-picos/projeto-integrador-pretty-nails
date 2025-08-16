// Calendário de Agendamentos - Pretty Nails
class CalendarioAgendamentos {
    constructor() {
        this.diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        this.meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        this.dataAtual = new Date();
        this.agendamentos = [];
        
        this.semanaEl = document.getElementById('semana');
        this.diasEl = document.getElementById('dias');
        this.mesAnoEl = document.getElementById('mesAno');
        
        this.inicializar();
    }

    async inicializar() {
        try {
            // Verificar se usuário está logado
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
                return;
            }

            // Configurar event listeners
            this.configurarEventListeners();

            // Buscar agendamentos
            await this.buscarTodosAgendamentos();
            
            // Renderizar calendário
            this.renderizarSemana();
            this.renderizarCalendario();

            // Carregar dados do usuário na sidebar
            this.carregarDadosUsuario();
        } catch (error) {
            console.error('Erro ao inicializar calendário:', error);
            this.mostrarErro('Erro ao carregar o calendário');
        }
    }

    configurarEventListeners() {
        // Navegação do calendário
        document.getElementById('anterior').addEventListener('click', () => {
            this.dataAtual.setMonth(this.dataAtual.getMonth() - 1);
            this.renderizarCalendario();
        });

        document.getElementById('proximo').addEventListener('click', () => {
            this.dataAtual.setMonth(this.dataAtual.getMonth() + 1);
            this.renderizarCalendario();
        });

        // Modal
        document.querySelector('.close').addEventListener('click', () => this.fecharModal());
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('modalAgendamento');
            if (e.target === modal) {
                this.fecharModal();
            }
        });
    }

    carregarDadosUsuario() {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.nome) {
            const userNameEl = document.getElementById('user-name');
            if (userNameEl) {
                userNameEl.textContent = userData.nome;
            }
        }
    }

    async buscarTodosAgendamentos() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            // Buscar agendamentos pendentes, confirmados e histórico
            const [pendentes, confirmados, historico] = await Promise.all([
                this.fazerRequisicao('/api/agendamentos/pendentes'),
                this.fazerRequisicao('/api/agendamentos/confirmados'),
                this.fazerRequisicao('/api/agendamentos/historico')
            ]);

            this.agendamentos = [
                ...(pendentes.agendamentos || []),
                ...(confirmados.agendamentos || []),
                ...(historico.agendamentos || [])
            ];

            console.log('Agendamentos carregados:', this.agendamentos);
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
            this.agendamentos = [];
        }
    }

    async fazerRequisicao(endpoint) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.API_BASE_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        return await response.json();
    }

    renderizarSemana() {
        this.semanaEl.innerHTML = '';
        this.diasSemana.forEach(dia => {
            const el = document.createElement('div');
            el.className = 'dia-semana';
            el.textContent = dia;
            this.semanaEl.appendChild(el);
        });
    }

    renderizarCalendario() {
        this.diasEl.innerHTML = '';
        const ano = this.dataAtual.getFullYear();
        const mes = this.dataAtual.getMonth();
        this.mesAnoEl.textContent = `${this.meses[mes]} ${ano}`;

        const primeiroDia = new Date(ano, mes, 1).getDay();
        const diasNoMes = new Date(ano, mes + 1, 0).getDate();

        // Dias vazios no início
        for (let i = 0; i < primeiroDia; i++) {
            const vazio = document.createElement('div');
            vazio.className = 'dia';
            vazio.style.visibility = 'hidden';
            this.diasEl.appendChild(vazio);
        }

        // Dias do mês
        for (let d = 1; d <= diasNoMes; d++) {
            const div = document.createElement('div');
            div.className = 'dia';
            div.innerHTML = `<div class="numero-dia">${d}</div>`;
            
            // Buscar agendamentos para este dia
            const agendamentosDoDia = this.obterAgendamentosDoDia(ano, mes, d);

            // Adicionar agendamentos ao dia
            agendamentosDoDia.forEach(agendamento => {
                const ev = document.createElement('div');
                ev.className = `agendamento status-${agendamento.status}`;
                
                const horaFormatada = new Date(agendamento.data_hora).toLocaleTimeString('pt-BR', {
                    hour: '2-digit', 
                    minute: '2-digit'
                });
                
                ev.textContent = `${horaFormatada} - ${agendamento.cliente?.nome || 'Cliente'}`;
                ev.title = `${agendamento.servico} - ${agendamento.status}`;
                ev.dataset.agendamentoId = agendamento.id;
                
                // Adicionar evento de clique
                ev.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.mostrarDetalhesAgendamento(agendamento);
                });
                
                div.appendChild(ev);
            });

            this.diasEl.appendChild(div);
        }
    }

    obterAgendamentosDoDia(ano, mes, dia) {
        return this.agendamentos.filter(agendamento => {
            const dataAgendamento = new Date(agendamento.data_hora);
            return dataAgendamento.getDate() === dia && 
                   dataAgendamento.getMonth() === mes && 
                   dataAgendamento.getFullYear() === ano;
        });
    }

    mostrarDetalhesAgendamento(agendamento) {
        const modal = document.getElementById('modalAgendamento');
        const detalhes = document.getElementById('detalhesAgendamento');
        
        const dataFormatada = new Date(agendamento.data_hora).toLocaleString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        detalhes.innerHTML = `
            <div class="detalhe-item">
                <strong>Cliente:</strong> ${agendamento.cliente?.nome || 'Cliente não informado'}
            </div>
            <div class="detalhe-item">
                <strong>Serviço:</strong> ${agendamento.servico}
            </div>
            <div class="detalhe-item">
                <strong>Data/Horário:</strong> ${dataFormatada}
            </div>
            <div class="detalhe-item">
                <strong>Status:</strong> <span class="status-badge status-${agendamento.status}">${this.formatarStatus(agendamento.status)}</span>
            </div>
            ${agendamento.observacoes ? `
            <div class="detalhe-item">
                <strong>Observações:</strong> ${agendamento.observacoes}
            </div>
            ` : ''}
        `;

        this.configurarBotoesModal(agendamento);
        modal.style.display = 'block';
    }

    configurarBotoesModal(agendamento) {
        const btnConfirmar = document.getElementById('btnConfirmar');
        const btnRecusar = document.getElementById('btnRecusar');
        const btnConcluir = document.getElementById('btnConcluir');
        const btnCancelar = document.getElementById('btnCancelar');

        // Resetar todos os botões
        [btnConfirmar, btnRecusar, btnConcluir, btnCancelar].forEach(btn => {
            btn.style.display = 'none';
            btn.onclick = null;
        });

        // Mostrar botões apropriados baseado no status
        switch(agendamento.status) {
            case 'pendente':
                btnConfirmar.style.display = 'inline-block';
                btnRecusar.style.display = 'inline-block';
                btnConfirmar.onclick = () => this.atualizarStatusAgendamento(agendamento.id, 'confirmado');
                btnRecusar.onclick = () => this.atualizarStatusAgendamento(agendamento.id, 'recusado');
                break;
            case 'confirmado':
                btnConcluir.style.display = 'inline-block';
                btnCancelar.style.display = 'inline-block';
                btnConcluir.onclick = () => this.atualizarStatusAgendamento(agendamento.id, 'concluido');
                btnCancelar.onclick = () => this.atualizarStatusAgendamento(agendamento.id, 'cancelado');
                break;
            default:
                // Para status finais (concluido, cancelado, recusado), não mostrar botões
                break;
        }
    }

    async atualizarStatusAgendamento(agendamentoId, novoStatus) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${window.API_BASE_URL}/api/agendamentos/${agendamentoId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: novoStatus })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar status');
            }

            // Recarregar agendamentos e calendário
            await this.buscarTodosAgendamentos();
            this.renderizarCalendario();
            this.fecharModal();
            
            this.mostrarSucesso(`Agendamento ${this.formatarStatus(novoStatus).toLowerCase()} com sucesso!`);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            this.mostrarErro('Erro ao atualizar agendamento');
        }
    }

    formatarStatus(status) {
        const statusMap = {
            'pendente': 'Pendente',
            'confirmado': 'Confirmado',
            'concluido': 'Concluído',
            'cancelado': 'Cancelado',
            'recusado': 'Recusado'
        };
        return statusMap[status] || status;
    }

    fecharModal() {
        document.getElementById('modalAgendamento').style.display = 'none';
    }

    mostrarSucesso(mensagem) {
        // Implementar notificação de sucesso
        alert(mensagem);
    }

    mostrarErro(mensagem) {
        // Implementar notificação de erro
        alert(mensagem);
    }
}

// Função de logout global
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new CalendarioAgendamentos();
});
