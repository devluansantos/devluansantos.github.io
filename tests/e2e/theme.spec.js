import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
    test('should toggle theme', async ({ page }) => {
        await page.goto('/');
        
        const themeToggle = page.locator('.theme-toggle');
        if (await themeToggle.count() > 0) {
            const initialTheme = await page.evaluate(() => 
                document.documentElement.getAttribute('data-theme')
            );
            
            await themeToggle.click();
            
            const newTheme = await page.evaluate(() => 
                document.documentElement.getAttribute('data-theme')
            );
            
            expect(newTheme).not.toBe(initialTheme);
        }
    });

    test('should persist theme preference', async ({ page, context }) => {
        await page.goto('/');
        
        const themeToggle = page.locator('.theme-toggle');
        if (await themeToggle.count() > 0) {
            await themeToggle.click();
            const theme = await page.evaluate(() => 
                document.documentElement.getAttribute('data-theme')
            );
            
            // Reload page
            await page.reload();
            
            const persistedTheme = await page.evaluate(() => 
                document.documentElement.getAttribute('data-theme')
            );
            
            expect(persistedTheme).toBe(theme);
        }
    });
});

