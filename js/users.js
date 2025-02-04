//FUNÇÃO PARA ADICIONAR USUÁRIO
async function adicionarUsuario() {
  const campoNome = document.querySelector("#nome");
  const campoEmail = document.querySelector("#email");
  const campoSenha = document.querySelector("#senha");

  const usuario = {
    name: campoNome.value,
    email: campoEmail.value,
    password: campoSenha.value,
  };

  try {
    const resposta = await fetch('https://back-end-u9vj.onrender.com/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      console.error('Erro no cadastro:', erro);
      alert(`Erro ao realizar cadastro: ${erro.message || 'Tente novamente mais tarde.'}`);
      return;
    }

    console.log('Cadastro realizado com sucesso!!');
    const user = await resposta.json();
    localStorage.setItem('name', user.name);
    window.location.href = 'principal.html';
  } catch (error) {
    console.error('Erro no cadastro:', error);
    alert('Erro ao realizar cadastro. Verifique sua conexão ou tente mais tarde.');
  }
}


//FUNÇÃO PARA FAZER LOGIN
async function loginUsuario() {
  const campoEmail = document.querySelector("#email");
  const campoSenha = document.querySelector("#senha");

  const usuario = {
    email: campoEmail.value,
    password: campoSenha.value
  }

  try {
    const resposta = await fetch('https://back-end-u9vj.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    if (!resposta.ok) {
      throw new Error('Email ou senha inválidos');
    }

    const { user, token } = await resposta.json();

    localStorage.setItem('token', token);

    // Redireciona para a página inicial
    window.location.href = 'principal.html';
  } catch (error) {
    console.error('Erro no login:', error);
    alert('Erro ao realizar login. Tente novamente mais tarde.');
  }
}