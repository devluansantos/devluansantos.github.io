/**
 * Analytics Module
 * Privacy-focused analytics using Plausible or custom solution
 */

export class Analytics {
    constructor() {
        this.config = {
            enabled: true,
            provider: 'plausible', // 'plausible', 'custom', 'none'
            domain: window.location.hostname,
        };
        this.init();
    }

    init() {
        if (!this.config.enabled || this.config.provider === 'none') {
            return;
        }

        switch (this.config.provider) {
            case 'plausible':
                this.initPlausible();
                break;
            case 'custom':
                this.initCustom();
                break;
        }

        // Track page views
        this.trackPageView();
        
        // Track outbound links
        this.trackOutboundLinks();
    }

    initPlausible() {
        // Plausible Analytics - privacy-focused
        const script = document.createElement('script');
        script.defer = true;
        script.dataset.domain = this.config.domain;
        script.src = 'https://plausible.io/js/script.js';
        document.head.appendChild(script);
    }

    initCustom() {
        // Custom analytics endpoint
        this.endpoint = '/api/analytics';
    }

    trackPageView() {
        if (this.config.provider === 'custom') {
            this.sendEvent('pageview', {
                path: window.location.pathname,
                referrer: document.referrer,
            });
        }
    }

    trackOutboundLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="http"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href && !href.includes(window.location.hostname)) {
                this.sendEvent('outbound', {
                    url: href,
                });
            }
        });
    }

    sendEvent(eventName, data = {}) {
        if (this.config.provider === 'custom' && this.endpoint) {
            // Send to custom endpoint
            fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: eventName,
                    ...data,
                    timestamp: new Date().toISOString(),
                }),
            }).catch(() => {
                // Silently fail
            });
        }
    }
}

