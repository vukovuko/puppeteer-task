describe("Etsy Product Discovery", () => {
  beforeAll(async () => {
    await page.goto("https://www.etsy.com");
  });
  
  it('should display "Shop" on the homepage', async () => {
    await expect(page).toMatchTextContent("Shop");
  });
});

