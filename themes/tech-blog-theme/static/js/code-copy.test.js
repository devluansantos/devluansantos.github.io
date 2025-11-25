/**
 * Code Copy Module Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CodeCopy } from './code-copy.js';

describe('CodeCopy', () => {
    let codeCopy;
    let mockClipboard;

    beforeEach(() => {
        document.body.innerHTML = `
            <pre><code>const test = 'code';</code></pre>
        `;

        mockClipboard = {
            writeText: vi.fn().mockResolvedValue(undefined),
        };
        global.navigator.clipboard = mockClipboard;

        codeCopy = new CodeCopy();
    });

    it('should initialize and add copy buttons', () => {
        const button = document.querySelector('.copy-code-button');
        expect(button).toBeDefined();
        expect(button.textContent).toBe('Copiar');
    });

    it('should copy code to clipboard on click', async () => {
        const button = document.querySelector('.copy-code-button');
        const clickEvent = new MouseEvent('click', { bubbles: true });
        
        button.dispatchEvent(clickEvent);
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(mockClipboard.writeText).toHaveBeenCalledWith("const test = 'code';");
    });

    it('should show success message after copy', async () => {
        const button = document.querySelector('.copy-code-button');
        button.click();
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(button.textContent).toBe('Copiado!');
        expect(button.classList.contains('copied')).toBe(true);
    });

    it('should handle copy errors', async () => {
        mockClipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));
        const button = document.querySelector('.copy-code-button');
        
        button.click();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(button.textContent).toBe('Erro');
    });
});

