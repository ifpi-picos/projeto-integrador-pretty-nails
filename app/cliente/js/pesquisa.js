function toggleFilters() {
    document.getElementById("filterPanel").classList.toggle("open");
}

function limparFiltros() {
    // Limpar campo de pesquisa
    document.getElementById("searchInput").value = "";
    
    // Resetar os selects de estado e cidade
    document.getElementById("estado").value = "";
    document.getElementById("cidade").innerHTML = '<option value="">Selecione</option>';
    document.getElementById("cidade").disabled = false;
    
    // Mostrar mensagem inicial e limpar resultados
    document.getElementById("initial-message").classList.remove("hidden");
    document.getElementById("perfil-container").innerHTML = "";
    
    // Fechar o painel de filtros (opcional)
    document.getElementById("filterPanel").classList.remove("open");
}

document.addEventListener("DOMContentLoaded", function () {
    carregarEstados();
    adicionarPerfis();

    document.querySelector(".apply-btn").addEventListener("click", function () {
        const estado = document.getElementById("estado").value;
        const cidade = document.getElementById("cidade").value;
        const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();

        if (searchTerm === "" && !estado && !cidade) {
            // Se todos os filtros estiverem vazios, mostra mensagem inicial
            document.getElementById("initial-message").classList.remove("hidden");
            document.getElementById("perfil-container").innerHTML = "";
        } else {
            // Caso contrário, aplica os filtros
            document.getElementById("initial-message").classList.add("hidden");
            adicionarPerfis(estado, cidade, searchTerm);
        }
    });

    document.getElementById("searchInput").addEventListener("input", function () {
        const searchTerm = this.value.trim().toLowerCase();
        const estado = document.getElementById("estado").value;
        const cidade = document.getElementById("cidade").value;

        if (searchTerm === "" && !estado && !cidade) {
            // Se campo de pesquisa vazio e sem outros filtros, mostra mensagem inicial
            document.getElementById("initial-message").classList.remove("hidden");
            document.getElementById("perfil-container").innerHTML = "";
        } else {
            // Caso contrário, aplica os filtros
            document.getElementById("initial-message").classList.add("hidden");
            adicionarPerfis(estado, cidade, searchTerm);
        }
    });
});

// API de Localização - IBGE para Estados e Cidades
async function carregarEstados() {
    try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const estados = await response.json();
        
        const estadoSelect = document.getElementById("estado");
        estadoSelect.innerHTML = '<option value="">Selecione</option>';
        
        estados.sort((a, b) => a.nome.localeCompare(b.nome)).forEach(estado => {
            const option = document.createElement("option");
            option.value = estado.sigla;
            option.textContent = estado.nome;
            estadoSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar estados:", error);
        alert("Não foi possível carregar os estados. Por favor, tente novamente mais tarde.");
    }
}

async function carregarCidades() {
    const estadoSelecionado = document.getElementById("estado").value;
    const cidadeSelect = document.getElementById("cidade");

    cidadeSelect.innerHTML = "<option value=''>Carregando cidades...</option>";
    cidadeSelect.disabled = true;

    if (!estadoSelecionado) {
        cidadeSelect.innerHTML = "<option value=''>Selecione</option>";
        cidadeSelect.disabled = false;
        return;
    }

    try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`);
        const cidades = await response.json();
        
        cidadeSelect.innerHTML = '<option value="">Selecione</option>';
        
        cidades.sort((a, b) => a.nome.localeCompare(b.nome)).forEach(cidade => {
            const option = document.createElement("option");
            option.value = cidade.nome;
            option.textContent = cidade.nome;
            cidadeSelect.appendChild(option);
        });
        
        cidadeSelect.disabled = false;
    } catch (error) {
        console.error("Erro ao carregar cidades:", error);
        cidadeSelect.innerHTML = '<option value="">Erro ao carregar cidades</option>';
        cidadeSelect.disabled = false;
    }
}

let manicuresCache = [];

async function adicionarPerfis(filtroEstado = "", filtroCidade = "", filtroNome = "") {
    const initialMessage = document.getElementById("initial-message");
    const container = document.getElementById("perfil-container");

    // Mostrar mensagem inicial apenas se não houver filtros
    if (!filtroEstado && !filtroCidade && !filtroNome) {
        initialMessage.classList.remove("hidden");
        container.innerHTML = "";
        return;
    } else {
        initialMessage.classList.add("hidden");
    }

    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Token de autenticação não encontrado.");
        }

        if (manicuresCache.length === 0) {
            const resposta = await fetch(`${API_BASE_URL}/auth/manicures`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!resposta.ok) {
                throw new Error("Erro ao buscar manicures.");
            }

            manicuresCache = await resposta.json();
        }

        container.innerHTML = "";

        const listaManicures = manicuresCache.manicures || [];

        const manicuresFiltradas = listaManicures.filter(manicure =>
            (filtroEstado === "" || manicure.estado === filtroEstado) &&
            (filtroCidade === "" || manicure.cidade === filtroCidade) &&
            (filtroNome === "" || (manicure.nome && manicure.nome.toLowerCase().startsWith(filtroNome.toLowerCase())))
        );

        if (manicuresFiltradas.length === 0) {
            let mensagem = "Nenhuma manicure encontrada.";
            if (filtroNome && filtroEstado && filtroCidade) {
                mensagem = `Nenhuma manicure encontrada com o nome "${filtroNome}" em ${filtroCidade} - ${filtroEstado}.`;
            } else if (filtroNome) {
                mensagem = `Nenhuma manicure encontrada com o nome "${filtroNome}".`;
            } else if (filtroEstado && filtroCidade) {
                mensagem = `Nenhuma manicure encontrada em ${filtroCidade} - ${filtroEstado}.`;
            } else if (filtroEstado) {
                mensagem = `Nenhuma manicure encontrada no estado ${filtroEstado}.`;
            }
            
            container.innerHTML = `<p class="no-results">${mensagem}</p>`;
            return;
        }

        manicuresFiltradas.forEach(manicure => {
            let nomeFormatado = manicure.nome;

            if (filtroNome) {
                const regex = new RegExp(`^(${filtroNome})`, "i");
                nomeFormatado = manicure.nome.replace(regex, `<span class="highlight" style="font-size: 1.06em;">$1</span>`);
            }

            const link = document.createElement("a");
            link.href = `perfil-manicure.html?id=${manicure.id}`;
            link.classList.add("perfil-link");
            link.innerHTML = `
                <div class="profile-card">
                    <img src="${manicure.foto || 'imagens/user.png'}" alt="${manicure.nome}">
                    <div class="profile-info">
                        <h3>${nomeFormatado}</h3>
                        <p>${manicure.cidade}, ${manicure.estado}</p>
                    </div>
                </div>
            `;
            container.appendChild(link);
        });

    } catch (error) {
        console.error("Erro ao carregar manicures:", error);
        container.innerHTML = "<p class='no-results'>Erro ao carregar perfis. Verifique sua conexão ou login.</p>";
        initialMessage.classList.add("hidden");
        
        // Mostrar erro com SweetAlert2
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message || 'Erro ao carregar perfis de manicures',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    }
}