
//função de login para cadastro e vice-versa
const signUpButton = document.getElementById('signUp');
const container = document.querySelector('.container');

signUpButton.addEventListener('click', () => {
    container.classList.toggle('right-panel-active');
});