// ============================================
// CONFIGURAÇÕES - EDITE AQUI
// ============================================

const CONFIG = {
    // Nome da sua empresa (Título da página)
    businessName: 'Roda Canela',
    // URL do seu Google Apps Script (Novo Backend Gratuito)
    backendUrl: 'https://script.google.com/macros/s/AKfycbxLvpHpyikDhDnuOe6Lbb77Ci1E43zKkaINEPPLArJYH_1qxfd7XYhtlGe0wKpinVU1EA/exec',

    // URL da sua página de avaliação do Google (Exata fornecida pelo usuário)
    googleReviewURL: 'https://www.google.com/search?sca_esv=31e89fb06c6c6e55&hl=pt-BR&sxsrf=ANbL-n41wnZ8F0eXbv7TEXG-1LNoukpFZg:1771593417621&si=AL3DRZHrmvnFAVQPOO2Bzhf8AX9KZZ6raUI_dT7DG_z0kV2_x-crY-QAYBC789cwbq-5JimcWlmPZH3s07h1Lb-ez7lii76NPz-9-tw9WWcED7PozfFK5Jwg4FaiQrQOUccod_wxZmsEImTEp7BJwUHbEEizzBWc6Q%3D%3D&q=Parque+Mundo+a+Vapor+Coment%C3%A1rios&sa=X&ved=2ahUKEwiAzt_ik-iSAxW_s5UCHa9kOfYQ0bkNegQIKhAH&biw=1920&bih=945&dpr=1#',

    // Textos personalizados para cada avaliação
    ratingTexts: {
        1: 'Muito insatisfeito 😞',
        2: 'Insatisfeito 😕',
        3: 'Neutro 😐',
        4: 'Satisfeito 😊',
        5: 'Muito satisfeito! 🤩'
    }
};

// Firebase removido para usar Google Apps Script (Plano 100% Gratuito)
let currentUser = null;

function initBackend() {
    console.log('✅ Backend (Google Sheets) pronto para receber dados!');
}

// ============================================
// LÓGICA DA APLICAÇÃO
// ============================================

let selectedRating = 0;

// Elementos (serão inicializados após DOM carregar)
let stars;
let step1;
let step2Negative;
let step3Positive;
let step4Thanks;
let negativeForm;
let googleReviewLink;

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar Backend
    initBackend();

    // Inicializar elementos
    stars = document.querySelectorAll('.star');
    step1 = document.getElementById('step1');
    step2Negative = document.getElementById('step2Negative');
    step3Positive = document.getElementById('step3Positive');
    step4Thanks = document.getElementById('step4Thanks');
    negativeForm = document.getElementById('negativeForm');
    googleReviewLink = document.getElementById('googleReviewLink');

    // Configurar link do Google Review
    if (googleReviewLink) {
        googleReviewLink.addEventListener('click', (e) => {
            e.preventDefault();

            console.log('🔗 Clique no link do Google Review');
            trackEvent('click_google_review', { rating: selectedRating });

            // Abrimos o link direto configurado
            const finalURL = CONFIG.googleReviewURL;

            console.log('🚀 Redirecionando para:', finalURL);
            window.open(finalURL, '_blank');
        });
    }

    // Configurar nome da empresa
    const businessNameElements = document.querySelectorAll('.business-name');
    businessNameElements.forEach(el => {
        el.textContent = CONFIG.businessName;
    });

    // Inicializar event listeners
    initSplitListeners(); // Changed from initStarListeners
    initFormListeners();
    initPillButtons();
    initPhotoUpload();
});

// ============================================
// STEP 1: Seleção de Estrelas
// ============================================

// ============================================
// STEP 1: Seleção de Experiência (Split)
// ============================================

