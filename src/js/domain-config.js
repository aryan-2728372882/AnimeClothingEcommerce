// Dynamic Domain Authorization
const AuthorizedDomains = {
    domains: [
        'localhost',
        'anime-clothing-brand.web.app',
        'anime-clothing-brand.firebaseapp.com',
        'notworking33.netlify.app/',
        // Netlify deployment URL will be added dynamically
        window.location.hostname
    ],

    // Check if current domain is authorized
    isAuthorized() {
        const currentDomain = window.location.hostname;
        return this.domains.includes(currentDomain);
    },

    // Add new domain to authorized list
    addDomain(domain) {
        if (!this.domains.includes(domain)) {
            this.domains.push(domain);
            console.log(`Domain ${domain} added to authorized list`);
        }
    },

    // Initialize domain authorization
    init() {
        if (!this.isAuthorized()) {
            console.warn(`Unauthorized domain: ${window.location.hostname}`);
            // Optional: Redirect to a default page or show warning
        }
    }
};

// Run initialization on script load
AuthorizedDomains.init();
