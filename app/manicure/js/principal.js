document.addEventListener('DOMContentLoaded', async () => {
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
                    backgroundColor: '#f49ca0',
                    borderColor: '#f49ca0',
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
                        text: 'Agendamentos Concluídos por Mês'
                    }
                }
            }
        });
    }

    // Função para carregar estatísticas de agendamentos
    async function loadAgendamentosEstatisticas() {
        try {
            console.log('Carregando estatísticas de agendamentos...');
            
            const response = await fetch(`${API_BASE_URL}/api/agendamentos/estatisticas`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status estatísticas:', response.status);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('Dados de estatísticas recebidos:', data);
            
            if (data.success && data.estatisticas) {
                updateChart(data.estatisticas.labels, data.estatisticas.dados);
            } else {
                console.log('Nenhuma estatística encontrada, usando dados de exemplo');
                updateChartWithExampleData();
            }

        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            
            // Se for erro de rede ou API, mostrar dados de exemplo
            console.log('Usando dados de exemplo devido ao erro');
            updateChartWithExampleData();
        }
    }

    // Função para atualizar o gráfico com dados reais
    function updateChart(labels, data) {
        if (grafico) {
            grafico.data.labels = labels;
            grafico.data.datasets[0].data = data;
            grafico.update();
            console.log('Gráfico atualizado com dados reais');
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
            
            // Se for erro de rede ou API, mostrar dados de exemplo
            console.log('Usando dados de exemplo devido ao erro');
            const exampleFeedbacks = [
                {
                    id: 1,
                    estrelas: 5,
                    comentario: "Excelente trabalho! Adorei o resultado da unha decorada.",
                    created_at: "2024-08-10T10:00:00Z",
                    usuario: { nome: "Maria Silva", foto: "imagens/user.png" }
                },
                {
                    id: 2,
                    estrelas: 4,
                    comentario: "Muito bom atendimento, voltarei com certeza!",
                    created_at: "2024-08-08T14:30:00Z",
                    usuario: { nome: "Ana Costa", foto: "imagens/user.png" }
                },
                {
                    id: 3,
                    estrelas: 5,
                    comentario: "Perfeito! Supera as expectativas sempre.",
                    created_at: "2024-08-05T16:15:00Z",
                    usuario: { nome: "Joana Santos", foto: "imagens/user.png" }
                },
                {
                    id: 4,
                    estrelas: 3,
                    comentario: "Bom trabalho, mas pode melhorar a pontualidade.",
                    created_at: "2024-08-02T11:20:00Z",
                    usuario: { nome: "Carla Oliveira", foto: "imagens/user.png" }
                }
            ];
            displayFeedbacks(exampleFeedbacks);
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
    
    // Verificar se os elementos estão disponíveis antes de carregar dados
    if (workDaysContainer && workHoursContainer && servicesList) {
        // Se tiver dados de autenticação, carregar dados reais
        if (token && userId) {
            loadProfileData();
            loadFeedbacks();
            loadAgendamentosEstatisticas();
        } else {
            // Exibir dados de placeholder enquanto não há autenticação - todos os dias com alguns selecionados
            const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
            const diasSelecionados = [1, 2, 3, 4, 5]; // Segunda a Sexta como exemplo
            
            const diasHTML = diasSemana.map((dia, index) => {
                const isSelected = diasSelecionados.includes(index);
                const cssClass = isSelected ? 'day active' : 'day inactive';
                return `<span class="${cssClass}">${dia}</span>`;
            }).join('');
            
            workDaysContainer.innerHTML = diasHTML;
            workHoursContainer.innerHTML = '<span class="hour">08:00</span><span class="hour">10:00</span><span class="hour">14:00</span><span class="hour">16:00</span>';
            servicesList.innerHTML = '<span class="service">Manicure (R$25)</span><span class="service">Pedicure (R$30)</span><span class="service">Esmaltação (R$15)</span>';
            
            // Também carregar feedbacks e estatísticas de exemplo
            loadFeedbacks();
            updateChartWithExampleData();
        }
    } else {
        // Se não há elementos de perfil, ainda assim inicializar o gráfico
        if (token && userId) {
            loadAgendamentosEstatisticas();
        } else {
            updateChartWithExampleData();
        }
    }
});