import { Page } from 'puppeteer';
import UserAgent from 'user-agents';
import { DISTANCE_FOR_SCROLL, TIME_BETWEEN_SCROLL, MAX_SCROLLS } from './constants';

export async function setupPage(page: Page) {
  const userAgent = new UserAgent({ deviceCategory: 'desktop' });
  const randomUserAgent = userAgent.toString();

  await page.setUserAgent(randomUserAgent);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
};

export async function infiniteScroll(page: Page, maxScrolls: number = MAX_SCROLLS): Promise<void> {
  await page.evaluate((maxScrolls, distance, timeBetweenScroll) => {
    return new Promise<void>((resolve) => {
      let totalHeight = 0;
      let scrolls = 0;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        scrolls++;

        if(totalHeight >= scrollHeight - window.innerHeight || scrolls >= maxScrolls) {
          clearInterval(timer);
          resolve();
        }
      }, timeBetweenScroll);
    });
  }, maxScrolls, DISTANCE_FOR_SCROLL, TIME_BETWEEN_SCROLL);
};

async function acceptCookiesFromPopup(page: Page, popupSelector: string, acceptButtonSelector: string): Promise<boolean> {
  try {
    await page.waitForSelector(popupSelector);
    await page.click(acceptButtonSelector);
    return true;
  } catch (error) {
    console.error('Error handling the cookie popup:', error);
    return false;
  }
};