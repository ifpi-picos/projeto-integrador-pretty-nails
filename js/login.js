async function loginUsuario() {
  const campoEmail = document.querySelector("#email");
  const campoSenha = document.querySelector("#senha");

  const email = campoEmail.value;
  const password = campoSenha.value;

  try {
    // Requisição ao servidor para obter todos os usuários
    const resposta = await fetch('https://back-end-6der.onrender.com/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!resposta.ok) {
      throw new Error('Erro ao obter dados dos usuários');
    }

    const usuarios = await resposta.json();

    // Verifica se existe um usuário com o email e senha fornecidos
    const usuarioValido = usuarios.find(
      usuario => usuario.email === email && usuario.password === password
    );

    if (usuarioValido) {
      console.log('Login realizado com sucesso!');
      // Salva os dados do usuário no localStorage e redireciona
      localStorage.setItem('name', usuarioValido.name);
      localStorage.setItem('email', usuarioValido.email);
      window.location.href = '/principal.html';
    } else {
      console.log('Email ou senha inválidos!');
      alert('Email ou senha inválidos!');
    }
  } catch (error) {
    console.error('Erro no login:', error);
    alert('Erro ao realizar login. Tente novamente mais tarde.');
  }
}
