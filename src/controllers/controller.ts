import puppeteer from 'puppeteer';
import { createProduct } from '../models/product';
import { extractProducts } from '../utils/scraper';

export const fetchProductsFromHomepage = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.etsy.com');
  await page.waitForSelector('[data-palette-listing-id]');
  
  const productsData = await extractProducts(page);
  
  const products = productsData.map(data => 
    createProduct(data.name, data.price, data.url, '', [], data.imageUrl)
  );

  await browser.close();
  return products;
};
