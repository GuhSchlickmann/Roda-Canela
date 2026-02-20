// ============================================
// PHOTO UPLOAD FUNCTIONALITY
// ============================================

let uploadedPhotos = []; // Array para armazenar URLs das fotos enviadas

function initPhotoUpload() {
    const photoInput = document.getElementById('photoInput');
    const photoUploadBtn = document.getElementById('photoUploadBtn');
    const photoPreview = document.getElementById('photoPreview');

    if (!photoInput || !photoUploadBtn) return;

    // Clicar no botão abre o seletor de arquivos
    photoUploadBtn.addEventListener('click', () => {
        photoInput.click();
    });

    // Quando arquivos são selecionados
    photoInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        console.log(`📸 ${files.length} arquivo(s) selecionado(s)`);

        for (const file of files) {
            await uploadPhoto(file);
        }

        // Limpar input para permitir selecionar os mesmos arquivos novamente
        photoInput.value = '';
    });
}

async function uploadPhoto(file) {
    const photoPreview = document.getElementById('photoPreview');
    if (!photoPreview) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('Por favor, selecione apenas imagens ou vídeos.');
        return;
    }

    // Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert('Arquivo muito grande! Tamanho máximo: 10MB');
        return;
    }

    // Criar preview temporário
    const previewId = 'preview-' + Date.now();
    const previewItem = document.createElement('div');
    previewItem.className = 'photo-preview-item';
    previewItem.id = previewId;

    // Criar elemento de preview (img ou video)
    const isVideo = file.type.startsWith('video/');
    const mediaElement = document.createElement(isVideo ? 'video' : 'img');
    mediaElement.src = URL.createObjectURL(file);
    if (isVideo) mediaElement.muted = true;

    // Loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'photo-preview-loading';
    loadingOverlay.textContent = 'Enviando...';

    previewItem.appendChild(mediaElement);
    previewItem.appendChild(loadingOverlay);
    photoPreview.appendChild(previewItem);

    try {
        // Upload para Firebase Storage
        const timestamp = Date.now();
        const fileName = `feedbacks/${timestamp}_${file.name}`;
        const storageRef = storage.ref(fileName);

        console.log(`⬆️ Fazendo upload de: ${file.name}`);

        const uploadTask = storageRef.put(file);

        // Monitorar progresso
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                loadingOverlay.textContent = Math.round(progress) + '%';
            },
            (error) => {
                console.error('❌ Erro no upload:', error);
                alert('Erro ao enviar arquivo. Tente novamente.');
                previewItem.remove();
            },
            async () => {
                // Upload completo - obter URL
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                console.log('✅ Upload completo:', downloadURL);

                // Remover loading
                loadingOverlay.remove();

                // Adicionar botão de remover
                const removeBtn = document.createElement('button');
                removeBtn.className = 'photo-preview-remove';
                removeBtn.innerHTML = '×';
                removeBtn.onclick = () => removePhoto(previewId, downloadURL);
                previewItem.appendChild(removeBtn);

                // Salvar URL
                uploadedPhotos.push(downloadURL);
            }
        );

    } catch (error) {
        console.error('❌ Erro ao fazer upload:', error);
        alert('Erro ao enviar arquivo. Verifique sua conexão.');
        previewItem.remove();
    }
}

function removePhoto(previewId, photoURL) {
    // Remover da UI
    const previewItem = document.getElementById(previewId);
    if (previewItem) {
        previewItem.remove();
    }

    // Remover do array
    uploadedPhotos = uploadedPhotos.filter(url => url !== photoURL);

    console.log('🗑️ Foto removida');
}
