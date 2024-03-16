import puppeteer from 'puppeteer';
import { Product, createProduct } from '../models/product.js';

export const fetchProductsFromHomepage = async (): Promise<Product[]> => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://www.etsy.com');

	await browser.close();
	return [];
};