function initSplitListeners() {
    const btnNegative = document.getElementById('btnNegative');
    const btnPositive = document.getElementById('btnPositive');
    const header = document.querySelector('.review-header');
    const bizNameText = document.getElementById('businessName');

    const defaultBizText = CONFIG.businessName;

    if (btnNegative && header && bizNameText) {
        btnNegative.addEventListener('mouseenter', () => {
            header.classList.add('header-left');
            bizNameText.style.opacity = '0';
            setTimeout(() => {
                bizNameText.textContent = "Clique sobre o ícone, e nos informe o que podemos melhorar!";
                bizNameText.style.opacity = '1';
            }, 300);
        });

        btnNegative.addEventListener('mouseleave', () => {
            header.classList.remove('header-left');
            bizNameText.style.opacity = '0';
            setTimeout(() => {
                bizNameText.textContent = defaultBizText;
                bizNameText.style.opacity = '1';
            }, 300);
        });

        btnNegative.addEventListener('click', async () => {
            if (btnNegative.classList.contains('is-selecting')) return;

            selectedRating = 1; // Representa insatisfação
            console.log('🙁 Cliente clicou em Não Gostei');

            // Iniciar animação de escolha
            btnNegative.classList.add('is-selecting');
            btnPositive.classList.add('not-selected');

            trackEvent('select_experience_start', { type: 'negative' });

            // Aguardar 1 segundo para a animação de escolha
            await new Promise(resolve => setTimeout(resolve, 1000));

            trackEvent('select_experience_confirm', { type: 'negative' });
            showStep(step2Negative);

            // Resetar classes para caso o usuário volte
            btnNegative.classList.remove('is-selecting');
            btnPositive.classList.remove('not-selected');
        });
    }

    if (btnPositive && header && bizNameText) {
        btnPositive.addEventListener('mouseenter', () => {
            header.classList.add('header-right');
            bizNameText.style.opacity = '0';
            setTimeout(() => {
                bizNameText.textContent = "Clique sobre o ícone, e nos conte como está sendo sua experiência na Roda Canela!";
                bizNameText.style.opacity = '1';
            }, 300);
        });

        btnPositive.addEventListener('mouseleave', () => {
            header.classList.remove('header-right');
            bizNameText.style.opacity = '0';
            setTimeout(() => {
                bizNameText.textContent = defaultBizText;
                bizNameText.style.opacity = '1';
            }, 300);
        });

        btnPositive.addEventListener('click', async () => {
            if (btnPositive.classList.contains('is-selecting')) return;

            selectedRating = 5; // Representa satisfação total
            console.log('😊 Cliente clicou em Gostei');

            // Iniciar animação de escolha
            btnPositive.classList.add('is-selecting');
            btnNegative.classList.add('not-selected');

            trackEvent('select_experience_start', { type: 'positive' });

            const redirectToGoogle = () => {
                const finalURL = CONFIG.googleReviewURL;

                console.log('🚀 Redirecionando DIRETAMENTE para:', finalURL);
                trackEvent('redirect_google_direct', { rating: selectedRating });

                window.location.href = finalURL;
            };

            // Redirecionamento quase imediato para evitar bloqueios de navegadores mobile
            // O delay de 1s foi removido para garantir que o redirecionamento ocorra como resposta direta ao toque
            setTimeout(() => {
                trackEvent('select_experience_confirm', { type: 'positive' });
                console.log('✅ Redirecionando para avaliação positiva...');
                redirectToGoogle();
            }, 300);

            // Resetar classes (caso o redirecionamento demore ou falhe)
            setTimeout(() => {
                btnPositive.classList.remove('is-selecting');
                btnNegative.classList.remove('not-selected');
            }, 1000);
        });
    }
}

// ============================================
// STEP 2: Formulário de Feedback Negativo
// ============================================

function initFormListeners() {
    if (!negativeForm) return;

    negativeForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            rating: selectedRating,
            feedback: document.getElementById('negativeFeedback').value,
            visitTime: selectedVisitTime,
            waitTime: selectedWaitTime,
            recommendAdvance: selectedRecommend,
            photos: uploadedPhotos, // URLs das fotos enviadas
            userName: 'Anônimo',
            userEmail: '',
            userId: null,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        console.log('📝 Feedback negativo recebido:', formData);

        trackEvent('submit_feedback', {
            rating: selectedRating,
            has_photos: uploadedPhotos.length > 0,
            visit_time: selectedVisitTime,
            wait_time: selectedWaitTime
        });

        // Salvar no Google Sheets
        saveToGoogle(formData);
    });

    // Textarea validation
    const feedbackTextarea = document.getElementById('negativeFeedback');
    if (feedbackTextarea) {
        feedbackTextarea.addEventListener('input', checkFormValidity);
    }
}

