import { fetchProductsFromHomepage } from './controllers/controller';

const startScraping = async () => {
  try {
    const products = await fetchProductsFromHomepage();
    console.log(products);
  } catch (error) {
    console.error("Error during scraping:", error);
  }
};

startScraping();
