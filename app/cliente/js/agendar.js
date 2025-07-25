// Seleção de horários (permanece igual)
document.querySelectorAll('.horario-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// Envio do formulário de agendamento modificado
document.getElementById('agendamento-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const submitBtn = this.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  try {
    // Verificação de autenticação
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      await Swal.fire({
        icon: 'error',
        title: 'Sessão expirada',
        text: 'Redirecionando para login...',
        confirmButtonColor: '#FF6B6B'
      });
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
      await Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Por favor, selecione uma data válida.',
        confirmButtonColor: '#FF6B6B'
      });
      return;
    }
    
    if (!horarioBtnSelecionado) {
      await Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Por favor, selecione um horário disponível.',
        confirmButtonColor: '#FF6B6B'
      });
      return;
    }
    
    const horario = horarioBtnSelecionado.dataset.value;
    const servico = document.getElementById('servico').value;
    const observacoes = document.getElementById('observacoes')?.value || '';

    // Validação do serviço
    if (!servico) {
      await Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Por favor, selecione um serviço.',
        confirmButtonColor: '#FF6B6B'
      });
      return;
    }

    // Combinação de data e horário
    const [hora, minuto] = horario.split(':');
    dataSelecionada.setHours(parseInt(hora), parseInt(minuto), 0, 0);

    // Verificação se a data/horário é futura
    if (dataSelecionada <= new Date()) {
      await Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Agende apenas para horários futuros.',
        confirmButtonColor: '#FF6B6B'
      });
      return;
    }

    // Obtenção do ID da manicure
    const urlParams = new URLSearchParams(window.location.search);
    const idManicure = urlParams.get('id');
    
    if (!idManicure) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'ID da manicure não encontrado.',
        confirmButtonColor: '#FF6B6B'
      });
      return;
    }

    // Mostrar loading
    Swal.fire({
      title: 'Processando agendamento...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

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
      throw new Error('Erro inesperado ao processar a resposta do servidor.');
    }

    if (!resposta.ok) {
      if (resposta.status === 401) {
        localStorage.removeItem('token');
        await Swal.fire({
          icon: 'error',
          title: 'Acesso negado',
          text: 'Usuário não autenticado ou token inválido. Redirecionando para o login...',
          confirmButtonColor: '#FF6B6B'
        });
        setTimeout(() => {
          window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
        }, 2000);
      } else if (resposta.status === 409) {
        await Swal.fire({
          icon: 'error',
          title: 'Conflito',
          text: resultado.error || 'Horário já agendado para esta manicure.',
          confirmButtonColor: '#FF6B6B'
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: resultado.error || resultado.message || 'Erro ao agendar horário.',
          confirmButtonColor: '#FF6B6B'
        });
      }
      return;
    }

    // Sucesso no agendamento
    await Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Agendamento realizado com sucesso!',
      confirmButtonColor: '#FF6B6B'
    });
    
    // Limpeza do formulário após sucesso
    this.reset();
    document.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('selected'));

  } catch (err) {
    console.error('Erro no agendamento:', err);
    await Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: err.message || 'Erro na conexão. Tente novamente.',
      confirmButtonColor: '#FF6B6B'
    });
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    Swal.close();
  }
});