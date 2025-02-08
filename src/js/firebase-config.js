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
    apiKey: window._env_ && window._env_.FIREBASE_API_KEY || "AIzaSyBUV-IWV0UWSQNKrt9hqG2ZvUrEkVk9F-s",
    authDomain: window._env_ && window._env_.FIREBASE_AUTH_DOMAIN || "anime-clothing-brand.firebaseapp.com",
    projectId: window._env_ && window._env_.FIREBASE_PROJECT_ID || "anime-clothing-brand",
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

// Network Connectivity Utility
const NetworkManager = {
    isOnline: () => navigator.onLine,
    
    checkConnectivity: () => {
        return new Promise((resolve, reject) => {
            if (!NetworkManager.isOnline()) {
                reject(new Error('No internet connection'));
                return;
            }

            // Additional network check using fetch
            fetch('https://www.google.com', { 
                mode: 'no-cors', 
                cache: 'no-store' 
            })
            .then(() => resolve(true))
            .catch(() => reject(new Error('Network connection is unstable')));
        });
    },

    setupConnectivityListeners: () => {
        window.addEventListener('online', () => {
            Logger.log('Network connection restored', 'info');
            document.dispatchEvent(new Event('network-online'));
        });

        window.addEventListener('offline', () => {
            Logger.warn('Network connection lost', 'warning');
            document.dispatchEvent(new Event('network-offline'));
        });
    }
};

// Enhanced Authentication Methods
const AuthMethods = {
    signInWithGoogle: async () => {
        try {
            // Check network connectivity before authentication
            await NetworkManager.checkConnectivity();

            const provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({
                'prompt': 'select_account',
                'login_hint': 'user@example.com'
            });

            // Add scopes for more comprehensive access
            provider.addScope('profile');
            provider.addScope('email');

            // Implement timeout for authentication
            return new Promise((resolve, reject) => {
                const authTimeout = setTimeout(() => {
                    reject(new Error('Authentication request timed out. Please try again.'));
                }, 15000); // 15 seconds timeout

                firebase.auth().signInWithPopup(provider)
                    .then(async (result) => {
                        clearTimeout(authTimeout);
                        const user = result.user;
                        
                        try {
                            // Create/Update user profile in Firestore with retry mechanism
                            await NetworkManager.checkConnectivity();
                            await firebase.firestore().collection('users').doc(user.uid).set({
                                name: user.displayName,
                                email: user.email,
                                photoURL: user.photoURL,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                role: 'customer'
                            }, { merge: true });

                            resolve(user);
                        } catch (firestoreError) {
                            // Firestore save failed, but authentication succeeded
                            Logger.warn(`Firestore profile update failed: ${firestoreError.message}`);
                            resolve(user);
                        }
                    })
                    .catch((error) => {
                        clearTimeout(authTimeout);
                        
                        // Detailed network error handling
                        let userFriendlyMessage = 'Google Sign-In failed. Please try again.';
                        
                        switch (error.code) {
                            case 'auth/network-request-failed':
                                userFriendlyMessage = 'Network error. Please check your internet connection.';
                                break;
                            case 'auth/too-many-requests':
                                userFriendlyMessage = 'Too many login attempts. Please try again later.';
                                break;
                            case 'auth/popup-blocked':
                                userFriendlyMessage = 'Login popup blocked. Please enable popups.';
                                break;
                            case 'auth/popup-closed-by-user':
                                userFriendlyMessage = 'Login popup was closed. Please try again.';
                                break;
                        }

                        Logger.error(`Google Sign-In Error: ${error.code} - ${error.message}`);
                        reject(new Error(userFriendlyMessage));
                    });
            });
        } catch (connectivityError) {
            // Network connectivity check failed
            Logger.error(`Network Error: ${connectivityError.message}`);
            throw new Error('No internet connection. Please check your network.');
        }
    },

    // Enhanced signOut method with network checks
    signOut: async () => {
        try {
            await NetworkManager.checkConnectivity();
            return firebase.auth().signOut();
        } catch (error) {
            Logger.error(`Logout Error: ${error.message}`);
            throw new Error('Unable to log out. Please check your network connection.');
        }
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

// Initialize network connectivity listeners
NetworkManager.setupConnectivityListeners();

// Initialize Authentication State Management
AuthStateManager.init();

// Expose methods globally
window.AuthMethods = AuthMethods;
window.RouteProtection = RouteProtection;
window.Logger = Logger;
