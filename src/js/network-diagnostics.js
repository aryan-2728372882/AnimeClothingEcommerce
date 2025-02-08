// Comprehensive Network Diagnostics Utility
class NetworkDiagnostics {
    constructor() {
        this.diagnosticServers = [
            'https://www.google.com',
            'https://www.cloudflare.com',
            'https://www.microsoft.com'
        ];
        this.maxRetries = 3;
        this.retryDelay = 2000; // 2 seconds between retries
    }

    // Advanced connectivity check with multiple server probing
    async checkConnectivity() {
        console.log('Starting network diagnostics...');
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const results = await Promise.race([
                    ...this.diagnosticServers.map(server => this.probeServer(server)),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Diagnostic timeout')), 5000)
                    )
                ]);

                console.log('Network diagnostic successful', results);
                return true;
            } catch (error) {
                console.warn(`Network diagnostic attempt ${attempt} failed:`, error.message);
                
                if (attempt < this.maxRetries) {
                    await this.delay(this.retryDelay);
                }
            }
        }

        throw new Error('Persistent network connectivity issues');
    }

    // Probe individual server with detailed diagnostics
    async probeServer(serverUrl) {
        const startTime = Date.now();
        
        try {
            const response = await fetch(serverUrl, {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-store',
                timeout: 3000
            });

            const endTime = Date.now();
            const latency = endTime - startTime;

            return {
                server: serverUrl,
                status: 'success',
                latency: latency
            };
        } catch (error) {
            throw new Error(`Server probe failed for ${serverUrl}: ${error.message}`);
        }
    }

    // Simulate network conditions
    simulateNetworkConditions(type) {
        switch (type) {
            case 'slow':
                // Simulate slow network
                return new Promise(resolve => setTimeout(resolve, 5000));
            case 'intermittent':
                // Simulate intermittent connectivity
                return Math.random() > 0.5 
                    ? Promise.resolve() 
                    : Promise.reject(new Error('Intermittent connection'));
            default:
                return Promise.resolve();
        }
    }

    // Utility delay method
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Comprehensive error analysis
    analyzeNetworkError(error) {
        const errorTypes = {
            'TypeError': 'Network request failed',
            'AbortError': 'Request was aborted',
            'TimeoutError': 'Connection timed out',
            'NetworkError': 'Unable to connect to server'
        };

        return {
            type: errorTypes[error.name] || 'Unknown network error',
            message: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Global network diagnostics instance
window.NetworkDiagnostics = new NetworkDiagnostics();
