// Environment Configuration Loader
(function() {
    // Create global _env_ object if it doesn't exist
    window._env_ = window._env_ || {};

    // Load environment variables from Netlify
    const netlifyEnv = {
        FIREBASE_API_KEY: 'AIzaSyBUV-IWV0UWSQNKrt9hqG2ZvUrEkVk9F-s',
        FIREBASE_AUTH_DOMAIN: 'anime-clothing-brand.firebaseapp.com',
        FIREBASE_PROJECT_ID: 'anime-clothing-brand'
    };

    // Merge Netlify environment variables
    Object.keys(netlifyEnv).forEach(key => {
        if (netlifyEnv[key] && netlifyEnv[key] !== '{{ ' + key + ' }}') {
            window._env_[key] = netlifyEnv[key];
        }
    });

    // Logging for debugging
    console.log('Environment Configuration Loaded:', window._env_);
})();
