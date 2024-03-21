import { scrapeEtsy } from './controllers/controller';
import fs from 'fs/promises';
import { ProtocolError, TimeoutError } from 'puppeteer';

async function startScraping() {
  try {
    const products = await scrapeEtsy();
    const jsonData = JSON.stringify(products, null, 2);
    await fs.writeFile('scrapedProducts.json', jsonData, 'utf-8');
    console.log('Scraped Products:', products);
  } catch (error) {
    if (error instanceof TimeoutError) {
      console.log('CAPTCHA');
      // TODO: Add CAPTCHA logic
    } else if (error instanceof ProtocolError) {
      console.log("Invalid URL. Please enter real URL.", ProtocolError);
    } else {
      console.error('Error during startScraping:', error);
    }
  }
}

startScraping();