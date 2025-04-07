const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function regisztracioTeszt() {
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments('headless'))
        .build();

    try {
        await driver.get('http://localhost:3000/regisztracio');

        await driver.findElement(By.css('input[placeholder="Név"]')).sendKeys('Teszt Elek');
        await driver.findElement(By.css('input[placeholder="Felhasználónév"]')).sendKeys('tesztelek');
        await driver.findElement(By.css('input[placeholder="Email"]')).sendKeys('teszt@pelda.hu');
        await driver.findElement(By.css('input[placeholder="Jelszó"]')).sendKeys('Teszt1234');

        const checkbox = await driver.findElement(By.css('input[type="checkbox"]'));
        const isChecked = await checkbox.isSelected();
        if (!isChecked) {
            await checkbox.click();
        }

        await driver.findElement(By.css('button[type="submit"]')).click();

        await driver.wait(until.urlContains('/belepes'), 5000);
        const aktualisUrl = await driver.getCurrentUrl();
        assert.ok(aktualisUrl.includes('/belepes'), 'Sikeres regisztráció -> /belepes');

        console.log('\x1b[32mRegisztrációs teszt sikeres\x1b[0m');
    } catch (err) {
        console.error('Teszt hiba:', err.message);
    } finally {
        await driver.quit();
    }
})();
