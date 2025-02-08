// Firebase Configuration and Enhanced Authentication Management

// Logging Utility
const Logger = {
    log: (message, level = 'info') => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        
        console.log(logMessage);
        
        // Optional: Send logs to backend or local storage
        try {
            const logs = JSON.parse(localStorage.getItem('appLogs') || '[]');
            logs.push({ timestamp, level, message });
            localStorage.setItem('appLogs', JSON.stringify(logs.slice(-50))); // Keep last 50 logs
        } catch (error) {
            console.error('Logging failed', error);
        }
    },
    error: (message) => Logger.log(message, 'error'),
    warn: (message) => Logger.log(message, 'warn')
};

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUV-IWV0UWSQNKrt9hqG2ZvUrEkVk9F-s",
    authDomain: "anime-clothing-brand.firebaseapp.com",
    projectId: "anime-clothing-brand",
    storageBucket: "anime-clothing-brand.appspot.com",
    messagingSenderId: "1041175810114",
    appId: "1:1041175810114:web:dcb5653d96c8681e261ddb",
    measurementId: "G-38X0DEFV0C"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    Logger.log('Firebase initialized successfully');
} catch (error) {
    Logger.error(`Firebase initialization failed: ${error.message}`);
}

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();

// Authentication Error Handler
const AuthErrorHandler = {
    getErrorMessage: (errorCode) => {
        const errorMessages = {
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/invalid-email': 'Invalid email address.',
            'auth/email-already-in-use': 'Email already registered. Try logging in.',
            'auth/weak-password': 'Password is too weak. Use a stronger password.',
            'auth/popup-blocked': 'Login popup blocked. Please enable popups.',
            'auth/network-request-failed': 'Network error. Check your connection.',
            'default': 'Authentication failed. Please try again.'
        };
        return errorMessages[errorCode] || errorMessages['default'];
    },
    handleError: (error) => {
        const friendlyMessage = AuthErrorHandler.getErrorMessage(error.code);
        Logger.error(`Authentication Error: ${error.code} - ${error.message}`);
        
        // Optional: Send error to monitoring service
        alert(friendlyMessage);
        
        return friendlyMessage;
    }
};

// Authentication State Observer
const AuthStateManager = {
    updateUI: (user) => {
        try {
            const loginElements = document.querySelectorAll('.login-trigger');
            const logoutElements = document.querySelectorAll('.logout-trigger');
            const userProfileElements = document.querySelectorAll('.user-profile');

            loginElements.forEach(el => {
                el.style.display = user ? 'none' : 'block';
            });

            logoutElements.forEach(el => {
                el.style.display = user ? 'block' : 'none';
            });

            userProfileElements.forEach(el => {
                if (user) {
                    el.innerHTML = `
                        <img src="${user.photoURL || 'default-avatar.png'}" alt="User Avatar">
                        <span>${user.displayName || user.email}</span>
                    `;
                    el.style.display = 'flex';
                } else {
                    el.style.display = 'none';
                }
            });

            Logger.log(`UI updated for user: ${user ? user.email : 'Not logged in'}`);
        } catch (error) {
            Logger.error(`UI update failed: ${error.message}`);
        }
    },
    init: () => {
        auth.onAuthStateChanged((user) => {
            AuthStateManager.updateUI(user);
            
            const currentPath = window.location.pathname;
            const protectedRoutes = ['/cart.html', '/checkout.html'];
            
            if (protectedRoutes.some(route => currentPath.endsWith(route))) {
                if (!user) {
                    window.location.href = 'login.html';
                }
            }
        });
    }
};

// Authentication Methods
const AuthMethods = {
    signInWithGoogle: () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ 'prompt': 'select_account' });
        
        return auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                
                return db.collection('users').doc(user.uid).set({
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    role: 'customer'
                }, { merge: true });
            })
            .catch(AuthErrorHandler.handleError);
    },
    signOut: () => {
        return auth.signOut()
            .then(() => {
                window.location.href = 'login.html';
                Logger.log('User logged out successfully');
            })
            .catch(AuthErrorHandler.handleError);
    }
};

// Cart and Checkout Protection
const RouteProtection = {
    checkCartAccess: () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Please add items to cart before proceeding');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
};

// Initialize Authentication State Management
AuthStateManager.init();

// Expose methods globally
window.AuthMethods = AuthMethods;
window.RouteProtection = RouteProtection;
window.Logger = Logger;
