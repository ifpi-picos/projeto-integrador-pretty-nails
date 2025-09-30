// brilho.js - Sistema de gerenciamento de animações de brilho
document.addEventListener("DOMContentLoaded", function () {
    const brilhoElements = document.querySelectorAll("[data-brilho]");
    
    // Adiciona a classe brilhante a todos os elementos com data-brilho
    brilhoElements.forEach(element => {
        element.classList.add("brilhante");
    });

    // Função para iniciar brilho em todos os elementos
    function iniciarTodosBrilhos() {
        brilhoElements.forEach(element => {
            element.classList.add("brilhante");
        });
    }

    // Função para parar brilho em todos os elementos
    function pararTodosBrilhos() {
        brilhoElements.forEach(element => {
            element.classList.remove("brilhante");
        });
    }

    // Função para iniciar brilho em elemento específico
    function iniciarBrilho(element) {
        if (element && element.hasAttribute('data-brilho')) {
            element.classList.add("brilhante");
        }
    }

    // Função para parar brilho em elemento específico
    function pararBrilho(element) {
        if (element) {
            element.classList.remove("brilhante");
        }
    }

    // Função para pausar/resumir animação
    function pausarBrilho(element) {
        if (element) {
            element.classList.add("pausado");
        }
    }

    function resumirBrilho(element) {
        if (element) {
            element.classList.remove("pausado");
        }
    }

    // Função para alterar velocidade
    function velocidadeBrilho(element, velocidade) {
        if (element) {
            // Remove classes de velocidade existentes
            element.classList.remove("lento", "rapido");
            
            if (velocidade === "lento") {
                element.classList.add("lento");
            } else if (velocidade === "rapido") {
                element.classList.add("rapido");
            }
        }
    }

    // Função específica para estrelas
    function ativarBrilhoEstrelas() {
        const estrelas = document.querySelectorAll('.estrelas, .stars, .rating, .feedback-display .stars-display');
        
        estrelas.forEach(estrela => {
            // Adiciona atributo data-brilho se não tiver
            if (!estrela.hasAttribute('data-brilho')) {
                estrela.setAttribute('data-brilho', '');
            }
            
            // Adiciona classe brilhante
            estrela.classList.add('brilhante');
            
            // Aplica brilho também aos ícones de estrela dentro do elemento
            const iconeEstrelas = estrela.querySelectorAll('i.fa-star, i.fas.fa-star, .star');
            iconeEstrelas.forEach(icone => {
                if (!icone.hasAttribute('data-brilho')) {
                    icone.setAttribute('data-brilho', 'suave');
                }
                icone.classList.add('brilhante');
            });
        });
    }

    // Função para ativar brilho quando estrelas são carregadas dinamicamente
    function observarNovasEstrelas() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Verifica se o novo nó tem estrelas
                            const estrelas = node.querySelectorAll('.estrelas, .stars, .rating, .feedback-display .stars-display');
                            estrelas.forEach(estrela => {
                                if (!estrela.hasAttribute('data-brilho')) {
                                    estrela.setAttribute('data-brilho', '');
                                    estrela.classList.add('brilhante');
                                }
                            });
                            
                            // Verifica se o próprio nó é uma estrela
                            if (node.classList && (
                                node.classList.contains('estrelas') || 
                                node.classList.contains('stars') || 
                                node.classList.contains('rating') ||
                                node.classList.contains('stars-display')
                            )) {
                                if (!node.hasAttribute('data-brilho')) {
                                    node.setAttribute('data-brilho', '');
                                    node.classList.add('brilhante');
                                }
                            }
                        }
                    });
                }
            });
        });

        // Observa mudanças no body
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Função para ajustar brilho baseado na avaliação
    function brilhoPorAvaliacao(elemento, estrelas) {
        if (!elemento) return;
        
        // Remove classes de intensidade existentes
        elemento.classList.remove('data-brilho');
        elemento.removeAttribute('data-brilho');
        
        if (estrelas >= 4.5) {
            elemento.setAttribute('data-brilho', 'intenso');
        } else if (estrelas >= 3.5) {
            elemento.setAttribute('data-brilho', '');
        } else if (estrelas >= 2.5) {
            elemento.setAttribute('data-brilho', 'suave');
        } else {
            // Estrelas muito baixas não brilham
            elemento.classList.remove('brilhante');
            return;
        }
        
        elemento.classList.add('brilhante');
    }

    // Inicialização automática
    setTimeout(() => {
        ativarBrilhoEstrelas();
        observarNovasEstrelas();
    }, 100);

    // Expõe as funções para uso global
    window.brilhoManager = {
        iniciarTodos: iniciarTodosBrilhos,
        pararTodos: pararTodosBrilhos,
        iniciar: iniciarBrilho,
        parar: pararBrilho,
        pausar: pausarBrilho,
        resumir: resumirBrilho,
        velocidade: velocidadeBrilho,
        ativarEstrelas: ativarBrilhoEstrelas,
        porAvaliacao: brilhoPorAvaliacao
    };

    // Log para debug
    console.log('🌟 Sistema de brilho inicializado:', brilhoElements.length, 'elementos encontrados');
});