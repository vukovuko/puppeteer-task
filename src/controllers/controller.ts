import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { TimeoutError } from 'puppeteer';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createProduct } from '../models/product';
import { extractProducts, extractProductDetails } from '../utils/scraper';
import { PERSONALIZATION_TEXT, TIMEOUT, TYPING_DELAY } from '../utils/constants';
import { NUMER_OF_PRODUCTS } from '../utils/constants';
import { setupPage } from '../utils/helper';

puppeteer.use(AdblockerPlugin()).use(StealthPlugin());

export const scrapeEtsy = async () => {
  const browser = await puppeteer.launch({ headless: false });
  try {
    const page = await browser.newPage();

    await setupPage(page);

    await page.goto('https://www.etsy.com', { waitUntil: 'networkidle0' })

    await page.waitForSelector('[data-palette-listing-id]', { visible: true, timeout: TIMEOUT });

    // Product discovery
    const productsData = await extractProducts(page, NUMER_OF_PRODUCTS);
    console.log(productsData, 'Finished product discovery');

    // Product detail Extraction for each product
    const detailedProducts = [];
    for (const product of productsData) {
      try {
        const details = await fetchProductDetails(browser, product.url);
        if (details) {
          detailedProducts.push(createProduct(product.name, product.price, product.url, details.description, details.availableSizes, details.imageUrl));
        }
      } catch (error) {
        console.error(`An error occurred while fetching details for ${product.url}:`, error);
        continue;
      }
    }

    // Simulate adding the first Product to the Cart
    if (detailedProducts.length > 0) {
      console.log(`Adding first product to cart: ${detailedProducts[0].url}`);
      await simulateAddToCart(browser, detailedProducts[0].url);
      console.log("Product added to cart.");
    } else {
      console.log("No products found or unable to fetch product details.");
      return productsData;
    }

    return detailedProducts;
  } catch (error) {
    if (TimeoutError) {
      console.error('No products found on the page.', error);
      // TODO: Go to collection page and try again
    } else {
      console.error(`Error during scraping:`, error);
    }
  } finally {
    await browser.close();
  }
};

async function fetchProductDetails(browser: Browser, productUrl: string) {
  const detailPage = await browser.newPage();
  try {
    await detailPage.goto(productUrl, { waitUntil: 'networkidle0' });
    const details = await extractProductDetails(detailPage);
    return details;
  } catch (error) {
    console.error(`An error occurred while fetching details for ${productUrl}:`, error);
    return null;
  } finally {
    await detailPage.close();
  }
};

async function simulateAddToCart(browser: Browser, productUrl: string) {
  const page = await browser.newPage();
  await page.goto(productUrl, { waitUntil: 'networkidle0' });

  // Variant picker
  const selectIds = ['#variation-selector-0', '#variation-selector-1'];
  for (const selectId of selectIds) {
    const selectExists = await page.$(selectId);
    if (selectExists) {
      await page.select(selectId, await page.$eval(`${selectId} option:nth-child(2)`, option => option.value));
      // Wait for requests to complete after changing the variant
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 3000 }).catch(e => console.log('No further navigation detected after selection.'));
    }
  }

  // Some products require personalization text for them to be added to the cart
  const textAreaSelector = '#listing-page-personalization-textarea';
  const textAreaExists = await page.$(textAreaSelector);
  if (textAreaExists) {
    await page.type(textAreaSelector, PERSONALIZATION_TEXT, { delay: TYPING_DELAY });
  }

  const addToCartButtonSelector = '.add-to-cart-form button[type="submit"]';
  await page.click(addToCartButtonSelector);

  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  if (page.url().includes('/cart')) {
    console.log('Proceed to checkout')
    const proceedToCheckoutButtonSelector = 'form.enter-checkout-form button[type="submit"]';
    await page.click(proceedToCheckoutButtonSelector);

    const continueAsGuestButtonSelector = 'button.wt-btn--secondary[type="submit"][name="submit_attempt"]';
    await page.waitForSelector(continueAsGuestButtonSelector, { visible: true });
    await page.click(continueAsGuestButtonSelector);
    
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.type('input[name="email_address"]', 'your_email@gmail.com', { delay: TYPING_DELAY });
    await page.type('input[name="email_address_confirmation"]', 'your_email@gmail.com', { delay: TYPING_DELAY });
    await page.select('select[name="country_id"]', '189');
    await page.type('input[name="name"]', 'Your Full Name', { delay: TYPING_DELAY });
    await page.type('input[name="first_line"]', 'Your Street Address', { delay: TYPING_DELAY });
    await page.type('input[name="city"]', 'Novi Sad', { delay: TYPING_DELAY });

    await page.click('button[data-selector-save-btn=""]');

    console.log('Payment options');
  } else {
    throw new Error('Not on the cart page');
  }

  console.log(`Added to cart: ${productUrl}`);
  await page.close();
};