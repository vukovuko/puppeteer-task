import { scrapeEtsy } from './controllers/controller';
import fs from 'fs/promises';

async function startScraping() {
  try {
    const products = await scrapeEtsy();
    const jsonData = JSON.stringify(products, null, 2);
    await fs.writeFile('scrapedProducts.json', jsonData, 'utf-8');
    console.log('Scraped Products:', products);
  } catch (error) {
    console.error('Error during scraping:', error);
  }
}

startScraping();