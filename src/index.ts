import { scrapeEtsy } from './controllers/controller';

async function startScraping() {
  try {
    const products = await scrapeEtsy();
    console.log('Scraped Products:', products);
  } catch (error) {
    console.error('Error during scraping:', error);
  }
}

startScraping();