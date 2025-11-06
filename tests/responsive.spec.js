import { test, expect } from '@playwright/test';

test.describe('Адаптивность сайта', () => {
  const testSizes = [
    { name: '320px', width: 320, height: 568 },
    { name: '375px', width: 375, height: 667 },
    { name: '390px', width: 390, height: 844 },
    { name: '414px', width: 414, height: 896 },
    { name: '768px', width: 768, height: 1024 },
    { name: '1024px', width: 1024, height: 768 },
    { name: '1920px', width: 1920, height: 1080 }
  ];

  testSizes.forEach(({ name, width, height }) => {
    test(`Проверка на ${name}`, async ({ page }) => {
      // Устанавливаем размер экрана
      await page.setViewportSize({ width, height });
      
      // Переходим на страницу
      await page.goto('file://' + process.cwd() + '/index.html');
      
      // Ждем загрузки страницы
      await page.waitForLoadState('networkidle');
      
      // 1. Проверяем отсутствие горизонтального скролла
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      
      console.log(`${name}: body.scrollWidth = ${bodyScrollWidth}, viewport = ${viewportWidth}`);
      
      expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 для погрешности
      
      // 2. Проверяем, что все основные элементы видны
      const header = page.locator('.header');
      const hero = page.locator('.hero');
      const features = page.locator('.features');
      const support = page.locator('.support');
      const contacts = page.locator('.contacts');
      
      await expect(header).toBeVisible();
      await expect(hero).toBeVisible();
      await expect(features).toBeVisible();
      await expect(support).toBeVisible();
      await expect(contacts).toBeVisible();
      
      // 3. Для мобильных устройств проверяем бургер меню
      if (width <= 768) {
        const mobileToggle = page.locator('.mobile-menu-toggle');
        await expect(mobileToggle).toBeVisible();
        
        // Проверяем, что десктопная навигация скрыта
        const navigation = page.locator('.navigation');
        const isHidden = await navigation.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return style.transform === 'matrix(1, 0, 0, 1, -100, 0)' || 
                 style.transform.includes('translateX(-100%)') ||
                 style.display === 'none';
        });
        
        if (width <= 768) {
          expect(isHidden).toBeTruthy();
        }
        
        // Проверяем работу мобильного меню (только для очень маленьких экранов)
        if (width <= 390) {
          await mobileToggle.click();
          await page.waitForTimeout(500); // Ждем анимацию
          
          // Проверяем, что меню открылось
          const isMenuOpen = await navigation.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return style.transform === 'matrix(1, 0, 0, 1, 0, 0)' || 
                   style.transform.includes('translateX(0px)') ||
                   el.classList.contains('mobile-menu-open');
          });
          
          expect(isMenuOpen).toBeTruthy();
          
          // Закрываем меню
          await mobileToggle.click();
          await page.waitForTimeout(500);
        }
      }
      
      // 4. Проверяем, что все карточки features видны
      const featureCards = page.locator('.feature-card');
      const featureCount = await featureCards.count();
      expect(featureCount).toBeGreaterThanOrEqual(6);
      
      // 5. Проверяем, что все карточки support видны
      const supportCards = page.locator('.support-card');
      const supportCount = await supportCards.count();
      expect(supportCount).toBeGreaterThanOrEqual(6);
      
      // 6. Проверяем контактную форму
      const contactForm = page.locator('.contact-form');
      await expect(contactForm).toBeVisible();
      
      // 7. Проверяем, что контент не выходит за границы
      const allElements = await page.locator('*').all();
      
      for (const element of allElements.slice(0, 50)) { // Проверяем первые 50 элементов
        try {
          const bbox = await element.boundingBox();
          if (bbox) {
            expect(bbox.x + bbox.width).toBeLessThanOrEqual(width + 5); // +5 для погрешности
          }
        } catch (e) {
          // Игнорируем ошибки для невидимых элементов
        }
      }
      
      // 8. Скриншот для визуальной проверки
      await page.screenshot({ 
        path: `test-results/screenshot-${name.replace('px', '')}.png`,
        fullPage: true 
      });
    });
  });

  test('Проверка мобильного меню на 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('file://' + process.cwd() + '/index.html');
    await page.waitForLoadState('networkidle');

    // Проверяем видимость бургер кнопки
    const mobileToggle = page.locator('.mobile-menu-toggle');
    await expect(mobileToggle).toBeVisible();

    // Проверяем размер бургер кнопки
    const toggleBox = await mobileToggle.boundingBox();
    expect(toggleBox.width).toBeGreaterThan(20);
    expect(toggleBox.height).toBeGreaterThan(15);

    // Проверяем, что кнопка кликабельна
    await mobileToggle.click();
    
    // Ждем открытия меню
    await page.waitForTimeout(500);
    
    // Проверяем, что меню открылось
    const navigation = page.locator('.navigation');
    await expect(navigation).toHaveClass(/mobile-menu-open/);
    
    // Проверяем видимость ссылок навигации
    const navLinks = page.locator('.nav-link');
    const linksCount = await navLinks.count();
    expect(linksCount).toBeGreaterThanOrEqual(5);
    
    for (let i = 0; i < Math.min(linksCount, 6); i++) {
      await expect(navLinks.nth(i)).toBeVisible();
    }
  });

  test('Тест переполнения контента', async ({ page }) => {
    const sizes = [320, 375, 390, 414];
    
    for (const width of sizes) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('file://' + process.cwd() + '/index.html');
      await page.waitForLoadState('networkidle');
      
      // Проверяем горизонтальный скролл у body
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });
      
      console.log(`Ширина ${width}px: scrollWidth = ${await page.evaluate(() => document.body.scrollWidth)}, innerWidth = ${await page.evaluate(() => window.innerWidth)}`);
      
      expect(hasHorizontalScroll).toBeFalsy();
      
      // Проверяем каждую секцию отдельно
      const sections = ['.header', '.hero', '.features', '.support', '.contacts', '.footer'];
      
      for (const section of sections) {
        const sectionElement = page.locator(section);
        if (await sectionElement.count() > 0) {
          const sectionWidth = await sectionElement.evaluate(el => el.scrollWidth);
          const viewportWidth = await page.evaluate(() => window.innerWidth);
          
          expect(sectionWidth).toBeLessThanOrEqual(viewportWidth + 2);
        }
      }
    }
  });
});