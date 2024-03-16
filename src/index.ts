import { fetchProductsFromHomepage } from './contollers/controller';

const startScraping = async () => {
  const products = await fetchProductsFromHomepage();
  console.log(products);
};

startScraping().catch(console.error);
