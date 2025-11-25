/**
 * Main Application Entry Point
 * Initializes all modules when DOM is ready
 */

import { Navigation } from './navigation.js';
import { ThemeManager } from './theme.js';
import { SmoothScroll } from './smooth-scroll.js';
import { LazyLoad } from './lazy-load.js';
import { PWA } from './pwa.js';
import { Analytics } from './analytics.js';

class App {
    constructor() {
        this.modules = [];
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        // Initialize theme first (needs to run before DOMContentLoaded)
        new ThemeManager();

        // Initialize other modules
        this.modules.push(
            new Navigation(),
            new SmoothScroll(),
            new LazyLoad(),
            new PWA(),
            new Analytics()
        );
    }
}

// Initialize app
const app = new App();
app.init();
