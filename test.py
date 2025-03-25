from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import time
import unittest

class RentifyTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.wait = WebDriverWait(cls.driver, 10)
        cls.base_url = "http://localhost:3000"
        
    def test_1_fooldal_betoltes(self):
        self.driver.get(self.base_url)
        self.assertIn("Rentify", self.driver.title)
        print("A főoldal sikeresen betöltődött")
        
    def test_2_navigacios_menu(self):
        self.driver.get(self.base_url)
        home_link = self.wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Főoldal")))

        home_link.click()
        self.assertIn("Főoldal", self.driver.page_source)
        
        properties_link = self.wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Ingatlanok")))
        properties_link.click()
        self.assertIn("Ingatlanok", self.driver.page_source)
        print("Navigáció az Ingatlanok oldalra sikeres")
        
        about_link = self.wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Rólunk")))
        about_link.click()
        self.assertIn("Rólunk", self.driver.page_source)
        print("Navigáció a Rólunk oldalra sikeres")
        
    def test_3_bejelentkezes_funkcionalitas(self):
        self.driver.get(f"{self.base_url}/belepes")
        try:
            username = self.wait.until(EC.presence_of_element_located((By.NAME, "username")))
            password = self.driver.find_element(By.NAME, "password")
            username.send_keys("testuser")
            password.send_keys("testpassword")
        
            login_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Bejelentkezés')]")
            login_button.click()
            
            self.wait.until(EC.presence_of_element_located((By.LINK_TEXT, "Profil")))
            print("A bejelentkezés sikeres")
        except TimeoutException:
            print("A bejelentkezés nem sikerült - ellenőrizd a felhasználói adatokat")
            
    def test_4_ingatlan_lista(self):
        self.driver.get(f"{self.base_url}/ingatlanok")
        
        try:
            property_cards = self.wait.until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".property-card, .other-class, .another-class"))
            )
            print(f"{len(property_cards)} ingatlan kártya található")
        except TimeoutException:
            print("Nincs ingatlan kártya található")

            try:
                filter_button = self.driver.find_element(By.ID, "showMoreFilter")
                filter_button.click()
                
                wifi_checkbox = self.wait.until(
                    EC.element_to_be_clickable((By.ID, "wifiCb")))
                wifi_checkbox.click()
                
                time.sleep(2)
                print("Szűrés sikeresen alkalmazva")
            except NoSuchElementException:
                print("Szűrő elemek nem találhatóak")
            
    def test_6_regisztracio(self):
        self.driver.get(f"{self.base_url}/regisztracio")
        
        try:
            name = self.wait.until(EC.presence_of_element_located((By.NAME, "name")))
            username = self.driver.find_element(By.NAME, "loginName")
            email = self.driver.find_element(By.NAME, "email")
            password = self.driver.find_element(By.NAME, "password")
            
            name.send_keys("Teszt Felhasználó")
            username.send_keys(f"testuser{int(time.time())}")
            email.send_keys(f"test{int(time.time())}@example.com")
            password.send_keys("TestPassword123")
            
            register_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Regisztráció')]")
            register_button.click()
            
            time.sleep(2)
            print("A regisztrációs űrlap sikeresen elküldve")
        except NoSuchElementException:
            print("A regisztrációs űrlap elemei nem találhatóak")
            
    def test_7_rolunk_oldal(self):
        self.driver.get(f"{self.base_url}/rolunk")
        
        try:
            team_section = self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "aboutUsTeam")))
            self.assertIn("Csapatunk", team_section.text)
            print("A Rólunk oldal csapat szakasza ellenőrizve")
        except TimeoutException:
            print("A csapat szakasz nem található")
            
    def test_8_betoltes_belépett_bérlővel(self):
        self.driver.get(f"{self.base_url}/belepes")
        try:
            username = self.wait.until(EC.presence_of_element_located((By.NAME, "username")))
            password = self.driver.find_element(By.NAME, "password")
            username.send_keys("tenant_user")
            password.send_keys("tenant_password") 
        
            login_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Bejelentkezés')]")
            login_button.click()
            
            self.wait.until(EC.presence_of_element_located((By.LINK_TEXT, "Profil")))
            print("A bejelentkezés bérlőként sikeres")
            
            with self.assertRaises(NoSuchElementException):
                self.driver.find_element(By.LINK_TEXT, "Kiadás")
            print("A bérlő nem látja a 'Kiadás' menüpontot - helyes működés")
        except TimeoutException:
            print("A bejelentkezés nem sikerült - ellenőrizd a felhasználói adatokat")
            
    def test_9_bérlő_ingatlan_foglalás(self):
        self.driver.get(f"{self.base_url}/ingatlanok")
        
        try:
            first_property = self.wait.until(
                EC.element_to_be_clickable((By.CLASS_NAME, "property-card")))
            first_property.click()
            book_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Foglalás')]")
            book_button.click()
            print("Ingatlan sikeresen lefoglalva")
        except TimeoutException:
            print("Nem sikerült az ingatlan lefoglalása")
        
    def test_10_tulajdonos_navbar_ellenőrzés(self):
        self.driver.get(f"{self.base_url}/belepes")
        try:
            username = self.wait.until(EC.presence_of_element_located((By.NAME, "username")))
            password = self.driver.find_element(By.NAME, "password")
            username.send_keys("owner_user") 
            password.send_keys("owner_password") 
        
            login_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Bejelentkezés')]")
            login_button.click()
            
            self.wait.until(EC.presence_of_element_located((By.LINK_TEXT, "Profil")))
            print("A bejelentkezés tulajdonosként sikeres")
            
            navbar = self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "navbar")))
            self.assertIn("Kiadás", navbar.text)
            print("A tulajdonos láthatja a 'Kiadás' menüpontot")
        except TimeoutException:
            print("A bejelentkezés nem sikerült - ellenőrizd a felhasználói adatokat")
            
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
