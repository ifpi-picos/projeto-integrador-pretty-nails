document.addEventListener('DOMContentLoaded', async () => {
    // Configuração da API
    const API_BASE_URL = window.API_BASE_URL;
    
    // Elementos do DOM
    const workDaysContainer = document.getElementById('workDays');
    const workHoursContainer = document.getElementById('workHours');
    const servicesList = document.getElementById('servicesList');
    
    // Elementos de feedback
    const feedbackContainer = document.getElementById('feedbackContainer');
    const recentFeedback = document.getElementById('recentFeedback');
    const averageRating = document.getElementById('averageRating');
    const averageStars = document.getElementById('averageStars');
    const totalReviews = document.getElementById('totalReviews');
    const viewMoreFeedback = document.getElementById('viewMoreFeedback');
    const feedbackModal = document.getElementById('feedbackModal');
    const closeFeedbackModal = document.getElementById('closeFeedbackModal');
    const allFeedbacks = document.getElementById('allFeedbacks');

    // Verificar autenticação
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

    if (!token || !userId) {
        window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
        return;
    }

    // Chart.js - será atualizado com dados reais
    let grafico;
    const ctx = document.getElementById('grafico').getContext('2d');
    
    // Inicializar gráfico com dados vazios
    function initializeChart() {
        grafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Agendamentos Concluídos',
                    data: [],
                    backgroundColor: '#FF8E8E',
                    borderColor: '#FF8E8E',
                    borderWidth: 1
                }, {
                    label: 'Agendamentos Cancelados/Recusados',
                    data: [],
                    backgroundColor: '#DC3545',
                    borderColor: '#DC3545',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    },
                    title: {
                        display: true,
                        text: 'Estatísticas de Agendamentos (Últimos 5 Meses)'
                    }
                }
            }
        });
    }

    // Função para testar conectividade com a API
    async function testAPIConnection() {
        try {
            console.log('Testando conectividade com a API...');
            const response = await fetch(`${API_BASE_URL}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Status da conexão:', response.status);
            
            if (response.ok) {
                console.log('✅ API está online');
                return true;
            } else {
                console.log('❌ API retornou erro:', response.status);
                return false;
            }
        } catch (error) {
            console.log('❌ Erro ao conectar com a API:', error.message);
            return false;
        }
    }

    // Função para mostrar gráfico vazio
    function showEmptyChart(message = 'Nenhum dado disponível') {
        if (grafico) {
            grafico.data.labels = [];
            grafico.data.datasets[0].data = [];
            grafico.data.datasets[1].data = [];
            grafico.options.plugins.title.text = message;
            grafico.update();
        }
        
        // Mostrar mensagem informativa
        showInfoMessage(message);
    }

    // Função para mostrar mensagem informativa
    function showInfoMessage(message) {
        // Remover mensagem anterior se existir
        const existingMessage = document.getElementById('chartMessage');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const chartContainer = document.querySelector('.card canvas#grafico').parentElement;
        const infoDiv = document.createElement('div');
        infoDiv.id = 'chartMessage';
        infoDiv.style.cssText = `
            background: #f8f9fa;
            color: #6c757d;
            padding: 15px;
            margin: 10px 0;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            font-size: 14px;
            text-align: center;
        `;
        infoDiv.innerHTML = message;
        
        chartContainer.appendChild(infoDiv);
    }

    // Função para carregar estatísticas de agendamentos
    async function loadAgendamentosEstatisticas() {
        // Primeiro, testar a conectividade
        const apiOnline = await testAPIConnection();
        if (!apiOnline) {
            console.error('❌ API offline');
            showEmptyChart('Servidor offline. Tente novamente mais tarde.');
            return;
        }

        try {
            console.log('Carregando estatísticas de agendamentos...');
            console.log('Token:', token ? 'Presente' : 'Ausente');
            console.log('UserId:', userId);
            console.log('API_BASE_URL:', API_BASE_URL);
            
            const response = await fetch(`${API_BASE_URL}/api/agendamentos/estatisticas`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status estatísticas:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na resposta:', errorText);
                
                if (response.status === 401) {
                    showEmptyChart('Erro de autenticação. Faça login novamente.');
                } else {
                    showEmptyChart(`Erro no servidor (${response.status})`);
                }
                return;
            }

            const data = await response.json();
            console.log('Dados de estatísticas recebidos:', data);
            
            if (data.success && data.estatisticas) {
                console.log('✅ Atualizando gráfico com dados reais da API');
                console.log('Labels:', data.estatisticas.labels);
                console.log('Dados concluídos:', data.estatisticas.dadosConcluidos);
                console.log('Dados cancelados:', data.estatisticas.dadosCancelados);
                
                // Verificar se há dados
                const totalConcluidos = data.estatisticas.totalConcluidos || 0;
                const totalCancelados = data.estatisticas.totalCancelados || 0;
                
                if (totalConcluidos === 0 && totalCancelados === 0) {
                    showEmptyChart('Nenhum agendamento encontrado nos últimos 5 meses');
                } else {
                    updateChart(data.estatisticas.labels, data.estatisticas.dadosConcluidos, data.estatisticas.dadosCancelados);
                }
            } else {
                console.log('API retornou sucesso=false ou sem estatísticas');
                console.log('Resposta completa:', data);
                showEmptyChart('Erro ao carregar dados. Tente novamente.');
            }

        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            showEmptyChart('Erro de conexão. Verifique sua internet.');
        }
    }

    // Função para atualizar o gráfico com dados reais
    function updateChart(labels, dadosConcluidos, dadosCancelados) {
        if (grafico) {
            grafico.data.labels = labels;
            grafico.data.datasets[0].data = dadosConcluidos;
            grafico.data.datasets[1].data = dadosCancelados;
            grafico.options.plugins.title.text = 'Estatísticas de Agendamentos (Últimos 5 Meses)';
            grafico.update();
            console.log('✅ Gráfico atualizado com dados reais');
            
            // Remover mensagem informativa se existir
            const messageElement = document.getElementById('chartMessage');
            if (messageElement) {
                messageElement.remove();
            }
        }
    }

    // Variáveis para o modal de histórico
    let historicoChart;
    let currentYear = new Date().getFullYear();
    let availableYears = [];

    // Função para abrir modal de histórico
    function openHistoricoModal() {
        const modal = document.getElementById('historicoModal');
        if (modal) {
            modal.classList.add('active');
            loadHistoricoData(currentYear);
        }
    }

    // Função para carregar dados do histórico
    async function loadHistoricoData(ano) {
        try {
            console.log('Carregando histórico para o ano:', ano);
            console.log('Token:', token ? 'Presente' : 'Ausente');
            console.log('UserId:', userId);
            
            const response = await fetch(`${API_BASE_URL}/api/agendamentos/historico-estatisticas?ano=${ano}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status histórico:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na resposta do histórico:', errorText);
                
                if (response.status === 401) {
                    showEmptyHistoricoChart('Erro de autenticação. Faça login novamente.');
                } else {
                    showEmptyHistoricoChart(`Erro no servidor (${response.status})`);
                }
                return;
            }

            const data = await response.json();
            console.log('Dados de histórico recebidos:', data);
            
            if (data.success && data.historico) {
                console.log('✅ Atualizando histórico com dados reais da API');
                availableYears = data.historico.anosDisponiveis;
                updateYearSelector(ano);
                
                // Verificar se há dados
                const totalConcluidos = data.historico.totalConcluidos || 0;
                const totalCancelados = data.historico.totalCancelados || 0;
                
                if (totalConcluidos === 0 && totalCancelados === 0) {
                    showEmptyHistoricoChart(`Nenhum agendamento encontrado em ${ano}`);
                    updateHistoricoStats({ totalConcluidos: 0, totalCancelados: 0 });
                } else {
                    updateHistoricoChart(data.historico.labels, data.historico.dadosConcluidos, data.historico.dadosCancelados);
                    updateHistoricoStats(data.historico);
                }
            } else {
                console.log('API retornou sucesso=false ou sem histórico');
                console.log('Resposta completa:', data);
                showEmptyHistoricoChart('Erro ao carregar dados do histórico.');
            }

        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            showEmptyHistoricoChart('Erro de conexão. Verifique sua internet.');
        }
    }

    // Função para atualizar o seletor de ano
    function updateYearSelector(selectedYear) {
        const yearDisplay = document.getElementById('currentYearDisplay');
        const prevBtn = document.getElementById('prevYearBtn');
        const nextBtn = document.getElementById('nextYearBtn');
        
        if (yearDisplay) {
            yearDisplay.textContent = selectedYear;
        }
        
        if (prevBtn) {
            prevBtn.disabled = availableYears.length === 0 || selectedYear <= Math.min(...availableYears);
        }
        
        if (nextBtn) {
            nextBtn.disabled = availableYears.length === 0 || selectedYear >= Math.max(...availableYears);
        }
    }

    // Função para atualizar gráfico do histórico
    function updateHistoricoChart(labels, dadosConcluidos, dadosCancelados) {
        const ctx = document.getElementById('historicoGrafico');
        if (!ctx) return;

        if (historicoChart) {
            historicoChart.destroy();
        }

        historicoChart = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Agendamentos Concluídos',
                    data: dadosConcluidos,
                    backgroundColor: '#FF8E8E',
                    borderColor: '#FF8E8E',
                    borderWidth: 1
                }, {
                    label: 'Agendamentos Cancelados/Recusados',
                    data: dadosCancelados,
                    backgroundColor: '#DC3545',
                    borderColor: '#DC3545',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    },
                    title: {
                        display: true,
                        text: `Histórico Completo de Agendamentos - ${currentYear}`
                    }
                }
            }
        });
    }

    // Função para atualizar estatísticas do histórico
    function updateHistoricoStats(historico) {
        const totalConcluidos = document.getElementById('totalConcluidos');
        const totalCancelados = document.getElementById('totalCancelados');
        
        if (totalConcluidos) {
            totalConcluidos.textContent = historico.totalConcluidos;
        }
        
        if (totalCancelados) {
            totalCancelados.textContent = historico.totalCancelados;
        }
    }

    // Função para mostrar estado vazio do gráfico histórico
    function showEmptyHistoricoChart() {
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        
        updateHistoricoChart(meses, new Array(12).fill(0), new Array(12).fill(0));
        updateHistoricoStats({
            totalConcluidos: 0,
            totalCancelados: 0
        });
        
        // Mostrar mensagem informativa
        showInfoMessage("Nenhum dado histórico encontrado para este ano.", "info");
    }

    // Funções para navegação de anos
    function previousYear() {
        if (availableYears.length > 0 && currentYear > Math.min(...availableYears)) {
            currentYear--;
            loadHistoricoData(currentYear);
        }
    }

    function nextYear() {
        if (availableYears.length > 0 && currentYear < Math.max(...availableYears)) {
            currentYear++;
            loadHistoricoData(currentYear);
        }
    }

    // Carregar dados do perfil
    async function loadProfileData() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/usuario/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Erro ao carregar perfil');

            const data = await response.json();

            // Dias de trabalho - mostrar todos os dias com os selecionados destacados
            const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
            const diasTrabalho = data.dias_trabalho || [];
            
            const diasHTML = diasSemana.map((dia, index) => {
                const isSelected = diasTrabalho.includes(index);
                const cssClass = isSelected ? 'day active' : 'day inactive';
                return `<span class="${cssClass}">${dia}</span>`;
            }).join('');
            
            workDaysContainer.innerHTML = diasHTML;

            // Horários
            if (data.horarios && data.horarios.length > 0) {
                const horariosHTML = data.horarios
                    .map(h => `<span class="hour">${h}</span>`)
                    .join('');
                workHoursContainer.innerHTML = horariosHTML;
            } else {
                workHoursContainer.innerHTML = '<span class="hour">Nenhum horário cadastrado</span>';
            }

            // Serviços
            if (data.servicos && data.servicos.length > 0) {
                const servicosHTML = data.servicos
                    .map(s => `<span class="service">${s.nome ? s.nome : s}${s.preco ? ` (R$${s.preco})` : ''}</span>`)
                    .join('');
                servicesList.innerHTML = servicosHTML;
            } else {
                servicesList.innerHTML = '<span class="service">Nenhum serviço cadastrado</span>';
            }

        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            showNotification('Erro ao carregar dados do perfil', 'error');
            
            // Exibir mensagens de erro nos containers
            if (workDaysContainer) workDaysContainer.innerHTML = '<span class="day">Erro ao carregar</span>';
            if (workHoursContainer) workHoursContainer.innerHTML = '<span class="hour">Erro ao carregar</span>';
            if (servicesList) servicesList.innerHTML = '<span class="service">Erro ao carregar</span>';
        }
    }

    // Função para mostrar notificações
    function showNotification(message, type) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: type === 'success' ? 'Sucesso!' : 'Erro!',
                text: message,
                icon: type,
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
            });
        } else {
            // Fallback para alert simples
            alert(`${type === 'success' ? 'Sucesso' : 'Erro'}: ${message}`);
        }
    }

    // Função para gerar estrelas
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        
        for (let i = fullStars; i < 5; i++) {
            stars += '☆';
        }
        
        return stars;
    }

    // Função para formatar data
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Função para carregar feedbacks
    async function loadFeedbacks() {
        try {
            console.log('Carregando feedbacks para manicure:', userId);
            
            const response = await fetch(`${API_BASE_URL}/feedback/manicure/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                    // Removendo Authorization já que a rota é pública
                }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                console.log('Erro na resposta:', response.status, response.statusText);
                throw new Error(`Erro ao carregar feedbacks: ${response.status}`);
            }

            const data = await response.json();
            console.log('Dados recebidos:', data);
            
            const feedbacks = data.feedbacks || [];
            console.log('Feedbacks encontrados:', feedbacks.length);

            displayFeedbacks(feedbacks);

        } catch (error) {
            console.error('Erro ao carregar feedbacks:', error);
            
            // Mostrar estado vazio em caso de erro
            displayFeedbacks([]);
        }
    }

    // Função para exibir feedbacks
    function displayFeedbacks(feedbacks) {
        if (feedbacks.length === 0) {
            recentFeedback.innerHTML = '<div class="info-box">Nenhum feedback ainda</div>';
            averageRating.textContent = '0.0';
            averageStars.innerHTML = generateStars(0);
            totalReviews.textContent = '(0 avaliações)';
            viewMoreFeedback.style.display = 'none';
            return;
        }

        // Calcular média das avaliações
        const totalStars = feedbacks.reduce((sum, feedback) => sum + feedback.estrelas, 0);
        const average = (totalStars / feedbacks.length).toFixed(1);

        // Atualizar resumo
        averageRating.textContent = average;
        averageStars.innerHTML = generateStars(parseFloat(average));
        totalReviews.textContent = `(${feedbacks.length} avaliação${feedbacks.length > 1 ? 'ões' : ''})`;

        // Mostrar últimos 3 feedbacks
        const recentFeedbacks = feedbacks.slice(0, 1);
        recentFeedback.innerHTML = recentFeedbacks.map(feedback => createFeedbackHTML(feedback)).join('');

        // Mostrar botão "Ver mais" se houver mais de 3 feedbacks
        if (feedbacks.length > 0) {
            viewMoreFeedback.style.display = 'block';
        }

        // Armazenar feedbacks para o modal
        window.allFeedbacksData = feedbacks;
    }

    // Função para criar HTML do feedback
    function createFeedbackHTML(feedback) {
        const clienteName = feedback.usuario?.nome || 'Cliente';
        const clientePhoto = feedback.usuario?.foto || 'imagens/user.png';
        const stars = generateStars(feedback.estrelas);
        const date = formatDate(feedback.created_at);
        
        return `
            <div class="feedback-item">
                <div class="feedback-header">
                    <div class="feedback-client">
                        <img src="${clientePhoto}" alt="${clienteName}" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px; vertical-align: middle;">
                        ${clienteName}
                    </div>
                    <div class="feedback-rating">${stars}</div>
                </div>
                <div class="feedback-text">${feedback.comentario || 'Sem comentário'}</div>
                <div class="feedback-date">${date}</div>
            </div>
        `;
    }

    // Função para mostrar todos os feedbacks no modal
    function showAllFeedbacks(filterStars = 'all') {
        const feedbacks = window.allFeedbacksData || [];
        
        // Filtrar feedbacks
        let filteredFeedbacks = feedbacks;
        if (filterStars !== 'all') {
            filteredFeedbacks = feedbacks.filter(feedback => feedback.estrelas === parseInt(filterStars));
        }

        // Atualizar contadores
        const counts = {
            all: feedbacks.length,
            5: feedbacks.filter(f => f.estrelas === 5).length,
            4: feedbacks.filter(f => f.estrelas === 4).length,
            3: feedbacks.filter(f => f.estrelas === 3).length,
            2: feedbacks.filter(f => f.estrelas === 2).length,
            1: feedbacks.filter(f => f.estrelas === 1).length,
        };

        // Atualizar contadores na interface
        Object.keys(counts).forEach(key => {
            const countElement = document.getElementById(`count${key === 'all' ? 'All' : key}`);
            if (countElement) {
                countElement.textContent = `(${counts[key]})`;
            }
        });

        // Exibir feedbacks filtrados
        if (filteredFeedbacks.length === 0) {
            allFeedbacks.innerHTML = '<div class="info-box">Nenhum feedback encontrado para este filtro</div>';
        } else {
            allFeedbacks.innerHTML = filteredFeedbacks.map(feedback => createFeedbackHTML(feedback)).join('');
        }
    }

    // Event listeners para o modal
    viewMoreFeedback.addEventListener('click', () => {
        feedbackModal.classList.add('active');
        showAllFeedbacks();
    });

    closeFeedbackModal.addEventListener('click', () => {
        feedbackModal.classList.remove('active');
    });

    // Fechar modal ao clicar fora
    feedbackModal.addEventListener('click', (e) => {
        if (e.target === feedbackModal) {
            feedbackModal.classList.remove('active');
        }
    });

    // Event listeners para filtros de estrelas
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('star-filter') || e.target.closest('.star-filter')) {
            const button = e.target.classList.contains('star-filter') ? e.target : e.target.closest('.star-filter');
            const stars = button.dataset.stars;
            
            // Atualizar botões ativos
            document.querySelectorAll('.star-filter').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrar feedbacks
            showAllFeedbacks(stars);
        }
    });

    // Função para mostrar notificação de desenvolvimento
    function mostrarNotificacaoDesenvolvimento() {
        console.log('Tela em desenvolvimento');
    }

    // Inicialização
    mostrarNotificacaoDesenvolvimento();
    
    // Inicializar gráfico
    initializeChart();
    
    // Como chegamos até aqui, significa que temos token e userId (senão teria redirecionado)
    // Sempre carregar dados reais
    console.log('Iniciando carregamento de dados reais...');
    
    // Carregar estatísticas do gráfico sempre
    loadAgendamentosEstatisticas();
    
    // Verificar se os elementos estão disponíveis antes de carregar dados do perfil
    if (workDaysContainer && workHoursContainer && servicesList) {
        loadProfileData();
        loadFeedbacks();
    } else {
        console.log('Elementos do perfil não encontrados, carregando apenas estatísticas');
    }

    // Event listeners para modal de histórico
    const viewHistoricoBtn = document.getElementById('viewHistorico');
    const historicoModal = document.getElementById('historicoModal');
    const closeHistoricoModal = document.getElementById('closeHistoricoModal');
    const prevYearBtn = document.getElementById('prevYearBtn');
    const nextYearBtn = document.getElementById('nextYearBtn');

    if (viewHistoricoBtn) {
        viewHistoricoBtn.addEventListener('click', openHistoricoModal);
    }

    if (closeHistoricoModal) {
        closeHistoricoModal.addEventListener('click', () => {
            historicoModal.classList.remove('active');
        });
    }

    if (prevYearBtn) {
        prevYearBtn.addEventListener('click', previousYear);
    }

    if (nextYearBtn) {
        nextYearBtn.addEventListener('click', nextYear);
    }

    // Fechar modal ao clicar fora
    if (historicoModal) {
        historicoModal.addEventListener('click', (e) => {
            if (e.target === historicoModal) {
                historicoModal.classList.remove('active');
            }
        });
    }

    // Expor funções globalmente para uso em HTML
    window.openHistoricoModal = openHistoricoModal;
    window.previousYear = previousYear;
    window.nextYear = nextYear;
});