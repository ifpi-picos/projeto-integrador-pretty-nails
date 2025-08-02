// Chart.js
const ctx = document.getElementById('grafico').getContext('2d');
const grafico = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
        datasets: [{
            label: 'Serviços Realizados',
            data: [12, 19, 8, 15],
            backgroundColor: '#f49ca0'
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// FullCalendar
document.addEventListener('DOMContentLoaded', function () {
    mostrarNotificacaoDesenvolvimento();
    
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        height: 400,
        dateClick: function (info) {
            alert('Dia selecionado: ' + info.dateStr);
        }
    });
    calendar.render();

    carregarHorarios();
    carregarServicos();
});

// Horários
function adicionarHorario() {
    const input = document.getElementById('inputHorario');
    const hora = input.value;
    if (hora) {
        let horarios = JSON.parse(localStorage.getItem('horarios') || '[]');
        horarios.push(hora);
        localStorage.setItem('horarios', JSON.stringify(horarios));
        input.value = '';
        carregarHorarios();
    }
}

function carregarHorarios() {
    const lista = document.getElementById('listaHorarios');
    lista.innerHTML = '';
    const horarios = JSON.parse(localStorage.getItem('horarios') || '[]');
    horarios.forEach((hora, i) => {
        const li = document.createElement('li');
        li.textContent = hora;
        lista.appendChild(li);
    });
}

// Serviços
function adicionarServico() {
    const nome = document.getElementById('nomeServico').value;
    const preco = document.getElementById('precoServico').value;
    if (nome && preco) {
        let servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
        servicos.push({ nome, preco });
        localStorage.setItem('servicos', JSON.stringify(servicos));
        document.getElementById('nomeServico').value = '';
        document.getElementById('precoServico').value = '';
        carregarServicos();
    }
}

function carregarServicos() {
    const lista = document.getElementById('listaServicos');
    lista.innerHTML = '';
    const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
    servicos.forEach((servico) => {
        const li = document.createElement('li');
        li.textContent = `${servico.nome} - R$ ${parseFloat(servico.preco).toFixed(2)}`;
        lista.appendChild(li);
    });
}



function mostrarNotificacaoDesenvolvimento() {
    Swal.fire({
        title: 'Esta tela ainda não condiz com as informações da manicure',
        text: 'Ainda estamos em desenvolvimento, mas pode desfrutar das outras funcionalidades!',
        icon: 'info',
        confirmButtonText: 'Entendi',
        confirmButtonColor: '#f49ca0',
        backdrop: `
            rgba(244, 156, 160, 0.4)
        `
    });
}