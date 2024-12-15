from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

options = Options()
options.binary_location = 'C:/Program Files/Opera/launcher.exe' 

driver_path = 'C:/path/to/chromedriver.exe'

service = Service(driver_path)

driver = webdriver.Chrome(service=service, options=options)

driver.get("file:///D:/Suli/Kandó%2014.%20évf/Vizsgaremek/Vizsgaremek-frontend/frontend/regisztracio.html")

search_box = driver.find_element(By.NAME, "q")
search_box.send_keys("Selenium OperaDriver")
search_box.send_keys(Keys.RETURN)

time.sleep(5)

driver.quit()