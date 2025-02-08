// FUNÇÃO PARA ADICIONAR USUÁRIO
function adicionarUsuario() {
  const campoNome = document.querySelector("#nome").value;
  const campoEmail = document.querySelector("#email").value;
  const campoSenha = document.querySelector("#senha").value;

  const usuario = {
    name: campoNome,
    email: campoEmail,
    password: campoSenha,
  };

  fetch('https://back-end-u9vj.onrender.com/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(usuario)
  }).then(response => {
    response.json().then(data => {
      console.log("Usuário cadastrado com sucesso: ", data)
      window.location.href = '/principal.html'
    })
  }).catch(error => {
    console.log("Erro ao cadastrar usuário: ", error)
  })

}

//FUNÇÃO PARA FAZER LOGIN
function login() {
  const campoEmail = document.querySelector("#email").value;
  const campoSenha = document.querySelector("#senha").value;

  const usuario = {
    email: campoEmail,
    password: campoSenha,
  };

  fetch('https://back-end-u9vj.onrender.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(usuario)
  }).then(response => {
    response.json().then(data => {
      console.log("Usuário logado com sucesso: ", data)
      const { user, token } = data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(usuario))
      window.location.href = '/principal.html'
    })
  }).catch(error => {
    console.log("Erro ao logar usuário: ", error)
  })
}