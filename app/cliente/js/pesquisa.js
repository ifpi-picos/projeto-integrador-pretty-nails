function toggleFilters() {
    document.getElementById("filterPanel").classList.toggle("open");
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

const estadosCidades = {
    "AC": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasiléia", "Epitaciolândia", "Xapuri", "Senador Guiomard", "Plácido de Castro"],
    "AL": ["Maceió", "Arapiraca", "Palmeira dos Índios", "Rio Largo", "Penedo", "União dos Palmares", "Delmiro Gouveia", "Coruripe", "Campo Alegre", "São Miguel dos Campos"],
    "AP": ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Mazagão", "Porto Grande", "Pedra Branca do Amapari", "Tartarugalzinho", "Vitória do Jari", "Calçoene"],
    "AM": ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga", "Maués", "Humaitá", "Lábrea"],
    "BA": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Itabuna", "Lauro de Freitas", "Ilhéus", "Jequié", "Teixeira de Freitas"],
    "CE": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá"],
    "DF": ["Brasília"],
    "ES": ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares", "São Mateus", "Colatina", "Guarapari", "Aracruz", "Cachoeiro de Itapemirim"],
    "GO": ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás", "Trindade", "Formosa", "Novo Gama"],
    "MA": ["São Luís", "Imperatriz", "Timon", "Caxias", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Santa Inês"],
    "MG": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga"],
    "PA": ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal", "Parauapebas", "Abaetetuba", "Cametá", "Bragança", "Altamira"],
    "PI": ["Floriano", "Picos", "Terezina", "Parnaíba", "Piripiri", "Campo Maior", "Barras", "Altos", "Esperantina", "José de Freitas"],
    "PB": ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Guarabira", "Sapé", "Mamanguape"],
    "PR": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá"],
    "RJ": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "Campos dos Goytacazes", "São João de Meriti", "Petrópolis", "Volta Redonda"],
    "SP": ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "Osasco", "São José dos Campos", "Ribeirão Preto", "Sorocaba", "Mauá"],
    "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande"],
    "SC": ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó", "Itajaí", "Criciúma", "Jaraguá do Sul", "Lages", "Palhoça"],
    "PE": ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe", "Garanhuns", "Vitória de Santo Antão"],
    "RN": ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macau", "Ceará-Mirim", "Caicó", "Açu", "Currais Novos", "Santa Cruz"],
    "MS": ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Naviraí", "Nova Andradina", "Sidrolândia", "Maracaju", "Aquidauana"],
    "MT": ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Sorriso", "Lucas do Rio Verde", "Primavera do Leste", "Barra do Garças", "Alta Floresta"],
    "SE": ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "Estância", "Tobias Barreto", "Simão Dias", "Nossa Senhora da Glória", "Propriá", "Capela"],
    "TO": ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Colinas do Tocantins", "Guaraí", "Tocantinópolis", "Miracema do Tocantins", "Dianópolis"],
    "RO": ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura", "Jaru", "Guajará-Mirim", "Machadinho d'Oeste", "Ouro Preto do Oeste"],
    "RR": ["Boa Vista", "Rorainópolis", "Caracaraí", "Mucajaí", "Cantá", "Pacaraima", "Alto Alegre", "Bonfim", "Normandia", "São João da Baliza"]
};

function carregarEstados() {
    const estadoSelect = document.getElementById("estado");
    for (const estado in estadosCidades) {
        const option = document.createElement("option");
        option.value = estado;
        option.textContent = estado;
        estadoSelect.appendChild(option);
    }
}

function carregarCidades() {
    const estadoSelecionado = document.getElementById("estado").value;
    const cidadeSelect = document.getElementById("cidade");

    cidadeSelect.innerHTML = "<option value=''>Selecione</option>";

    if (estadoSelecionado && estadosCidades[estadoSelecionado]) {
        estadosCidades[estadoSelecionado].forEach(cidade => {
            const option = document.createElement("option");
            option.value = cidade;
            option.textContent = cidade;
            cidadeSelect.appendChild(option);
        });
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