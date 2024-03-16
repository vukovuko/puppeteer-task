import { Page } from 'puppeteer';
import { Product } from '../models/product';

export const extractProducts = async (page: Page): Promise<Product[]> => {
  return await page.evaluate(() => {
    // Evaluate cannot use module functions due to browser context
    const items: Product[] = [];
    document.querySelectorAll('[data-palette-listing-id]').forEach(el => {
      const name = el.querySelector('h3')?.textContent?.trim() ?? 'Unknown';
      const url = el.querySelector('a')?.href ?? 'Unknown URL';
      const priceElement = el.querySelector('.currency-value');
      const priceSymbol = el.querySelector('.currency-symbol');
      const price = priceElement && priceSymbol ? `${priceElement.textContent?.trim()} ${priceSymbol.textContent?.trim()}` : 'Unknown Price';
      const imageUrl = el.querySelector('img')?.src ?? 'Unknown Image';
      items.push({ name, price, url, imageUrl });
    });
    return items;
  });
};
