const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function testLogin() {
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments('headless'))
        .build();

    try {
        await driver.get('http://localhost:3000/belepes');

        await driver.findElement(By.css('input[placeholder="Felhasználónév"]')).sendKeys('Berlo');
        await driver.findElement(By.css('input[placeholder="Jelszó"]')).sendKeys('Berlo12345');
        await driver.findElement(By.css('button[type="submit"]')).click();

        await driver.wait(until.urlContains('/profil'), 5000);

        const currentUrl = await driver.getCurrentUrl();
        assert.ok(currentUrl.includes('/profil'), 'Sikeres bejelentkezés -> /profil');

        console.log('\x1b[32mBejelentkezési teszt sikeres\x1b[0m');
    } catch (err) {
        console.error('Teszt hiba:', err.message);
    } finally {
        await driver.quit();
    }
})();
