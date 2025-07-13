// Seleção de horários
document.querySelectorAll('.horario-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// Envio do formulário de agendamento
document.getElementById('agendamento-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const mensagemDiv = document.getElementById('mensagem-agendamento');
  mensagemDiv.textContent = '';
  mensagemDiv.style.color = '';

  const submitBtn = this.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  try {
    // Verificação de autenticação
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
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

    // Obtenção dos dados do formulário
    const dataSelecionada = new Date(sessionStorage.getItem('dataSelecionada'));
    const horarioBtnSelecionado = document.querySelector('.horario-btn.selected');
    
    if (!dataSelecionada || isNaN(dataSelecionada.getTime())) {
      mensagemDiv.textContent = 'Por favor, selecione uma data válida.';
      mensagemDiv.style.color = 'red';
      return;
    }
    
    if (!horarioBtnSelecionado) {
      mensagemDiv.textContent = 'Por favor, selecione um horário disponível.';
      mensagemDiv.style.color = 'red';
      return;
    }
    
    const horario = horarioBtnSelecionado.dataset.value;
    const servico = document.getElementById('servico').value;
    const observacoes = document.getElementById('observacoes')?.value || '';

    // Validação do serviço
    if (!servico) {
      mensagemDiv.textContent = 'Por favor, selecione um serviço.';
      mensagemDiv.style.color = 'red';
      return;
    }

    // Combinação de data e horário
    const [hora, minuto] = horario.split(':');
    dataSelecionada.setHours(parseInt(hora), parseInt(minuto), 0, 0);

    // Verificação se a data/horário é futura
    if (dataSelecionada <= new Date()) {
      mensagemDiv.textContent = 'Agende apenas para horários futuros.';
      mensagemDiv.style.color = 'red';
      return;
    }

    // Obtenção do ID da manicure
    const urlParams = new URLSearchParams(window.location.search);
    const idManicure = urlParams.get('id');
    
    if (!idManicure) {
      mensagemDiv.textContent = 'ID da manicure não encontrado.';
      mensagemDiv.style.color = 'red';
      return;
    }

    // Envio para o servidor
    const resposta = await fetch(`${API_BASE_URL}/api/agendamentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        clienteId: userId,
        manicureId: idManicure,
        dataHora: dataSelecionada.toISOString(),
        servico,
        observacoes,
      }),
    });

    // Processamento da resposta
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

    // Sucesso no agendamento
    mensagemDiv.textContent = 'Agendamento realizado com sucesso!';
    mensagemDiv.style.color = 'green';
    
    // Limpeza do formulário após sucesso
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