document.querySelectorAll('.horario-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

document.getElementById('agendamento-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const mensagemDiv = document.getElementById('mensagem-agendamento');
  mensagemDiv.textContent = '';
  mensagemDiv.style.color = '';

  const submitBtn = this.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // Verificação robusta de autenticação
    if (!token || !userId) {
      mensagemDiv.textContent = 'Sessão expirada. Redirecionando para login...';
      mensagemDiv.style.color = 'red';
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setTimeout(() => {
        window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
      }, 2000);
      return;
    }

    const dataInput = document.getElementById('data').value;
    const horarioSelecionado = document.querySelector('.horario-btn.selected');
    const servico = document.getElementById('servico').value;
    const observacoes = document.getElementById('observacoes')?.value || '';

    if (!dataInput) {
      mensagemDiv.textContent = 'Por favor, selecione uma data.';
      mensagemDiv.style.color = 'red';
      return;
    }
    if (!horarioSelecionado) {
      mensagemDiv.textContent = 'Por favor, selecione um horário disponível.';
      mensagemDiv.style.color = 'red';
      return;
    }
    if (!servico) {
      mensagemDiv.textContent = 'Por favor, selecione um serviço.';
      mensagemDiv.style.color = 'red';
      return;
    }

    const horarioValor = horarioSelecionado.textContent.trim();
    if (!/^\d{2}:\d{2}$/.test(horarioValor)) {
      mensagemDiv.textContent = 'Horário inválido.';
      mensagemDiv.style.color = 'red';
      return;
    }

    const dataHoraCompleta = new Date(`${dataInput}T${horarioValor}:00`);
    if (isNaN(dataHoraCompleta.getTime())) {
      mensagemDiv.textContent = 'Data e horário inválidos.';
      mensagemDiv.style.color = 'red';
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const idManicure = urlParams.get('id');
    if (!idManicure) {
      mensagemDiv.textContent = 'ID da manicure não encontrado.';
      mensagemDiv.style.color = 'red';
      return;
    }

    if (dataHoraCompleta < new Date()) {
      mensagemDiv.textContent = 'Agende apenas para horários futuros.';
      mensagemDiv.style.color = 'red';
      return;
    }

    // ATUALIZAÇÃO DESTA PARTE
    const resposta = await fetch(`${API_BASE_URL}/api/agendamentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        clienteId: userId,
        manicureId: idManicure,
        dataHora: dataHoraCompleta.toISOString(),
        servico,
        observacoes,
      }),
    });

    let resultado;
    try {
      resultado = await resposta.json();
    } catch (e) {
      mensagemDiv.textContent = 'Erro inesperado ao processar a resposta do servidor.';
      mensagemDiv.style.color = 'red';
      return;
    }

    if (!resposta.ok) {
      if (resposta.status === 401) {
        localStorage.removeItem('token');
        mensagemDiv.textContent = 'Usuário não autenticado ou token inválido. Redirecionando para o login...';
        mensagemDiv.style.color = 'red';
        setTimeout(() => {
          window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
        }, 2000);
      } else if (resposta.status === 409) {
        mensagemDiv.textContent = resultado.error || 'Horário já agendado para esta manicure.';
        mensagemDiv.style.color = 'red';
      } else {
        mensagemDiv.textContent = resultado.error || resultado.message || 'Erro ao agendar horário.';
        mensagemDiv.style.color = 'red';
      }
      return;
    }

    mensagemDiv.textContent = 'Agendamento realizado com sucesso!';
    mensagemDiv.style.color = 'green';
    setTimeout(() => {
      this.reset();
      document.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('selected'));
    }, 1500);

  } catch (err) {
    console.error('Erro no agendamento:', err);
    mensagemDiv.textContent = 'Erro na conexão. Tente novamente.';
    mensagemDiv.style.color = 'red';
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});