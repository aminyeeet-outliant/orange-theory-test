import { test, expect } from '@playwright/test';

test('Site address should be similar to address in booking page', async ({ page }) => {
  await page.goto('https://www.sit.orangetheory.com/en-us/locations/online-join-sit-5');

  // Get the address line on home page
  const addressLine1 = await page.locator("div.active .studio-physical-address").innerText()
  const addressLine2 = await page.locator("div.active .studio-physical-address + div").innerText()
  const fullAddress = `${addressLine1} ${addressLine2}`
  await page.locator("#try-class-navbar").click()
  
  const frame = await page.waitForEvent("frameattached")
  await frame.waitForSelector("#firstName", {timeout: 10000})
  
  // Get the address line at the bookNow page
  const bookNowAddressLine1 = await page.locator(".studio-physical-address-api").innerText()
  const bookNowAddressLine2 = await page.locator(".studio-physical-address-api + div").innerText()
  const bookNowAddress = `${bookNowAddressLine1} ${bookNowAddressLine2}`

  // Validate if they are similar
  expect(fullAddress).toBe(bookNowAddress)
});

// Additional test case
test('Phone number and Zip code must have input validation', async ({page}) => {
  await page.goto('https://www.sit.orangetheory.com/en-us/locations/online-join-sit-5');
  await page.locator("#try-class-navbar").click()
  const frame = await page.waitForEvent("frameattached")

  // Input fields data
  await frame.waitForSelector("#firstName", {timeout: 10000})
  await frame.locator("#firstName input").fill("Test")
  await frame.locator("#lastName input").fill("Test")
  await frame.locator("#email input").fill("test@gmail.com")
  await frame.locator("#phoneNum input").fill("test")
  await frame.locator("#zipCode input").fill("test")
  await frame.locator("#isLocalResident").check()
  await frame.locator("button", {hasText: "Next"}).click()

  // Phone number must have validation
  await expect(frame.locator("#phoneNum + span.text-error")).toBeVisible()
  // Zip code must have validation
  await expect(frame.locator("#zipCode + span.text-error")).toBeVisible()
})
