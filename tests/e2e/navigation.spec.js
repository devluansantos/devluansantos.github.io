import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test('should toggle mobile menu', async ({ page }) => {
        await page.goto('/');
        
        // Check if mobile menu toggle exists
        const navToggle = page.locator('.nav-toggle');
        const navMenu = page.locator('.nav-menu');
        
        // Only test on mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        
        if (await navToggle.isVisible()) {
            await navToggle.click();
            await expect(navMenu).toHaveClass(/active/);
            
            await navToggle.click();
            await expect(navMenu).not.toHaveClass(/active/);
        }
    });

    test('should navigate to posts', async ({ page }) => {
        await page.goto('/');
        
        const firstPost = page.locator('.article-link').first();
        if (await firstPost.count() > 0) {
            await firstPost.click();
            await expect(page).toHaveURL(/\/posts\//);
        }
    });
});

