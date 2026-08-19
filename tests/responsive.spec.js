import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const pages = ['index.html', 'features.html', 'industries.html', 'products.html', 'pricing.html', 'support.html'];
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 320, height: 568 }
];

for (const viewport of viewports) {
  test.describe(`${viewport.width}×${viewport.height}`, () => {
    test.use({ viewport });

    for (const route of pages) {
      test(`${route} stays within the viewport`, async ({ page }) => {
        const errors = [];
        page.on('console', message => {
          if (message.type() === 'error') errors.push(message.text());
        });
        await page.goto(`${baseURL}/${route}`, { waitUntil: 'networkidle' });
        await expect(page.locator('.header')).toBeVisible();
        await expect(page.locator('main#main-content')).toBeVisible();
        await expect(page.locator('.footer')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
        expect(errors).toEqual([]);
      });
    }
  });
}

test('mobile menu exposes accessible state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/index.html`, { waitUntil: 'networkidle' });
  const toggle = page.locator('.mobile-menu-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.mobile-navigation')).toHaveAttribute('aria-hidden', 'false');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