function saveToGoogle(data) {
    // Mostrar loading no botão
    const submitBtn = negativeForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Enviando...</span>';

    console.log('🚀 Enviando dados para o Google Apps Script:', CONFIG.backendUrl);

    // Enviar para o Google Apps Script
    // Nota: 'no-cors' não permite headers customizados como 'Content-Type: application/json'
    // Mas o Apps Script aceita o corpo do POST mesmo assim.
    // URLSearchParams é o método mais estável para enviar dados via 'no-cors' para o Google Apps Script
    // Isso garante que o Apps Script receba os dados no campo e.parameter.payload
    const params = new URLSearchParams();
    params.append('payload', JSON.stringify(data));

    fetch(CONFIG.backendUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
        .then(() => {
            console.log('✅ Requisição enviada com sucesso!');
            showStep(step4Thanks);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        })
        .catch((error) => {
            console.error('❌ Erro na requisição:', error);
            alert('Não foi possível conectar ao servidor. Verifique sua internet.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
}

// ============================================
// STEP 3: Redirecionamento Google Review
// ============================================

function skipReview() {
    showStep(step4Thanks);
}

// ============================================
// NAVEGAÇÃO ENTRE STEPS
// ============================================

function showStep(stepElement) {
    // Remover classe active de todos os steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    // Adicionar classe active ao step desejado
    stepElement.classList.add('active');
}

function goBack() {
    showStep(step1);
    selectedRating = 0;
    updateStars(0);
    ratingText.textContent = 'Selecione uma avaliação';
}

function resetForm() {
    // Limpar formulário
    negativeForm.reset();

    // Voltar ao início
    goBack();
}

// ============================================
// ANALYTICS (OPCIONAL)
// ============================================

function trackEvent(eventName, eventData) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }

    console.log('📊 Event tracked:', eventName, eventData);
}

// ============================================
// PILL BUTTONS INTERACTIVITY
// ============================================

let selectedVisitTime = null;
let selectedWaitTime = null;
let selectedRecommend = null;

function initPillButtons() {
    // Visit time buttons
    document.querySelectorAll('[data-visit]').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('[data-visit]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedVisitTime = this.dataset.visit;
            checkFormValidity();
        });
    });

    // Wait time buttons
    document.querySelectorAll('[data-wait]').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('[data-wait]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedWaitTime = this.dataset.wait;
            checkFormValidity();
        });
    });

    // Recommend buttons
    document.querySelectorAll('[data-recommend]').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('[data-recommend]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedRecommend = this.dataset.recommend;
            checkFormValidity();
        });
    });
}

function checkFormValidity() {
    const feedback = document.getElementById('negativeFeedback')?.value.trim() || '';
    const submitBtn = document.getElementById('submitBtn');

    if (submitBtn) {
        // Validar se todas as condições foram atendidas:
        // 1. Feedback com pelo menos 10 caracteres
        // 2. Quando visitou (selectedVisitTime)
        // 3. Tempo de espera (selectedWaitTime)
        // 4. Recomenda antecedência (selectedRecommend)

        const hasValidFeedback = feedback.length >= 10;
        const hasVisitTime = selectedVisitTime !== null;
        const hasWaitTime = selectedWaitTime !== null;
        const hasRecommend = selectedRecommend !== null;

        const allValid = hasValidFeedback && hasVisitTime && hasWaitTime && hasRecommend;

        submitBtn.disabled = !allValid;

        console.log(`✅ Validação:
  📝 Feedback: ${hasValidFeedback ? '✓' : '✗'} (${feedback.length} chars)
  📅 Quando visitou: ${hasVisitTime ? '✓' : '✗'}
  ⏱️ Tempo espera: ${hasWaitTime ? '✓' : '✗'}
  🎫 Recomenda: ${hasRecommend ? '✓' : '✗'}
  → Botão: ${allValid ? 'HABILITADO ✓' : 'DESABILITADO ✗'}`);
    }
}

// Update business name
document.addEventListener('DOMContentLoaded', () => {
    const businessNameElements = document.querySelectorAll('.business-name');
    businessNameElements.forEach(el => {
        el.textContent = CONFIG.businessName;
    });
});

// Exemplo de uso:
// trackEvent('rating_selected', { rating: selectedRating });
// trackEvent('feedback_submitted', { rating: selectedRating, type: 'negative' });
// trackEvent('google_review_clicked', { rating: selectedRating });

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
        console.log(`🚀 Preparando arquivo para upload via Google backend...`);

        // Converter arquivo para base64 para enviar via Apps Script
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function () {
            const base64Data = reader.result.split(',')[1];

            // Adicionar ao array de fotos (será enviado no submit final do formulário)
            uploadedPhotos.push({
                name: file.name,
                type: file.type,
                base64: base64Data
            });

            console.log('✅ Arquivo processado e pronto para envio final.');

            // Simular progresso rápido já que é tudo local até o submit
            let prog = 0;
            const interval = setInterval(() => {
                prog += 25;
                loadingOverlay.textContent = prog + '%';
                if (prog >= 100) {
                    clearInterval(interval);
                    loadingOverlay.remove();

                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'photo-preview-remove';
                    removeBtn.innerHTML = '×';
                    removeBtn.onclick = () => removePhoto(previewId, null); // Simplificado
                    previewItem.appendChild(removeBtn);
                }
            }, 100);
        };

        reader.onerror = function () {
            console.error('❌ Erro ao ler arquivo');
            alert('Erro ao processar imagem.');
            previewItem.remove();
        };

    } catch (error) {
        console.error('❌ Erro CRÍTICO no processamento:', error);
        alert('Erro ao preparar o envio.');
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

// Funções de Auth removidas para evitar dependência do Firebase Auth

