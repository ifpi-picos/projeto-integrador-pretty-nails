document.addEventListener('DOMContentLoaded', async () => {
    // Elementos do DOM
    const foto = document.getElementById('foto');
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const endereco = document.getElementById('endereco');

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

    // Verificar autenticação
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

    if (!token || !userId) {
        window.location.href = 'login.html';
        return;
    }

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

        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao carregar dados do perfil',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        }
    }

    // Mostrar/ocultar modal
    function toggleModal(show) {
        if (show) {
            editModal.classList.add('active');
        } else {
            editModal.classList.remove('active');
        }
    }

    // Event listeners
    editProfileBtn.addEventListener('click', () => toggleModal(true));
    closeModalBtn.addEventListener('click', () => toggleModal(false));
    cancelEditBtn.addEventListener('click', () => toggleModal(false));

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
            let fotoUrl = editPhotoPreview.src;
            let fotoAntiga = foto.src.includes('imagens/user.png') ? null : foto.src;

            // Se for uma nova imagem (data URL)
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
            
            await Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Perfil atualizado com sucesso!',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });

            toggleModal(false);
            loadProfileData(); // Recarregar dados

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.message || 'Erro ao atualizar perfil',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        }
    });

    // Função para mostrar notificações
    function showNotification(message, type) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: type,
            title: message
        });
    }

    // Inicialização
    loadProfileData();
});