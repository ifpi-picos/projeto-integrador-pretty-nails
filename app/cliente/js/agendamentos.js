// Dados mockados para teste visual
const mockData = [
    {
        manicure: {
            id: 1,
            nome: "Maria Silva",
            foto: "https://randomuser.me/api/portraits/women/43.jpg",
            servicos: ["Manicure", "Pedicure", "Alongamento"],
            cidade: "Picos-PI",
            bairro: "Centro"
        },
        requisicoes: [
            {
                id: 101,
                data: "2023-06-15T14:00:00",
                horaInicio: "14:00",
                horaFim: "15:00",
                status: "FINALIZADO",
                feedback: null
            },
            {
                id: 102,
                data: "2023-06-22T10:00:00",
                horaInicio: "10:00",
                horaFim: "11:00",
                status: "CONFIRMADO",
                feedback: null
            }
        ]
    },
    {
        manicure: {
            id: 2,
            nome: "Ana Souza",
            foto: "https://randomuser.me/api/portraits/women/65.jpg",
            servicos: ["Manicure", "Design de Unhas"],
            cidade: "Picos-PI",
            bairro: "Junco"
        },
        requisicoes: [
            {
                id: 201,
                data: "2023-06-18T16:00:00",
                horaInicio: "16:00",
                horaFim: "17:00",
                status: "PENDENTE",
                feedback: null
            }
        ]
    }
];

// Função para renderizar os dados
function renderManicures(data) {
    const container = document.getElementById('manicures-container');
    container.innerHTML = '';

    data.forEach(({ manicure, requisicoes }) => {
        const manicureCard = document.createElement('div');
        manicureCard.className = 'manicure-card';
        
        manicureCard.innerHTML = `
            <div class="manicure-header">
                <img src="${manicure.foto}" alt="${manicure.nome}" class="manicure-photo">
                <div class="manicure-info">
                    <h3>${manicure.nome}</h3>
                    <p>${manicure.servicos.join(' • ')}</p>
                    <p>${manicure.cidade} - ${manicure.bairro}</p>
                </div>
            </div>
            <div class="requests-list">
                ${requisicoes.map(req => createRequestHtml(req)).join('')}
            </div>
        `;
        
        container.appendChild(manicureCard);
    });

    setupStarRating();
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
    if (request.status === 'FINALIZADO' && !request.feedback) {
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

// Simula um carregamento assíncrono
setTimeout(() => {
    renderManicures(mockData);
}, 800);