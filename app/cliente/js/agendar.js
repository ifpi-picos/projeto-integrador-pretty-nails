// Selecionar/deselecionar horário ao clicar
document.querySelectorAll('.horario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
  
  document.getElementById('agendamento-form').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para agendar.');
      return;
    }
  
    const dataInput = document.getElementById('data').value; // yyyy-mm-dd
    const horarioSelecionado = document.querySelector('.horario-btn.selected');
  
    if (!dataInput) {
      alert('Por favor, selecione uma data.');
      return;
    }
    if (!horarioSelecionado) {
      alert('Por favor, selecione um horário disponível.');
      return;
    }
  
    const servico = document.getElementById('servico').value;
    if (!servico) {
      alert('Por favor, selecione um serviço.');
      return;
    }
  
    // Para garantir que horário é valor correto, pode ter data-horario nos botões (se quiser)
    // Aqui uso texto direto, mas pode ajustar se quiser:
    const horarioValor = horarioSelecionado.textContent.trim();
  
    // Monta a data e hora ISO (exemplo: 2025-06-10T09:00:00)
    const dataHoraCompleta = new Date(`${dataInput}T${horarioValor}:00`).toISOString();
  
    // Pegue o id da manicure da URL
    const urlParams = new URLSearchParams(window.location.search);
    const idManicure = urlParams.get('id');
    if (!idManicure) {
      alert('ID da manicure não encontrado.');
      return;
    }
  
    const observacoes = document.getElementById('observacoes').value;
  
    try {
      const resposta = await fetch('https://back-end-u9vj.onrender.com/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          manicureId: Number(idManicure),
          dataHora: dataHoraCompleta,
          servico,
          observacoes,
        }),
      });
  
      let resultado;
      try {
        resultado = await resposta.json();
      } catch {
        const texto = await resposta.text();
        console.error('Resposta não é um JSON válido:', texto);
        throw new Error('Resposta inválida do servidor.');
      }
  
      if (!resposta.ok) {
        throw new Error(resultado.error || 'Erro ao agendar horário.');
      }
  
      alert('Agendamento realizado com sucesso! Entraremos em contato para confirmar.');
      this.reset();
      document.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('selected'));
  
    } catch (erro) {
      console.error('Erro ao agendar:', erro);
      alert('Falha ao agendar: ' + erro.message);
    }
  });
  