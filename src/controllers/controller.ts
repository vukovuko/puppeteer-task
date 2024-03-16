import puppeteer, { Browser, Page } from 'puppeteer';
import { createProduct } from '../models/product';
import { extractProducts, extractProductDetails } from '../utils/scraper';

export const scrapeEtsy = async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto('https://www.etsy.com', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-palette-listing-id]', { visible: true, timeout: 30000 });

    const productsData = await extractProducts(page);
    
    const detailedProductsPromises = productsData.map(async data => {
      try {
        const details = await fetchProductDetails(browser, data.url);
        if (details) {
          return createProduct(data.name, data.price, data.url, details.description, details.availableSizes, details.imageUrl);
        } else {
          throw new Error('Product details could not be fetched');
        }
      } catch (detailError) {
        console.error(`Error fetching details for ${data.url}:`, detailError);
        return createProduct(data.name, data.price, data.url, '', [], '');
      }
    });

    const detailedProducts = await Promise.all(detailedProductsPromises);
    return detailedProducts;
  } finally {
    await browser.close();
  }
};

async function fetchProductDetails(browser: Browser, productUrl: string) {
  const detailPage = await browser.newPage();
  try {
    await detailPage.goto(productUrl, { waitUntil: 'domcontentloaded' });
    const details = await extractProductDetails(detailPage);
    return details;
  } catch (error) {
    console.error(`An error occurred while fetching details for ${productUrl}:`, error);
    return null;
  } finally {
    await detailPage.close();
  }
}
