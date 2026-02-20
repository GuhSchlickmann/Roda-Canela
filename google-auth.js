// ============================================
// GOOGLE AUTHENTICATION
// ============================================

function initGoogleLogin() {
    const personalizeLink = document.getElementById('personalizeLink');
    const profileSection = document.getElementById('profileSection');

    if (personalizeLink) {
        personalizeLink.addEventListener('click', (e) => {
            e.preventDefault();
            signInWithGoogle();
        });
    }

    if (profileSection) {
        profileSection.addEventListener('click', () => {
            if (!currentUser) {
                signInWithGoogle();
            }
        });
    }
}

async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        console.log('🔐 Iniciando login com Google...');

        // Login com popup
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        console.log('✅ Login realizado com sucesso!', user.displayName);

    } catch (error) {
        console.error('❌ Erro no login:', error);

        if (error.code === 'auth/popup-closed-by-user') {
            console.log('ℹ️ Popup fechado pelo usuário');
        } else if (error.code === 'auth/cancelled-popup-request') {
            console.log('ℹ️ Login cancelado');
        } else {
            alert('Erro ao fazer login. Tente novamente.');
        }
    }
}

function updateProfileUI(user) {
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const personalizeLink = document.getElementById('personalizeLink');

    if (user) {
        // Usuário logado - atualizar UI
        if (profileAvatar) {
            if (user.photo) {
                profileAvatar.innerHTML = `<img src="${user.photo}" alt="${user.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            } else {
                profileAvatar.textContent = user.name.charAt(0).toUpperCase();
            }
        }

        if (profileName) {
            profileName.textContent = user.name;
        }

        if (personalizeLink) {
            personalizeLink.textContent = 'Sair da conta';
            personalizeLink.onclick = (e) => {
                e.preventDefault();
                signOut();
            };
        }
    } else {
        // Usuário anônimo - resetar UI
        if (profileAvatar) {
            profileAvatar.textContent = 'U';
            profileAvatar.innerHTML = 'U';
        }

        if (profileName) {
            profileName.textContent = 'Usuário Anônimo';
        }

        if (personalizeLink) {
            personalizeLink.textContent = 'Fazer login com Google';
            personalizeLink.onclick = (e) => {
                e.preventDefault();
                signInWithGoogle();
            };
        }
    }
}

async function signOut() {
    try {
        await auth.signOut();
        console.log('👋 Logout realizado');
    } catch (error) {
        console.error('❌ Erro ao fazer logout:', error);
    }
}
