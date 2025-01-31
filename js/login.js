async function loginUsuario() {
  const campoEmail = document.querySelector("#email");
  const campoSenha = document.querySelector("#senha");

  const email = campoEmail.value;
  const password = campoSenha.value;

  try {
    const resposta = await fetch('https://back-end-u9vj.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!resposta.ok) {
      throw new Error('Email ou senha inválidos');
    }

    const { user, token } = await resposta.json();

    // Salva apenas o token no localStorage (não armazene informações sensíveis)
    localStorage.setItem('token', token);

    // Redireciona para a página inicial
    window.location.href = 'https://nailan-nobre.github.io/pretty-nails-mobile-prototipo/www/';
  } catch (error) {
    console.error('Erro no login:', error);
    alert('Erro ao realizar login. Tente novamente mais tarde.');
  }
}
