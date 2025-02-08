document.addEventListener('DOMContentLoaded', () => {
    // Ensure Firebase is fully loaded
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.error('Firebase not initialized');
        return;
    }

    // Form Elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const googleSignupBtn = document.getElementById('google-signup-btn');

    // Form Validation Utility
    const FormValidator = {
        validateEmail: (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        validatePassword: (password) => {
            return password.length >= 6;
        },
        validateSignup: (name, email, password, confirmPassword) => {
            const errors = [];

            if (!name || name.trim().length < 2) {
                errors.push('Please enter a valid name');
            }

            if (!FormValidator.validateEmail(email)) {
                errors.push('Please enter a valid email address');
            }

            if (!FormValidator.validatePassword(password)) {
                errors.push('Password must be at least 6 characters long');
            }

            if (password !== confirmPassword) {
                errors.push('Passwords do not match');
            }

            return errors;
        }
    };

    // Form Switching
    function showSignupForm() {
        if (loginForm && signupForm) {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }
    }

    function showLoginForm() {
        if (loginForm && signupForm) {
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    }

    // Event Listeners for Form Switching
    switchToSignup?.addEventListener('click', (e) => {
        e.preventDefault();
        showSignupForm();
    });

    switchToLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    // Email/Password Login
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Basic validation
        if (!FormValidator.validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log('User logged in successfully');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                
                let userFriendlyMessage = 'Login failed. Please try again.';
                
                switch (errorCode) {
                    case 'auth/wrong-password':
                        userFriendlyMessage = 'Incorrect password. Please try again.';
                        break;
                    case 'auth/user-not-found':
                        userFriendlyMessage = 'No account found with this email. Please sign up.';
                        break;
                    case 'auth/invalid-email':
                        userFriendlyMessage = 'Invalid email address.';
                        break;
                }
                
                alert(userFriendlyMessage);
                console.error('Login Error:', errorMessage);
            });
    });

    // Email/Password Signup
    signupForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Comprehensive Validation
        const validationErrors = FormValidator.validateSignup(
            name, email, password, confirmPassword
        );

        if (validationErrors.length > 0) {
            alert(validationErrors.join('\n'));
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Create user profile in Firestore
                return firebase.firestore().collection('users').doc(user.uid).set({
                    name: name,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    role: 'customer'
                });
            })
            .then(() => {
                console.log('User signed up successfully');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                
                let userFriendlyMessage = 'Signup failed. Please try again.';
                
                switch (errorCode) {
                    case 'auth/email-already-in-use':
                        userFriendlyMessage = 'Email already in use. Please login or use a different email.';
                        break;
                    case 'auth/invalid-email':
                        userFriendlyMessage = 'Invalid email address.';
                        break;
                    case 'auth/weak-password':
                        userFriendlyMessage = 'Password is too weak. Please choose a stronger password.';
                        break;
                }
                
                alert(userFriendlyMessage);
                console.error('Signup Error:', errorMessage);
            });
    });

    // Google Login/Signup
    function handleGoogleAuth() {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            'prompt': 'select_account'
        });
        
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                
                // Save or update user in Firestore
                return firebase.firestore().collection('users').doc(user.uid).set({
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    role: 'customer'
                }, { merge: true });
            })
            .then(() => {
                console.log('Google authentication successful');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                
                let userFriendlyMessage = 'Google Sign-In failed. Please try again.';
                
                switch (errorCode) {
                    case 'auth/account-exists-with-different-credential':
                        userFriendlyMessage = 'An account already exists with a different login method.';
                        break;
                    case 'auth/popup-blocked':
                        userFriendlyMessage = 'Popup blocked. Please enable popups and try again.';
                        break;
                }
                
                alert(userFriendlyMessage);
                console.error('Google Login Error:', errorMessage);
            });
    }

    googleLoginBtn?.addEventListener('click', handleGoogleAuth);
    googleSignupBtn?.addEventListener('click', handleGoogleAuth);

    // Initial Form State
    if (window.location.hash === '#signup') {
        showSignupForm();
    }

    // Network Status Monitoring
    window.addEventListener('online', () => {
        console.log('Network connection restored');
    });

    window.addEventListener('offline', () => {
        console.warn('Network connection lost');
        alert('You are currently offline. Please check your internet connection.');
    });
});
