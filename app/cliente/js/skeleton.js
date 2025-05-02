// skeleton.js
document.addEventListener("DOMContentLoaded", function () {
    const skeletonDivs = document.querySelectorAll("[data-skeleton]");
    
    skeletonDivs.forEach(div => {
        div.classList.add("skeleton");
    });

    // Função para remover o skeleton de todos os elementos
    function removeAllSkeletons() {
        skeletonDivs.forEach(div => {
            div.classList.remove("skeleton");
        });
    }

    // Função para remover o skeleton de um elemento específico
    function removeSkeleton(element) {
        if (element) {
            element.classList.remove("skeleton");
        }
    }

    // Expõe as funções para uso global
    window.skeletonLoader = {
        removeAll: removeAllSkeletons,
        remove: removeSkeleton
    };
});