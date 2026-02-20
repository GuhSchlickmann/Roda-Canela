// ============================================
// GOOGLE ANALYTICS TRACKING
// ============================================

/**
 * Envia eventos para o Google Analytics 4
 * @param {string} eventName - Nome do evento (ex: select_content, form_submit)
 * @param {object} eventParams - Parâmetros do evento
 */
function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag !== 'function') {
        console.warn('Google Analytics não inicializado');
        return;
    }

    gtag('event', eventName, eventParams);
    console.log(`📊 Evento GA4 enviado: ${eventName}`, eventParams);
}

// Exemplos de eventos que serão rastreados:
// trackEvent('select_rating', { rating: 5, type: 'positive' });
// trackEvent('view_form', { type: 'negative' });
// trackEvent('submit_feedback', { rating: 2, length: 45 });
// trackEvent('redirect_google', { rating: 5 });
// trackEvent('login_google', { method: 'popup' });
