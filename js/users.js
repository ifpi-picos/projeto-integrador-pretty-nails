// FUNÇÃO PARA ADICIONAR USUÁRIO
function adicionarUsuario() {
  const campoNome = document.querySelector("#nome").value;
  const campoEmail = document.querySelector("#email").value;
  const campoSenha = document.querySelector("#senha").value;
  const campoTelefone = document.querySelector("#telefone").value;
  const campoEstado = document.querySelector("#estado").value;
  const campoCidade = document.querySelector("#cidade").value;
  const campoTipo = document.querySelector("#tipo").value;
  const campoFoto = document.querySelector("#imagem").files[0]; // Obtém o arquivo de imagem

  const formData = new FormData();
  formData.append('name', campoNome);
  formData.append('email', campoEmail);
  formData.append('password', campoSenha);
  formData.append('telefone', campoTelefone);
  formData.append('estado', campoEstado);
  formData.append('cidade', campoCidade);
  formData.append('tipo', campoTipo);
  formData.append('foto', campoFoto); // Adiciona a imagem ao FormData

  fetch('https://back-end-u9vj.onrender.com/signup', {
  method: 'POST',
  body: formData,
  headers: {
    // NÃO definir 'Content-Type', pois o navegador já define automaticamente para `multipart/form-data`
  }
}).then(response => response.json())
  .then(data => {
    console.log("Usuário cadastrado com sucesso: ", data);
    window.location.href = 'principal.html';
  })
  .catch(error => {
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
    localStorage.setItem('email', email);

    // Redireciona para a página inicial
    window.location.href = 'principal.html';
  } catch (error) {
    console.error('Erro no login:', error);
    alert('Erro ao realizar login. Tente novamente mais tarde.');
  }
}