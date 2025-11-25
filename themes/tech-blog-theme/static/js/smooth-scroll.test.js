/**
 * Smooth Scroll Module Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SmoothScroll } from './smooth-scroll.js';

describe('SmoothScroll', () => {
    let smoothScroll;

    beforeEach(() => {
        document.body.innerHTML = `
            <a href="#section1">Link 1</a>
            <div id="section1">Section 1</div>
            <a href="#section2">Link 2</a>
            <div id="section2">Section 2</div>
            <a href="#">Empty</a>
        `;

        smoothScroll = new SmoothScroll();
    });

    it('should initialize', () => {
        expect(smoothScroll).toBeDefined();
    });

    it('should scroll to target on anchor click', () => {
        const anchor = document.querySelector('a[href="#section1"]');
        const target = document.querySelector('#section1');
        const scrollIntoView = vi.fn();
        target.scrollIntoView = scrollIntoView;

        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        anchor.dispatchEvent(clickEvent);

        expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });

    it('should not scroll for empty hash', () => {
        const anchor = document.querySelector('a[href="#"]');
        const preventDefault = vi.fn();
        
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        clickEvent.preventDefault = preventDefault;
        
        anchor.dispatchEvent(clickEvent);
        
        expect(preventDefault).not.toHaveBeenCalled();
    });
});

