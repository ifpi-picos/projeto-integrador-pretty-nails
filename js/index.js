let currentSlide = 0;

function autoSlide() {
  const slides = document.querySelectorAll('.slide');
  currentSlide = (currentSlide + 1) % slides.length; // Reinicia ao chegar no último slide

  document.querySelector('.slides').style.transform = 
    `translateX(-${currentSlide * 100}%)`;
}

// Muda o slide automaticamente a cada 5 segundos
setInterval(autoSlide, 5000);
