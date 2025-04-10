import { test, expect } from '@playwright/test';


test("Generate link", async ({ page }) => {
    const validateURL = "https://api.dev.orangetheory.io/v1/courier/document/ic/validate"
    let validateRequestPayload

    // Track the /validate endpoint and store its payload when it is available
    await page.route(validateURL, (route, request) => {
        if (request.method() === "POST") {
            validateRequestPayload = JSON.parse(request.postData())
        }
        route.continue()
    })

    let locationId = "f627d35c-9e2b-452a-8017-bfbcccff5a4d"

    // Raw data that will be converted into base64
    const rawData = {
        "person_id": "otfqa319-aa48-42fa-8888-52ff2e914ea2199",
        "member_email": "otfqas@outliant.com",
        "member_first_name": "Abby",
        "member_last_name": "Tester",
        "member_phone_number": "15551234567",
        "studio_id": "bf60d4c9-f9c3-4e5c-97f2-fe1118531493",
        "mbo_studio_id": "5729678",
        "mbo_client_id": "98765",
        "mbo_contract_id": "1234",
        "mbo_client_contract_id": "1234",
        "member_street_address": "123 Main Street",
        "member_city": "Boston",
        "member_state": "MA",
        "member_zip": "02108",
        "credit_card_last4": "1234",
        "credit_card_type": "DISCOVER",
        "product_name": "Online Elite Family Membership",
        "product_type": "Membership",
        "product_category": "Elite",
        "has_promotion": true,
        "add_on": {
            "type": "FAMILY",
            "value": "Papa Johns"
        },
        "check_id": true,
        "contract_start_date": "2032-02-25T00:00:00",
        "location_id": locationId
    };

    // Convert raw data to base64
    const base64Data = Buffer.from(JSON.stringify(rawData)).toString('base64')

    // This is now the generate link
    const generatedLink = `https://www.sit.orangetheory.com/en-us/membership-agreement?location_id=${locationId}&data=${base64Data}`
    console.log(generatedLink)
    await page.goto(generatedLink)
    const res = await page.waitForResponse(validateURL)
    expect(res.status()).toBe(200)

    // Validate here if the payload in /validate endpoint is equal to the rawData
    expect(JSON.stringify(validateRequestPayload?.data)).toBe(JSON.stringify(rawData))

    // Validate submission
    await page.frameLocator("#membership-agreement-iframe").locator("#cancelConsent").click()
    const confirmButton = page.frameLocator("#membership-agreement-iframe").getByText("Confirm")
    await confirmButton.click({delay: 5000})
    await expect(page.frameLocator("#membership-agreement-iframe").getByText("I agree", {exact: true})).toBeVisible()
})
