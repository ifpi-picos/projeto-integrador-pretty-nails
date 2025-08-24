document.addEventListener('DOMContentLoaded', async () => {
    // Elementos do DOM
    const foto = document.getElementById('foto');
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const endereco = document.getElementById('endereco');
    const workDaysContainer = document.getElementById('workDays');
    const workHoursContainer = document.getElementById('workHours');
    const servicesList = document.getElementById('servicesList');

    // Elementos do modal
    const editModal = document.getElementById('editModal');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const editPhotoPreview = document.getElementById('editPhotoPreview');
    const editPhoto = document.getElementById('editPhoto');
    const editName = document.getElementById('editName');
    const editPhone = document.getElementById('editPhone');
    const editCity = document.getElementById('editCity');
    const editState = document.getElementById('editState');
    const addTimeBtn = document.getElementById('addTimeBtn');
    const addServBtn = document.getElementById('addServBtn');
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    const servSlotsContainer = document.getElementById('servSlotsContainer');
    const workDaysCheckbox = document.getElementById('workDaysCheckbox');

    // Elementos do modal de compartilhamento
    const shareModal = document.getElementById('shareModal');
    const shareProfileBtn = document.getElementById('shareProfileBtn');
    const closeShareModalBtn = document.getElementById('closeShareModalBtn');
    const closeShareBtn = document.getElementById('closeShareBtn');
    const sharePhoto = document.getElementById('sharePhoto');
    const shareName = document.getElementById('shareName');
    const shareLink = document.getElementById('shareLink');
    const copyLinkBtn = document.getElementById('copyLinkBtn');

    // Verificar autenticação
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

    if (!token || !userId) {
        window.location.href = 'login.html';
        return;
    }

    // Gerar link de compartilhamento
    function generateShareLink() {
        // Em produção, isso viria da API ou seria um link fixo com o ID do usuário
        const baseUrl = window.location.origin;
        return `${baseUrl}/perfil-publico.html?id=${userId}`;
    }

    // Função para adicionar novo time-slot
    function addTimeSlot(horario = '00:00') {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.innerHTML = `
            <input type="time" class="timeFrom" value="${horario}">
            <button type="button" class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        `;

        const addBtn = timeSlotsContainer.querySelector('.add-time-btn');
        if (addBtn) {
            timeSlotsContainer.insertBefore(timeSlot, addBtn);
        } else {
            timeSlotsContainer.appendChild(timeSlot);
        }

        const removeBtn = timeSlot.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            timeSlotsContainer.removeChild(timeSlot);
        });
    }

    // Função para adicionar novo serv-slot
    function addServSlot(nome = '', preco = '') {
        const servSlot = document.createElement('div');
        servSlot.className = 'serv-slot';
        servSlot.innerHTML = `
            <input type="text" class="servico" placeholder="Serviço" value="${nome}">
            <span>-</span>
            <input type="number" class="preco" placeholder="R$" value="${preco}">
            <button type="button" class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        `;

        const addBtn = servSlotsContainer.querySelector('.add-serv-btn');
        if (addBtn) {
            servSlotsContainer.insertBefore(servSlot, addBtn);
        } else {
            servSlotsContainer.appendChild(servSlot);
        }

        const removeBtn = servSlot.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            servSlotsContainer.removeChild(servSlot);
        });
    }

    // Event listeners para botões de adicionar
    addTimeBtn.addEventListener('click', () => addTimeSlot());
    addServBtn.addEventListener('click', () => addServSlot());

    // Carregar dados do perfil
    async function loadProfileData() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/usuario/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Erro ao carregar perfil');

            const data = await response.json();

            // Preencher dados na tela (com tratamento correto da foto)
            foto.src = data.foto ? `${data.foto}?${Date.now()}` : 'imagens/user.png';
            nome.textContent = data.nome || 'Nome não informado';
            email.innerHTML = `<i class="fas fa-envelope"></i> ${data.email || 'Email não informado'}`;
            telefone.innerHTML = `<i class="fas fa-phone"></i> ${data.telefone || 'Telefone não informado'}`;
            endereco.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.cidade || 'Cidade não informada'}, ${data.estado || 'Estado não informado'}`;

            // Preencher dados do modal (com tratamento correto da foto)
            editPhotoPreview.src = data.foto ? `${data.foto}?${Date.now()}` : 'imagens/user.png';
            editName.value = data.nome || '';
            editPhone.value = data.telefone || '';
            editCity.value = data.cidade || '';
            editState.value = data.estado || '';

            // Dias de trabalho - mostrar todos os dias com os selecionados destacados
            const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
            const diasTrabalho = data.dias_trabalho || [];
            
            const diasHTML = diasSemana.map((dia, index) => {
                const isSelected = diasTrabalho.includes(index);
                const cssClass = isSelected ? 'day active' : 'day inactive';
                return `<span class="${cssClass}">${dia}</span>`;
            }).join('');
            
            workDaysContainer.innerHTML = diasHTML;

            // Marcar checkboxes
            document.querySelectorAll('input[name="workDay"]').forEach(checkbox => {
                checkbox.checked = diasTrabalho.includes(parseInt(checkbox.value));
            });

            // Horários
            timeSlotsContainer.innerHTML = '';
            if (data.horarios && data.horarios.length > 0) {
                workHoursContainer.innerHTML = data.horarios
                    .map(h => `<span class="hour">${h}</span>`)
                    .join('');

                data.horarios.forEach(horario => {
                    addTimeSlot(horario);
                });
            } else {
                workHoursContainer.innerHTML = '<span class="hour">Nenhum horário cadastrado</span>';
            }

            // Adicionar botão de adicionar horário
            const timeAddBtn = document.createElement('button');
            timeAddBtn.type = 'button';
            timeAddBtn.className = 'add-time-btn';
            timeAddBtn.id = 'addTimeBtn';
            timeAddBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar horário';
            timeAddBtn.addEventListener('click', () => addTimeSlot());
            timeSlotsContainer.appendChild(timeAddBtn);

            // Serviços
            servSlotsContainer.innerHTML = '';
            if (data.servicos && data.servicos.length > 0) {
                servicesList.innerHTML = data.servicos
                    .map(s => `<span class="service">${s.nome ? s.nome : s}${s.preco ? ` (R$${s.preco})` : ''}</span>`)
                    .join('');

                data.servicos.forEach(servico => {
                    addServSlot(servico.nome || servico, servico.preco);
                });
            } else {
                servicesList.innerHTML = '<span class="service">Nenhum serviço cadastrado</span>';
            }

            // Adicionar botão de adicionar serviço
            const servAddBtn = document.createElement('button');
            servAddBtn.type = 'button';
            servAddBtn.className = 'add-serv-btn';
            servAddBtn.id = 'addServBtn';
            servAddBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar serviço';
            servAddBtn.addEventListener('click', () => addServSlot());
            servSlotsContainer.appendChild(servAddBtn);

        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            showNotification('Erro ao carregar dados do perfil', 'error');
        }
    }

    // Mostrar/ocultar modal
    function toggleModal(modal, show) {
        if (show) {
            modal.classList.add('active');
        } else {
            modal.classList.remove('active');
        }
    }

    // Event listeners
    editProfileBtn.addEventListener('click', () => toggleModal(editModal, true));
    closeModalBtn.addEventListener('click', () => toggleModal(editModal, false));
    cancelEditBtn.addEventListener('click', () => toggleModal(editModal, false));

    // Event listeners para o modal de compartilhamento
    shareProfileBtn.addEventListener('click', () => {
        // Preencher dados no modal de compartilhamento
        sharePhoto.src = foto.src;
        shareName.textContent = nome.textContent;
        shareLink.value = generateShareLink();
        
        toggleModal(shareModal, true);
    });
    
    closeShareModalBtn.addEventListener('click', () => toggleModal(shareModal, false));
    closeShareBtn.addEventListener('click', () => toggleModal(shareModal, false));
    
    // Copiar link para a área de transferência
    copyLinkBtn.addEventListener('click', () => {
        shareLink.select();
        document.execCommand('copy');
        showNotification('Link copiado para a área de transferência!', 'success');
    });

    // Preview da foto ao selecionar
    editPhoto.addEventListener('change', function (e) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                editPhotoPreview.src = e.target.result;
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Salvar alterações
    saveProfileBtn.addEventListener('click', async () => {
        try {
            // Coletar dados do formulário
            const diasTrabalho = [];
            document.querySelectorAll('input[name="workDay"]:checked').forEach(checkbox => {
                diasTrabalho.push(parseInt(checkbox.value));
            });

            // Horários
            const horarios = [];
            document.querySelectorAll('.time-slot').forEach(slot => {
                const horario = slot.querySelector('.timeFrom')?.value;
                if (horario) horarios.push(horario);
            });

            // Serviços
            const servicos = [];
            document.querySelectorAll('.serv-slot').forEach(slot => {
                const nome = slot.querySelector('.servico')?.value;
                const preco = slot.querySelector('.preco')?.value;
                if (nome) servicos.push({ nome, preco: preco || null });
            });

            // Foto (se mudou)
            let fotoUrl = editPhotoPreview.src;
            let fotoAntiga = foto.src.includes('imagens/user.png') ? null : foto.src;

            if (fotoUrl.startsWith('data:')) {
                const response = await fetch(`${API_BASE_URL}/auth/upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        image: fotoUrl,
                        fotoAntiga: fotoAntiga
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Erro ao enviar imagem');
                }

                const result = await response.json();
                fotoUrl = result.url;
            }

            // Montar objeto com dados atualizados
            const profileData = {
                nome: editName.value,
                telefone: editPhone.value,
                cidade: editCity.value,
                estado: editState.value,
                dias_trabalho: diasTrabalho,
                horarios: horarios,
                servicos: servicos
            };

            // Só envia a foto se não for a imagem padrão
            if (fotoUrl && !fotoUrl.includes('imagens/user.png')) {
                profileData.foto = fotoUrl.split('?')[0]; // Remove o timestamp
            } else {
                profileData.foto = null;
            }

            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao atualizar perfil');
            }

            const updatedData = await response.json();
            showNotification('Perfil atualizado com sucesso!', 'success');

            // Atualizar localStorage se necessário
            if (updatedData.nome) localStorage.setItem('userName', updatedData.nome);
            if (updatedData.foto) localStorage.setItem('userFoto', updatedData.foto);

            toggleModal(editModal, false);
            loadProfileData(); // Recarregar dados

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            showNotification(error.message || 'Erro ao atualizar perfil', 'error');
        }
    });

    // Função para mostrar notificações
    function showNotification(message, type) {
        Swal.fire({
            title: type === 'success' ? 'Sucesso!' : 'Erro!',
            text: message,
            icon: type,
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
        });
    }

    // Inicialização
    loadProfileData();
});