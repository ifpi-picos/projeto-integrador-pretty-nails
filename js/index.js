//menu caso esteja no celular (responsivo)
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

//slides passando
let currentSlide = 0;

function autoSlide() {
  const slides = document.querySelectorAll('.slide');
  currentSlide = (currentSlide + 1) % slides.length; // Reinicia ao chegar no último slide

  document.querySelector('.slides').style.transform =
    `translateX(-${currentSlide * 100}%)`;
}

setInterval(autoSlide, 5000); // Muda o slide automaticamente a cada 5 segundos

//animações de entrada dos tópicos 12 e 3.
document.addEventListener('DOMContentLoaded', function () {

  ScrollReveal().reveal('.topico1', {
    origin: 'left',
    easing: 'ease-out',
    duration: 700,
    distance: '40%'
  });

  ScrollReveal().reveal('.topico2', {
    origin: 'right',
    easing: 'ease-out',
    duration: 700,
    distance: '40%'
  });

  ScrollReveal().reveal('.topico3', {
    origin: 'left',
    easing: 'ease-out',
    duration: 700,
    distance: '40%'
  });

});

//Perguntas frequentes
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
  });
});
