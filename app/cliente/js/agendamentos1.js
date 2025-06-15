document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
        alert("ID da manicure não encontrado.");
        return;
    }

    // 🔐 Buscar o token do localStorage
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "login.html"; // redireciona para login, se preferir
        return;
        }
});
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    let dataAtual = new Date();
    const semanaEl = document.getElementById('semana');
    const diasEl = document.getElementById('dias');
    const mesAnoEl = document.getElementById('mesAno');

    const eventos = JSON.parse(localStorage.getItem('eventos')) || {};

    function renderizarSemana() {
      semanaEl.innerHTML = '';
      diasSemana.forEach(dia => {
        const el = document.createElement('div');
        el.className = 'dia-semana';
        el.textContent = dia;
        semanaEl.appendChild(el);
      });
    }

    function renderizarCalendario() {
      diasEl.innerHTML = '';
      const ano = dataAtual.getFullYear();
      const mes = dataAtual.getMonth();
      mesAnoEl.textContent = `${meses[mes]} ${ano}`;

      const primeiroDia = new Date(ano, mes, 1).getDay();
      const diasNoMes = new Date(ano, mes + 1, 0).getDate();

      for (let i = 0; i < primeiroDia; i++) {
        const vazio = document.createElement('div');
        vazio.className = 'dia';
        vazio.style.visibility = 'hidden';
        diasEl.appendChild(vazio);
      }

      for (let d = 1; d <= diasNoMes; d++) {
        const div = document.createElement('div');
        div.className = 'dia';
        div.innerHTML = `<div class="numero-dia">${d}</div>`;
        const chave = `${ano}-${mes + 1}-${d}`;

        if (eventos[chave]) {
          eventos[chave].forEach(texto => {
            const ev = document.createElement('div');
            ev.className = 'evento';
            ev.textContent = texto;
            div.appendChild(ev);
          });
        }

        div.addEventListener('click', () => {
          const novo = prompt(`Adicionar evento para ${d}/${mes + 1}/${ano}`);
          if (novo) {
            if (!eventos[chave]) eventos[chave] = [];
            eventos[chave].push(novo);
            localStorage.setItem('eventos', JSON.stringify(eventos));
            renderizarCalendario();
          }
        });

        diasEl.appendChild(div);
      }
    }

    document.getElementById('anterior').addEventListener('click', () => {
      dataAtual.setMonth(dataAtual.getMonth() - 1);
      renderizarCalendario();
    });

    document.getElementById('proximo').addEventListener('click', () => {
      dataAtual.setMonth(dataAtual.getMonth() + 1);
      renderizarCalendario();
    });

    renderizarSemana();
    renderizarCalendario(); 