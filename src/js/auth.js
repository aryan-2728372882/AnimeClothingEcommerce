document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const logoutBtn = document.getElementById('logout-btn');
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');

    // Show login modal
    function showLoginModal() {
        if (loginModal) loginModal.classList.remove('hidden');
    }

    // Hide login modal
    function hideLoginModal() {
        if (loginModal) loginModal.classList.add('hidden');
    }

    // Update UI for logged-in user
    function updateUserUI(user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userProfile) userProfile.classList.remove('hidden');
        
        if (userAvatar) userAvatar.src = user.photoURL || 'default-avatar.png';
        if (userName) userName.textContent = user.displayName || user.email;
    }

    // Reset UI for logged-out state
    function resetUserUI() {
        if (loginBtn) loginBtn.style.display = 'block';
        if (userProfile) userProfile.classList.add('hidden');
    }

    // Event Listeners
    loginBtn?.addEventListener('click', showLoginModal);
    closeModalBtn?.addEventListener('click', hideLoginModal);

    // Google Login
    googleLoginBtn?.addEventListener('click', () => {
        signInWithGoogle()
            .then((result) => {
                hideLoginModal();
                updateUserUI(result.user);
            })
            .catch((error) => {
                console.error('Login Error:', error);
                alert('Login failed. Please try again.');
            });
    });

    // Logout
    logoutBtn?.addEventListener('click', () => {
        signOut()
            .then(() => {
                resetUserUI();
            })
            .catch((error) => {
                console.error('Logout Error:', error);
            });
    });

    // Theme Toggle Handling
    const themeToggle = document.getElementById('theme-toggle');
    
    themeToggle?.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.checked = true;
    }

    // Authentication State Observer
    firebase.auth().onAuthStateChanged((user) => {
        updateAuthUI(user);
    });

    // Update Authentication UI
    function updateAuthUI(user) {
        const loginBtn = document.getElementById('login-btn');
        const userProfile = document.getElementById('user-profile');
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (user) {
            // User is signed in
            if (loginBtn) loginBtn.style.display = 'none';
            if (userProfile) userProfile.classList.remove('hidden');
            
            if (userAvatar) userAvatar.src = user.photoURL || 'default-avatar.png';
            if (userName) userName.textContent = user.displayName || user.email;
            
            // Logout Button Event Listener
            logoutBtn?.addEventListener('click', () => {
                firebase.auth().signOut()
                    .then(() => {
                        // Redirect to login page after logout
                        window.location.href = 'login.html';
                    })
                    .catch((error) => {
                        console.error('Logout Error:', error);
                    });
            });
        } else {
            // No user is signed in
            if (loginBtn) loginBtn.style.display = 'block';
            if (userProfile) userProfile.classList.add('hidden');
        }
    }

    // Redirect to login if not authenticated
    function requireAuthentication() {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = 'login.html';
            }
        });
    }

    // Apply authentication checks to specific pages
    const currentPage = window.location.pathname;
    
    // List of pages that require authentication
    const authRequiredPages = [
        '/cart.html', 
        '/checkout.html', 
        '/profile.html'
    ];

    if (authRequiredPages.some(page => currentPage.endsWith(page))) {
        requireAuthentication();
    }
});
