import { Page } from 'puppeteer';
import { Product } from '../models/product';

export const extractProducts = async (page: Page): Promise<Product[]> => {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-palette-listing-id]')).map(el => {
      const name = (el.querySelector('h3') as HTMLHeadingElement)?.textContent?.trim() ?? 'Unknown';
      const url = (el.querySelector('a') as HTMLAnchorElement)?.href ?? 'Unknown URL';
      const priceElement = el.querySelector('.currency-value') as HTMLDivElement;
      const price = priceElement ? `${priceElement.textContent?.trim()}` : 'Unknown Price';
      const imageUrl = (el.querySelector('img') as HTMLImageElement)?.src ?? 'Unknown Image';
      return { name, price, url, imageUrl };
    });
  });
};

export const extractProductDetails = async (page: Page) => {
  return await page.evaluate(() => {
    const nameElement = document.querySelector('h1');
    const name = nameElement ? nameElement.textContent?.trim() : 'Unknown';

    const priceElement = document.querySelector('div[data-selector="price-only"] p');
    const price = priceElement && priceElement.textContent ? priceElement.textContent.trim().replace(/^Price:\s*/, '') : 'Unknown Price';

    const descriptionElement = document.querySelector('[data-product-details-description-text-content]');
    const description = descriptionElement ? descriptionElement.innerHTML.replace(/<br\s*\/?>/gi, '').trim() : 'No description';

    const sizesOptions = document.querySelectorAll('#variation-selector-0 option');
    const availableSizes = Array.from(sizesOptions).map((opt) => {
      return opt.textContent?.trim() ?? '';
    }).filter(text => text !== 'Select an option');

    const imageElement = document.querySelector('[data-carousel-first-image]');
    const imageUrl = imageElement instanceof HTMLImageElement ? imageElement.src : 'Unknown Image';

    return {
      name,
      price,
      description,
      availableSizes,
      imageUrl
    };
  });
};