document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
        alert("ID da manicure não encontrado.");
        return;
    }

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        alert("ID da manicure inválido.");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "login.html";
        return;
    }

    try {
        const resposta = await fetch(`${API_BASE_URL}/auth/manicures/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) {
            if (resposta.status === 404) {
                throw new Error("Manicure não encontrada.");
            } else {
                throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
            }
        }

        const manicure = await resposta.json();
        preencherPerfil(manicure);

    } catch (erro) {
        console.error("Erro ao carregar dados da manicure:", erro);
        alert(erro.message || "Erro ao carregar o perfil. Tente novamente mais tarde.");
    }
});

function preencherPerfil(manicure) {
    // Informações básicas
    document.getElementById("profile-img").src = manicure.foto || "imagens/user.png";
    document.getElementById("profile-img").alt = manicure.nome || "Manicure";
    document.getElementById("nome").textContent = manicure.nome || "Nome não informado";
    document.getElementById("biografia").textContent = manicure.biografia || "Biografia não disponível.";
    document.getElementById("telefone").textContent = manicure.telefone || "Telefone não informado";
    document.getElementById("email").textContent = manicure.email || "E-mail não informado";

    // Endereço
    const endereco = `${manicure.rua || "Rua não informada"}, ${manicure.numero || ""} - ${manicure.cidade || ""}, ${manicure.estado || ""}`;
    document.getElementById("endereco").textContent = endereco;

    // Dias de trabalho
    if (manicure.dias_trabalho && Array.isArray(manicure.dias_trabalho) && manicure.dias_trabalho.length > 0) {
        const diasContainer = document.getElementById('dias-trabalho');
        const diasAbreviados = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

        // Limpa o container
        diasContainer.innerHTML = '';

        // Cria um item para cada dia da semana
        for (let i = 0; i < 7; i++) {
            const diaItem = document.createElement('div');
            diaItem.className = 'day-item';
            if (manicure.dias_trabalho && manicure.dias_trabalho.includes(i)) {
                diaItem.classList.add('active');
            }

            diaItem.innerHTML = `
            <div>${diasAbreviados[i]}</div>
        `;

            // Só adiciona evento de clique se o dia estiver disponível
            if (manicure.dias_trabalho && manicure.dias_trabalho.includes(i)) {
                diaItem.style.cursor = 'pointer';
                diaItem.addEventListener('click', function () {
                    // Remove seleção de outros dias
                    document.querySelectorAll('.day-item').forEach(d => d.classList.remove('selected'));
                    this.classList.add('selected');

                    // Calcula a data correspondente
                    const data = calcularDataParaDiaSemana(i);
                    document.getElementById('data-selecionada').textContent =
                        `Data selecionada: ${formatarData(data)}`;

                    // Armazena a data selecionada
                    sessionStorage.setItem('dataSelecionada', data.toISOString());
                });
            }

            diasContainer.appendChild(diaItem);
        }
    } else {
        document.getElementById('dias-trabalho').innerHTML =
            '<span class="day">Nenhum dia cadastrado</span>';
    }

    // Horários disponíveis
    if (manicure.horarios && Array.isArray(manicure.horarios) && manicure.horarios.length > 0) {
        const horariosContainer = document.getElementById('horarios');
        horariosContainer.innerHTML = manicure.horarios
            .map(horario => `
                <div class="horario-btn" data-value="${horario}">
                    ${horario}
                </div>
            `)
            .join('');

        // Adiciona eventos aos botões de horário
        document.querySelectorAll('.horario-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    } else {
        document.getElementById('horarios').innerHTML = '<span class="hour">Nenhum horário cadastrado</span>';
    }

    // Serviços oferecidos
    const servicosSelect = document.getElementById('servico');
    const servicosList = document.getElementById('servicos');

    // Limpa opções existentes
    servicosSelect.innerHTML = '<option value="">Selecione um serviço</option>';
    servicosList.innerHTML = '';

    if (manicure.servicos && Array.isArray(manicure.servicos) && manicure.servicos.length > 0) {
        manicure.servicos.forEach(servico => {
            // Converte o preço para número
            const preco = typeof servico.preco === 'string'
                ? parseFloat(servico.preco.replace(',', '.'))
                : servico.preco;

            // Formata o preço
            const precoFormatado = preco.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            // Adiciona ao select
            const option = document.createElement('option');
            option.value = servico.nome;
            option.textContent = `${servico.nome} (${precoFormatado})`;
            servicosSelect.appendChild(option);

            // Adiciona à lista
            const item = document.createElement('div');
            item.className = 'servico-item';
            item.innerHTML = `
                <span>${servico.nome}</span>
                <span class="price">${precoFormatado}</span>
            `;
            servicosList.appendChild(item);
        });
    } else {
        servicosList.innerHTML = '<span class="service">Nenhum serviço cadastrado</span>';
        document.getElementById('servico').innerHTML = `
        <option value="">Nenhum serviço disponível</option>
    `;
    }

    // Regras
    const regrasContainer = document.getElementById('regras');
    if (manicure.regras && Array.isArray(manicure.regras) && manicure.regras.length > 0) {
        // Junta todas as regras com quebras de linha
        const textoRegras = manicure.regras
            .map(regra => `✓ ${regra}`)
            .join('\n');

        // Cria um elemento de parágrafo para as regras
        regrasContainer.innerHTML = `
            <div class="regras-texto">
                ${textoRegras.replace(/\n/g, '<br>')}
            </div>
        `;
    } else {
        regrasContainer.innerHTML = '<div class="regras-texto">Nenhuma regra específica</div>';
    }
}

// Função para calcular a data para um dia da semana (0=Domingo, 1=Segunda, etc.)
function calcularDataParaDiaSemana(diaIndex) {
    const hoje = new Date();
    const diaAtual = hoje.getDay(); // 0-6 (Domingo-Sábado)
    const diferencaDias = (diaIndex - diaAtual + 7) % 7;

    // Se for o mesmo dia, avança 1 semana
    const diasParaAdicionar = diferencaDias === 0 ? 7 : diferencaDias;

    const data = new Date(hoje);
    data.setDate(hoje.getDate() + diasParaAdicionar);
    return data;
}

// Função para formatar a data (ex: "Quinta-feira, 15/02/2024")
function formatarData(data) {
    const opcoes = {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    return data.toLocaleDateString('pt-BR', opcoes);
}

// No seu formulário de agendamento, modifique o submit para pegar a data selecionada
document.getElementById('agendamento-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const dataSelecionada = sessionStorage.getItem('dataSelecionada');
    if (!dataSelecionada) {
        alert('Por favor, selecione um dia');
        return;
    }

    const data = new Date(dataSelecionada);
    const horarioSelecionado = document.querySelector('.horario-btn.selected')?.dataset.value;

    if (!horarioSelecionado) {
        alert('Por favor, selecione um horário');
        return;
    }

    // Combine data e horário
    const [hora, minuto] = horarioSelecionado.split(':');
    data.setHours(parseInt(hora), parseInt(minuto || 0), 0, 0);

    // Agora você pode enviar 'data' para o servidor
    console.log('Data e horário selecionados:', data);
});