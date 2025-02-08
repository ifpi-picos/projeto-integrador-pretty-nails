// FUNÇÃO PARA ADICIONAR USUÁRIO
function adicionarUsuario() {
  const campoNome = document.querySelector("#nome").value;
  const campoEmail = document.querySelector("#email").value;
  const campoSenha = document.querySelector("#senha").value;
  const campoImagem = document.querySelector("#imagem").value;
  const campoBiografia = document.querySelector("#biografia").value;
  const campoEstado = document.querySelector("#estado").value;
  const campoCidade = document.querySelector("#cidade").value;

  const usuario = {
    name: campoNome,
    email: campoEmail,
    password: campoSenha,
    imagem: campoImagem,
    biografia: campoBiografia,
    estado: campoEstado,
    cidade: campoCidade,
  };

  fetch('https://back-end-u9vj.onrender.com/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(usuario)
  }).then(response => {
    response.json().then(data => {
      console.log("Usuário cadastrado com sucesso: ", data);
      window.location.href = 'principal.html';
    });
  }).catch(error => {
    console.log("Erro ao cadastrar usuário: ", error);
  });
}

//FUNÇÃO PARA FAZER LOGIN
async function loginUsuario() {
  const campoEmail = document.querySelector("#email").value;
  const campoSenha = document.querySelector("#senha").value;

  const usuario = {
    email: campoEmail,
    password: campoSenha
  };
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