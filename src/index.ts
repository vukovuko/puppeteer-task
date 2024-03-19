import { scrapeEtsy } from './controllers/controller';
import fs from 'fs/promises';
import { TimeoutError } from 'puppeteer';

async function startScraping() {
  try {
    const products = await scrapeEtsy();
    const jsonData = JSON.stringify(products, null, 2);
    await fs.writeFile('scrapedProducts.json', jsonData, 'utf-8');
    console.log('Scraped Products:', products);
  } catch (error) {
    if (TimeoutError) {
      console.log('CAPTCHA');
      // TODO: Add CAPTCHA logic
    } else {
      console.error('Error during startScraping:', error);
    }
  }
}

startScraping();