// Dynamic Domain Authorization
const AuthorizedDomains = {
    domains: [
        'localhost',
        'anime-clothing-brand.web.app',
        'anime-clothing-brand.firebaseapp.com',
        'notworking33.netlify.app',
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
            this.handleUnauthorizedDomain();
        }
    },

    // Handle unauthorized domain access
    handleUnauthorizedDomain() {
        const warningBanner = document.createElement('div');
        warningBanner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background-color: #ff4d4d;
            color: white;
            text-align: center;
            padding: 10px;
            z-index: 1000;
        `;
        warningBanner.textContent = `Warning: Accessing from an unauthorized domain (${window.location.hostname})`;
        document.body.prepend(warningBanner);
    }
};

// Run initialization on script load
AuthorizedDomains.init();
