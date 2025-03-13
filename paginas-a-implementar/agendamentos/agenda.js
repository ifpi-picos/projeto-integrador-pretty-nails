document.addEventListener("DOMContentLoaded", carregarHorarios);

function adicionarHorario(dia) {
    let inputHora = document.querySelector(`#hora-${dia}`);
    let horario = inputHora.value;

    if (horario) {
        let lista = document.querySelector(`#${dia} .lista-horarios`);

        if (!horarioJaExiste(lista, horario)) {
            let novoHorario = criarItemHorario(dia, horario);
            lista.appendChild(novoHorario);
            salvarHorarios();
        } else {
            alert("Este horário já foi adicionado.");
        }
    } else {
        alert("Por favor, insira um horário válido.");
    }
}

function criarItemHorario(dia, horario) {
    let item = document.createElement("li");
    item.className = "horario-item";
    item.innerHTML = `
        ${horario} <button class="remover-horario">X</button>
    `;

    item.querySelector(".remover-horario").onclick = function () {
        item.remove();
        salvarHorarios();
    };

    return item;
}

function horarioJaExiste(lista, horario) {
    let horarios = lista.querySelectorAll(".horario-item");
    return Array.from(horarios).some(item => item.textContent.includes(horario));
}

function salvarHorarios() {
    let dados = {};
    document.querySelectorAll(".dia").forEach(dia => {
        let id = dia.id;
        let horarios = Array.from(dia.querySelectorAll(".horario-item"))
            .map(item => item.textContent.replace("X", "").trim());
        dados[id] = horarios;
    });
    localStorage.setItem("horarios", JSON.stringify(dados));
}

function carregarHorarios() {
    let dados = JSON.parse(localStorage.getItem("horarios")) || {};
    for (let dia in dados) {
        let lista = document.querySelector(`#${dia} .lista-horarios`);
        dados[dia].forEach(horario => {
            let item = criarItemHorario(dia, horario);
            lista.appendChild(item);
        });
    }
}