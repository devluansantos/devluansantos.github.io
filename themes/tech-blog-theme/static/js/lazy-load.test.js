/**
 * Lazy Load Module Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LazyLoad } from './lazy-load.js';

describe('LazyLoad', () => {
    let lazyLoad;

    beforeEach(() => {
        document.body.innerHTML = `
            <img data-src="/test.jpg" alt="Test">
        `;
    });

    it('should initialize', () => {
        lazyLoad = new LazyLoad();
        expect(lazyLoad).toBeDefined();
    });

    it('should load image when IntersectionObserver is not available', () => {
        global.IntersectionObserver = undefined;
        lazyLoad = new LazyLoad();
        
        const img = document.querySelector('img[data-src]');
        expect(img.getAttribute('data-src')).toBeNull();
    });
});

