import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException, NoSuchElementException, ElementNotInteractableException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import datetime

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 15)
short_wait = WebDriverWait(driver, 5)

try:
    print("Bejelentkezés tulajdonos/adminisztrátorként...")
    driver.get("http://localhost:3000/belepes")
    wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Felhasználónév']"))).send_keys("vargaa")
    driver.find_element(By.XPATH, "//input[@placeholder='Jelszó']").send_keys("Aa1234567")
    driver.find_element(By.XPATH, "//button[text()='Bejelentkezés']").click()
    wait.until(EC.url_changes("http://localhost:3000/belepes"))
    print("✅ Tulajdonos/Admin bejelentkezés sikeres.")

    property_id = "41"
    print(f"\nNavigálás a ingatlankezelési oldalra: ID {property_id}")
    driver.get(f"http://localhost:3000/ingatlankezeles/{property_id}")
    wait.until(EC.url_contains(f"ingatlankezeles/{property_id}"))

    print("\n=== IngatlanKezelés Komponens Tesztek ===")

    if f"ingatlankezeles/{property_id}" in driver.current_url:
        print("✅ Az ingatlankezelési oldal sikeresen betöltődött.")
    else:
        print("❌ A ingatlankezelési oldal betöltése nem sikerült.")
        raise Exception("A ingatlankezelés oldal betöltése nem sikerült.")

    try:
        form = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "form.uploadForm")))
        print("✅ A tulajdon adatlapja megjelenik.")
    except TimeoutException:
        print("❌ A tulajdon adatlapja nem található.")
        raise Exception("A űrlap nem található az ingatlankezelés oldalon.")

    try:
        address_field = driver.find_element(By.CSS_SELECTOR, "input[name='cim']")
        address_field.clear()
        address_field.send_keys("123 Test Street Updated")

        price_field = driver.find_element(By.CSS_SELECTOR, "input[name='ar']")
        price_field.clear()
        price_field.send_keys("160000") 

        rooms_field = driver.find_element(By.CSS_SELECTOR, "input[name='szoba']")
        rooms_field.clear()
        rooms_field.send_keys("4")

        size_field = driver.find_element(By.CSS_SELECTOR, "input[name='meret']")
        size_field.clear()
        size_field.send_keys("130") 

        location_select = Select(driver.find_element(By.CSS_SELECTOR, "select[name='helyszin']"))
        location_select.select_by_index(2)

        description_field = driver.find_element(By.CSS_SELECTOR, "textarea[name='leiras']")
        description_field.clear()
        description_field.send_keys("This is an updated test description for property management.")

        print("✅ A tulajdon adatainak szerkesztési mezői megfelelően működnek.")
    except Exception as e:
        print(f"❌ Hiba a tulajdon adatainak szerkesztésekor: {str(e)}")
    except Exception as e:
        print(f"❌ Hiba a szolgáltatások jelölőnégyzetek tesztelésekor: {e}")

    try:
        file_input = driver.find_element(By.CSS_SELECTOR, "input.imgUploadInput")
        if file_input:
            print("✅ Kép feltöltési bemenet megtalálva (kézi ellenőrzés szükséges a tényleges feltöltéshez).")
    except NoSuchElementException:
        print("❌ A kép feltöltési bemenet nem található.")

    try:
        bookings_section = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.uploadForm#foglalaskezeles")))
        if bookings_section.is_displayed():
            print("✅ A foglaláskezelési szekció megjelenik.")

            try:
                WebDriverWait(driver, 3).until(
                    EC.presence_of_element_located((
                        By.XPATH, "//div[contains(@class, 'bookingItem')] | //div[contains(@class, 'errorMessage') and contains(text(), 'foglalás')]" # Check selector and text
                    ))
                )
                try:
                     no_bookings_msg = driver.find_element(By.XPATH, "//div[contains(@class, 'errorMessage') and contains(text(), 'foglalás')]")
                     print("✅ 'Nincsenek foglalások' üzenet helyesen megjelenik.")
                except NoSuchElementException:
                     print("✅ Valószínűleg a foglalások listája jelenik meg (vagy az oldalletöltés)..")
                     try:
                         pagination = driver.find_element(By.CSS_SELECTOR, "div.pagination")
                         if pagination.is_displayed():
                             print("✅ A foglalás oldalletöltési vezérlők megjelennek.")
                     except NoSuchElementException:
                         print("ℹ️ A foglalás oldalletöltési vezérlők nem találhatók (lehet, hogy csak egy oldalnyi foglalás van).")

            except TimeoutException:
                 print("⚠ Nem sikerült ellenőrizni a foglalási lista tartalmát (a 'Nincsenek foglalások' üzenet vagy az elemek nem találhatók).")

        else: 
            print("❌ A foglaláskezelési szekció nem jelent meg a várakozás után.")
    except TimeoutException:
        print("❌ A foglaláskezelési szekció nem található.")
    except Exception as e:
         print(f"❌ Hiba a foglaláskezelési szekció tesztelésekor: {e}")

    try:
        delete_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.deleteBtn")))
        delete_button.click()
        time.sleep(1)

        alert = wait.until(EC.alert_is_present()) 
        alert.dismiss()
        print("✅ Az ingatlan törlés gomb működik (teszt elutasította a megerősítést).")
    except TimeoutException:
        print("❌ A ingatlan törlés gomb nem található vagy az értesítés nem jelent meg.")
    except Exception as e:
         print(f"❌Hiba az ingatlan törlésének tesztelésekor: {e}")

    print("\n=== IngatlanKezelés tesztek befejezve ===")

    print("\nNavigálás az Ingatlanok oldalra...")
    driver.get("http://localhost:3000/ingatlanok")
    wait.until(EC.url_contains("ingatlanok"))

    print("\n=== Ingatlanok Komponens Tesztek ===")

    if "ingatlanok" in driver.current_url:
        print("✅ Az Ingatlanok oldal sikeresen betöltődött.")
    else:
        print("❌ Az Ingatlanok oldal betöltése nem sikerült.")
        raise Exception("Nem sikerült betölteni az Ingatlanok oldalt") 

    property_cards = [] 
    try:
        property_cards = wait.until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".cardContainer .propertyCard"))
        )
        print(f"✅ {len(property_cards)} ingatlan kártya található.")
        properties_found = True
    except TimeoutException:
        print("⚠ Nem található ingatlan kártya (vagy időtúllépés miatt nem sikerült várakozni).")
        properties_found = False

    try:
        county_select = Select(wait.until(EC.presence_of_element_located((By.ID, "megye"))))
        county_select.select_by_index(5) 
        time.sleep(2)  

        if county_select.first_selected_option.text != "Összes":
            print("✅ A megyeszűrő kiválasztás működik.")
        else:
            print("❌ A megyeszűrő nem választotta ki az opciót.")
    except TimeoutException:
        print("❌ Nem található a megyeszűrő.")
    except Exception as e:
         print(f"❌ Hiba a megyeszűrő tesztelésekor: {e}")

    try:
        city_select = Select(wait.until(EC.presence_of_element_located((By.ID, "helyszin"))))
        try:
             city_select.select_by_index(1) 
             time.sleep(2)
             if city_select.first_selected_option.text != "Összes":
                 print("✅ A város szűrő kiválasztás működik.")
             else:
                  print("❌ A város szűrő nem választotta ki az opciót (vagy csak az 'Összes' elérhető).")
        except IndexError:
             print("ℹ️ Nincsenek elérhető városok a szűrőben a ('Összes' kizárásával).")

    except TimeoutException:
        print("❌ Nem található a város szűrő.")
    except Exception as e:
         print(f"❌ Hiba a város szűrő tesztelésekor: {e}")

    try:
        room_select = Select(wait.until(EC.presence_of_element_located((By.ID, "szoba"))))
        room_select.select_by_visible_text("2") 
        time.sleep(2)

        if room_select.first_selected_option.text == "2":
            print("✅ A szoba szűrő kiválasztás működik.")
        else:
            print("❌ A szoba szűrő nem választotta a '2'-t.")
    except TimeoutException:
        print("❌ Nem található a szoba szűrő.")
    except NoSuchElementException:
         print("ℹ️ A '2' számú szoba szűrő lehetőség nem elérhető.")
    except Exception as e:
         print(f"❌ Hiba a szoba szűrő tesztelésekor: {e}")

    try:
        sort_select = Select(wait.until(EC.presence_of_element_located((By.ID, "rendezes"))))
        sort_select.select_by_visible_text("Ár szerint növekvő")
        time.sleep(2)

        if sort_select.first_selected_option.text == "Ár szerint növekvő":
            print("✅ A rendezés kiválasztás működik.")
        else:
            print("❌ A rendezés nem választotta az 'Ár szerint növekvő' opciót.")
    except TimeoutException:
        print("❌ Nem található a rendezési szűrő.")
    except NoSuchElementException: 
         print("ℹ️ Az 'Ár szerint növekvő' rendezési lehetőség nem elérhető.")
    except Exception as e:
         print(f"❌ Hiba a rendezési szűrő tesztelésekor: {e}")

    try:
        show_more = wait.until(EC.element_to_be_clickable((By.ID, "showMoreFilter")))
        show_more.click()
        time.sleep(0.5)

        wifi_checkbox = wait.until(EC.element_to_be_clickable((By.ID, "wifiCb"))) 
        initial_state = wifi_checkbox.is_selected()
        wifi_checkbox.click()
        time.sleep(1) 

        if wifi_checkbox.is_selected() != initial_state:
            print("✅ Az extra szűrők váltás működik (Wi-Fi).")
        else:
            print("❌ Az extra szűrők nem váltották meg az állapotot.")

    except TimeoutException:
        print("❌ Nem található vagy nem lehet interakcióba lépni a 'Több megjelenítése' vagy Wi-Fi jelölőnégyzettel.")
    except ElementNotInteractableException:
         print("❌ A Wi-Fi jelölőnégyzet megtalálható, de nem volt interaktív.")
    except Exception as e:
         print(f"❌ Hiba az extra szűrők tesztelésekor: {e}")

    try:
        window_size = driver.get_window_size()
        if window_size["width"] >= 1300:
            list_view_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".viewBtn:not(.disabled)"))) 
            list_view_btn.click()
            try:
                 wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".propertyListItem")))
                 print("✅ A lista nézet váltás működik (tételek megtalálva).")
            except TimeoutException:
                 print("❌ A lista nézet gombra kattintottunk, de nem találtunk listaelemeket.")

            try:
                 grid_view_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".viewBtn:first-child"))) 
                 grid_view_btn.click()
                 time.sleep(1) 
            except TimeoutException:
                 print("⚠️ Nem található vagy nem lehet rákattintani a rács nézet gombra a visszaváltáshoz.")

        else:
            print("ℹ️ A lista nézet tesztelése kihagyva mobil-szerű nézetben.")
    except TimeoutException:
        print("❌ Nem található a lista nézet gomb.")
    except Exception as e:
         print(f"❌ Hiba a nézet váltás tesztelésekor: {e}")

    try:
        pagination_span = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".pagination span"))) 
        page_info = pagination_span.text
        current_page_str, total_pages_str = page_info.split(" / ")
        total_pages = int(total_pages_str)

        if total_pages > 1:
            next_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Következő')]"))) 
            if next_btn.is_enabled(): 
                next_btn.click()
                wait.until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, ".pagination span"), "2 /"))
                print("✅ Következő oldal gomb működik.")

                prev_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Előző')]")))
                prev_btn.click()
                wait.until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, ".pagination span"), "1 /"))
                print("✅ Előző oldal gomb működik.")
            else:
                print("ℹ️ Következő gomb megtalálva, de le van tiltva - a lapozás nem tesztelhető teljes mértékben.")
        else:
            print("ℹ️ Csak egy oldal érhető el - a lapozás nem tesztelhető.")
    except TimeoutException:
        print("❌ Lapozási elemek nem találhatóak vagy a lap szám nem frissült.")
    except Exception as e:
         print(f"❌ Hiba a lapozás tesztelésekor: {e}")

    if properties_found:
        try:
            first_property = property_cards[0]
            target_url = first_property.find_element(By.TAG_NAME, 'a').get_attribute('href') 
            property_title_element = first_property.find_element(By.CSS_SELECTOR, ".propertyTitle") 

            driver.execute_script("arguments[0].scrollIntoView(true);", property_title_element)
            time.sleep(0.5)

            wait.until(EC.element_to_be_clickable(property_title_element)).click() 

            wait.until(EC.url_contains("ingatlanok/")) 
            if target_url in driver.current_url:
                 print(f"✅ Az ingatlan kártya kattintás működik (átirányított a részletes oldalra).")
            else:
                  print(f"❌ Az ingatlan kártya kattintás helytelen URL-re irányított: {driver.current_url}, várt URL: {target_url}")

            driver.back()
            wait.until(EC.url_contains("ingatlanok"))
        except TimeoutException:
            print("❌ Időtúllépés történt az ingatlan kártya kattintása vagy navigálás várakozása közben.")
        except IndexError:
             print("❌ Nem lehet tesztelni a kártya interakciót: Az ingatlan lista üres volt.")
        except Exception as e:
            print(f"❌ Hiba az ingatlan kártya interakció tesztelésekor: {e}")
    else:
        print("ℹ️ Az ingatlan kártya interakciós teszt kihagyása, mivel nem található ingatlan.")


    print("\n=== Ingatlanok teszt sikeres ===") 

    print("\nNavigálás az Ingatlan Feltöltés oldalra...")
    driver.get("http://localhost:3000/kiadas")
    wait.until(EC.url_contains("kiadas"))

    print("\n=== Kiadas tesztek ===")

    if "kiadas" in driver.current_url:
        print("✅ Ingatlan feltöltés oldal sikeresen betöltődött.")
    else:
        print("❌ Sikertelenül töltődött be az ingatlan feltöltés oldal.")
        raise Exception("Nem sikerült betölteni a Kiadas oldalt")

    try:
        wait.until(EC.presence_of_element_located((By.NAME, "cim"))).send_keys("Arad, Bányász utca 10")
        driver.find_element(By.NAME, "ar").send_keys("250000")
        driver.find_element(By.NAME, "szoba").send_keys("5")
        driver.find_element(By.NAME, "meret").send_keys("200")
        Select(driver.find_element(By.NAME, "helyszin")).select_by_index(3) 
        driver.find_element(By.NAME, "leiras").send_keys("Ez egy új ingatlan leírás a feltöltési teszthez.")

        print("✅ A űrlap mezők megfelelően fogadják az adatokat.")
    except TimeoutException:
         print("❌ Időtúllépés történt, miközben vártunk az űrlap mezőkre a Kiadas oldalon.")
    except Exception as e:
        print(f"❌ Hiba az űrlap mezők tesztelésekor: {str(e)}")

    try:
        wifi_checkbox = wait.until(EC.element_to_be_clickable((By.ID, "wifiCb")))
        parking_checkbox = wait.until(EC.element_to_be_clickable((By.ID, "parkolásCb"))) 

        initial_wifi = wifi_checkbox.is_selected()
        initial_parking = parking_checkbox.is_selected()

        wifi_checkbox.click()
        parking_checkbox.click()
        time.sleep(0.5)

        if wifi_checkbox.is_selected() != initial_wifi and parking_checkbox.is_selected() != initial_parking:
            print("✅ A szolgáltatás jelölőnégyzetek helyesen váltanak állapotot.")
        else:
            print("❌ A szolgáltatás jelölőnégyzetek nem váltották meg megfelelően az állapotot.")
    except TimeoutException:
        print("❌ Nem találhatóak vagy nem lehet interakcióba lépni a szolgáltatás jelölőnégyzetekkel (Wi-Fi/ Parkolás).")
    except Exception as e:
         print(f"❌ Hiba a szolgáltatás jelölőnégyzetek tesztelésekor: {e}")

    try:
        test_image_path = os.path.abspath("haz.jpg")
        if not os.path.exists(test_image_path):
            print(f"⚠️ Tesztkép nem található a {test_image_path} elérési úton. A kép feltöltés tesztet kihagyjuk.")
        else:
            file_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input.imgUploadInput")))
            file_input.send_keys(test_image_path)

            preview_img = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "img.imgPreview"))) 
            print("✅ A kép feltöltés és előnézet működik.")
    except TimeoutException:
        print("❌ A kép feltöltés bemeneti mezője nem található vagy az előnézet nem jelent meg.")
    except Exception as e:
        print(f"❌ Nem sikerült tesztelni a kép feltöltését: {str(e)}")

    try:
        submit_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.starBtn"))) 
        submit_button.click()

        try:
            wait.until(EC.url_contains("sikeresFeltoltes")) 
            print("✅ A űrlap sikeres beküldése (átirányítva a sikeroldalra).")
        except TimeoutException:
             try:
                 response_message = short_wait.until(EC.visibility_of_element_located((
                     By.XPATH, "//div[contains(@class, 'responseMessage') or contains(@class, 'errorMessage')]"
                 )))
                 if "sikeres" in response_message.text.lower(): 
                      print(f"✅ Az űrlap sikeres beküldése (üzenet: {response_message.text}).")
                 else: 
                       print(f"❌ Az űrlap beküldése nem sikerült (üzenet: {response_message.text}).")
             except TimeoutException:
                  print("❌ Az űrlap beküldése elindult, de nem található átirányítás vagy válaszüzenet.")

    except TimeoutException:
        print("❌ A küldés gomb nem található vagy nem kattintható.")
    except Exception as e:
         print(f"❌ Hiba az űrlap beküldésének tesztelésekor: {e}")

    try:
        print("\nÜres űrlap validáció tesztelése...")
        driver.get("http://localhost:3000/kiadas")
        wait.until(EC.url_contains("kiadas"))

        submit_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.starBtn")))
        submit_button.click()
        time.sleep(1) 

        if "kiadas" in driver.current_url:
             print("✅ Az űrlap validáció valószínűleg megakadályozza az üres beküldéseket (oldalon maradt).")
        else:
            print("❌ Az űrlap validáció nem működött (URL változott az üres beküldés után).")
    except TimeoutException:
        print("❌ Nem található a küldés gomb a validációs teszthez.")
    except Exception as e:
        print(f"❌ Nem sikerült tesztelni az űrlap validációját: {e}")

    print("\n=== Kiadas tesztek vége ===")

    print("\nNavigálás az Elfelejtett Jelszó oldalra...")
    driver.get("http://localhost:3000/elfelejtettjelszo")
    wait.until(EC.url_contains("elfelejtettjelszo")) 

    print("\n=== ElfelejtettJelszo Komponens Tesztek ===")

    if "elfelejtettjelszo" in driver.current_url:
        print("✅ Az Elfelejtett jelszó oldal sikeresen betöltődött.")
    else:
        print("❌ Nem sikerült betölteni az Elfelejtett jelszó oldalt.")
        raise Exception("Nem sikerült betölteni az ElfelejtettJelszo oldalt")

    try:
        email_field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Email cím']")))
        test_email = "test@example.com"
        email_field.send_keys(test_email)

        if email_field.get_attribute("value") == test_email:
            print("✅ Az email mező helyesen működik.")
        else:
            print("❌ Az email mező nem tartotta meg az értéket.")
    except TimeoutException:
        print("❌ Nem található az email mező.")
    except Exception as e:
         print(f"❌ Hiba az email mező tesztelésekor: {e}")

    try:
        submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Jelszó visszaállítása')]")))
        submit_button.click()

        try:
            WebDriverWait(driver, 8).until(EC.url_contains("belepes")) 
            print("✅ Az űrlap sikeres beküldése (átirányítva a bejelentkezési oldalra).")
        except TimeoutException:
            try:
                 message_element = short_wait.until(EC.visibility_of_element_located((
                     By.XPATH, "//p[contains(@class, 'responseMessage')]"
                 )))
                 print(f"✅ Az űrlap beküldése válaszüzenetet mutat: {message_element.text}.")

            except TimeoutException:
                  print("❌ Az űrlap el lett küldve, de nem található átirányítás vagy válaszüzenet az időtúllépésig.")

    except TimeoutException:
        print("❌ A küldés gomb nem található vagy nem kattintható.")
    except Exception as e:
        print(f"❌ Nem sikerült tesztelni az űrlap beküldését: {str(e)}")

    try:
        print("\nÜres Elfelejtett jelszó űrlap tesztelése...")
        driver.get("http://localhost:3000/elfelejtettjelszo")
        wait.until(EC.url_contains("elfelejtettjelszo"))

        submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Jelszó visszaállítása')]")))
        submit_button.click()
        time.sleep(1)

        if "elfelejtettjelszo" in driver.current_url:
            try:
                error_msg = short_wait.until(EC.visibility_of_element_located((
                    By.XPATH, "//p[contains(@class, 'errorMessage')]"
                )))
                print(f"✅ Az űrlap validáció megakadályozza az üres beküldést (hibajelzés: {error_msg.text}).")
            except TimeoutException:
                 print("✅ Az űrlap validáció megakadályozza az üres beküldést (oldalon maradtunk, de nem találtunk specifikus hibajelzést).")
        else:
            print("❌ Az űrlap validáció nem működött (URL változott az üres beküldés után).")
    except TimeoutException:
        print("❌ Nem található a küldés gomb a validációs teszthez.")
    except Exception as e:
        print(f"❌ Nem sikerült tesztelni az űrlap validációját: {e}")

    try:
        print("\nÉrvénytelen email formátum tesztelése...")
        email_field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Email cím']")))
        email_field.clear()
        email_field.send_keys("invalid-email")
        submit_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Jelszó visszaállítása')]")
        submit_button.click()
        time.sleep(1)

        if "elfelejtettjelszo" in driver.current_url:
            try:
                error_msg = short_wait.until(EC.visibility_of_element_located((
                    By.XPATH, "//p[contains(@class, 'errorMessage')]" 
                )))
                print(f"✅ Az érvénytelen email formátum elutasítva (hibajelzés: {error_msg.text}).")
            except TimeoutException:
                 print("✅ Az érvénytelen email formátum elutasítva (oldalon maradtunk, de nem találtunk specifikus hibajelzést).")
        else:
            print("❌ Az érvénytelen email formátum elfogadva (URL változott).")
    except TimeoutException:
        print("❌ Nem található az email mező vagy a küldés gomb az érvénytelen email teszthez.")
    except Exception as e:
        print(f"❌ Nem sikerült tesztelni az érvénytelen email validációját: {e}")

    print("\n=== ElfelejtettJelszo tesztek befejezve ===")

    print("\nNavigálás a Főoldalra...")
    driver.get("http://localhost:3000/")
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "citySection"))) 

    print("\n=== Főoldal Komponens Tesztek ===")

    if driver.current_url == "http://localhost:3000/":
        print("✅ A főoldal sikeresen betöltődött.")
    else:
        print(f"❌ Nem sikerült helyesen betölteni a főoldalt. Aktuális URL: {driver.current_url}")
        raise Exception("Nem sikerült betölteni a Főoldal oldalt")

    try:
        navbar = wait.until(EC.presence_of_element_located((By.TAG_NAME, "nav")))
        if navbar.is_displayed():
            print("✅ A navigációs sáv megjelenik.")
        else:
            print("❌ A navigációs sáv megtalálható, de nem látható.")
    except TimeoutException:
        print("❌ A navigációs sáv nem található.")

    city_cards = [] 
    try:
        cities_section = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "citySection"))) 
        if cities_section.is_displayed():
            print("✅ A népszerű városok szakasz megjelenik.")

            city_cards = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "cityCard"))) 
            print(f"✅ {len(city_cards)} város kártya található.")

            if city_cards:
                first_city_card = city_cards[0]
                first_city_link_element = first_city_card.find_element(By.TAG_NAME, "a")
                city_name_element = first_city_card.find_element(By.CLASS_NAME, "cityCardTitle") 
                city_name = city_name_element.text
                target_url = first_city_link_element.get_attribute("href")

                print(f"Város kártya kattintásának tesztelése: {city_name} ({target_url})")

                try:
                    driver.execute_script("arguments[0].scrollIntoView(true);", first_city_link_element)
                    time.sleep(0.5)
                    link_to_click = wait.until(EC.element_to_be_clickable(first_city_link_element))
                    link_to_click.click()
                except ElementNotInteractableException:
                     print("⚠️ Az elem nem interaktív, próbálkozunk JavaScript kattintással...")
                     driver.execute_script("arguments[0].click();", first_city_link_element)

                wait.until(EC.url_contains("ingatlanok")) 
                if target_url in driver.current_url or f"city={city_name}" in driver.current_url: 
                    print(f"✅ A város kártya navigáció működik ({city_name}).")
                else:
                     print(f"❌ A város kártya navigáció nem működik. Várt város szűrő, kapott: {driver.current_url}")

                driver.back()
                wait.until(EC.presence_of_element_located((By.CLASS_NAME, "citySection"))) 
            else:
                 print("ℹ️  A város kártya interakció tesztelése kihagyva, mivel nem találtunk város kártyákat.")

        else: 
            print("❌ A népszerű városok szakasz nem látható.")
    except TimeoutException:
        print("❌ Időtúllépés történt a népszerű városok szakasz vagy város kártyák megvárásakor.")
    except Exception as e:
        print(f"❌ Nem sikerült tesztelni a népszerű városok szakaszát: {str(e)}")

    featured_property_cards = [] 
    try:
        featured_section = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "kiemeltSection")))
        if featured_section.is_displayed():
            print("✅ A kiemelt ingatlanok szakasz megjelenik.")

            try:
                featured_property_cards = WebDriverWait(driver, 5).until( 
                    EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".kiemeltSection .propertyCard")) 
                )
                print(f"✅ {len(featured_property_cards)} kiemelt ingatlan kártya található.")
                featured_properties_found = True
            except TimeoutException:
                print("ℹ️ Nincsenek kiemelt ingatlan kártyák a szakaszban.")
                featured_properties_found = False

            if featured_properties_found:
                first_featured_property = featured_property_cards[0]
                link_element = first_featured_property.find_element(By.TAG_NAME, 'a') 
                target_url = link_element.get_attribute('href')

                print(f"Kiemelt ingatlan kártya kattintásának tesztelése: {target_url}")
                driver.execute_script("arguments[0].scrollIntoView(true);", link_element)
                time.sleep(0.5)
                wait.until(EC.element_to_be_clickable(link_element)).click()

                wait.until(EC.url_contains("ingatlanok/")) 
                if target_url in driver.current_url:
                    print("✅ A kiemelt ingatlan kártya navigáció működik.")
                else:
                    print(f"❌ A kiemelt ingatlan kártya navigáció nem működik. Várt URL: {target_url}, kapott: {driver.current_url}")

                driver.back()
                wait.until(EC.presence_of_element_located((By.CLASS_NAME, "kiemeltSection"))) 
            else:
                 print("ℹ️ A kiemelt kártya interakció tesztelése kihagyva, mivel nem találtunk kártyákat.")

            try:
                more_btn = featured_section.find_element(By.XPATH, ".//button[contains(@class, 'moreBtn')]") 
                print("A 'További ingatlanok' gomb tesztelése...")
                driver.execute_script("arguments[0].scrollIntoView(true);", more_btn)
                time.sleep(0.5)
                wait.until(EC.element_to_be_clickable(more_btn)).click()

                wait.until(EC.url_contains("ingatlanok"))
                print("✅ A 'További ingatlanok' gomb működik.")

                driver.back()
                wait.until(EC.presence_of_element_located((By.CLASS_NAME, "kiemeltSection"))) 
            except NoSuchElementException:
                print("ℹ️ A 'További ingatlanok' gomb nem található a kiemelt szakaszban.")
            except TimeoutException:
                 print("❌ Időtúllépés történt a 'További ingatlanok' gomb kattintása vagy navigációja közben.")
            except Exception as e_btn:
                 print(f"❌ Hiba történt a 'További ingatlanok' gomb tesztelése közben: {str(e_btn)}")

        else: 
            print("❌ A kiemelt ingatlanok szakasz nem látható.")

    except TimeoutException:
         print("❌ Időtúllépés történt a kiemelt ingatlanok szakasz megvárása közben.")
    except Exception as e:
        print(f"❌ Nem sikerült tesztelni a kiemelt ingatlanok szakaszát: {str(e)}")

    try:
        footer = wait.until(EC.presence_of_element_located((By.TAG_NAME, "footer")))
        if footer.is_displayed():
            print("✅ A lábléc megjelenik.")
        else:
            print("❌ A lábléc megtalálható, de nem látható.")
    except TimeoutException:
        print("❌ A lábléc nem található.")

    print("\n=== A főoldali tesztek befejeződtek ===")
    print("\nNavigálás a Regisztrációs oldalra...")
    driver.get("http://localhost:3000/regisztracio")
    wait.until(EC.url_contains("regisztracio"))

    print("\n=== Regisztrációs komponens tesztek ===")

    if "regisztracio" in driver.current_url:
        print("✅ A regisztrációs oldal sikeresen betöltődött.")
    else:
        print("❌ A regisztrációs oldal betöltése nem sikerült.")
        raise Exception("Nem sikerült betölteni a Regisztráció oldalát")

    test_username = "" 
    test_email = "" 
    try:
        name_field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Név']")))
        test_name = "Test User Reg"
        name_field.send_keys(test_name)

        username_field = driver.find_element(By.XPATH, "//input[@placeholder='Felhasználónév']")
        test_username = "testuser" + str(int(time.time()))
        username_field.send_keys(test_username)

        email_field = driver.find_element(By.XPATH, "//input[@placeholder='Email']")
        test_email = f"test{int(time.time())}@example.com"
        email_field.send_keys(test_email)

        password_field = driver.find_element(By.XPATH, "//input[@placeholder='Jelszó']")
        test_password = "TestValidPass123"
        password_field.send_keys(test_password)

        if (name_field.get_attribute("value") == test_name and
            username_field.get_attribute("value") == test_username and
            email_field.get_attribute("value") == test_email and
            password_field.get_attribute("value") == test_password):
            print("✅ A űrlapmezők helyesen fogadják az adatokat.")
        else:
            print("❌ Az űrlapmezők nem tartották meg helyesen az értékeket.")
    except TimeoutException:
        print("❌ Időtúllépés történt a regisztrációs űrlapmezők megvárása közben.")
    except Exception as e:
        print(f"❌ Hiba történt az űrlapmezők tesztelésekor: {str(e)}")
    except Exception as e:
        print(f"❌ Nem sikerült tesztelni a jogosultságok váltását: {str(e)}")

    try:
        print("\nA gyenge jelszó érvényesítésének tesztelése...")
        password_field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Jelszó']")))
        password_field.clear()
        password_field.send_keys("weak")

        submit_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Regisztráció')]")
        submit_button.click()

        message = wait.until(EC.visibility_of_element_located((
            By.XPATH, "//p[contains(@class, 'response-message') or contains(@class, 'errorMessage')]" 
        )))

        if "jelszó" in message.text.lower(): 
            print(f"✅ A jelszó érvényesítése helyesen működik (üzenet: {message.text}).")
        else:
            print(f"❌ A jelszó érvényesítési üzenet helytelen vagy nem jelent meg (üzenet: {message.text}).")
    except TimeoutException:
         print("❌ A jelszó érvényesítési üzenet nem jelent meg.")
    except Exception as e:
        print(f"❌ Nem sikerült tesztelni a jelszó érvényesítését: {str(e)}")

    try:
        print("\\nA sikeres regisztráció benyújtásának tesztelése...")
        driver.get("http://localhost:3000/regisztracio")
        wait.until(EC.url_contains("regisztracio"))

        wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Név']"))).send_keys("Test User Valid Reg")
        current_time_suffix = str(int(time.time()))
        valid_username = "testuser" + current_time_suffix
        valid_email = f"test{current_time_suffix}@example.com"
        driver.find_element(By.XPATH, "//input[@placeholder='Felhasználónév']").send_keys(valid_username)
        driver.find_element(By.XPATH, "//input[@placeholder='Email']").send_keys(valid_email)
        driver.find_element(By.XPATH, "//input[@placeholder='Jelszó']").send_keys("ValidPassReg123")

        submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Regisztráció')]")))
        submit_button.click()

        try:
             wait.until(EC.url_contains("belepes"))
             print("✅ A regisztráció sikeresen megtörtént (átirányítva a bejelentkezési oldalra).")
        except TimeoutException:
              try:
                   success_message = short_wait.until(EC.visibility_of_element_located((
                       By.XPATH, "//p[contains(@class, 'response-message') and contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'sikeres')]" # Check for success message class and text (case-insensitive)
                   )))
                   print(f"✅ A regisztráció sikeresen megtörtént (sikeres üzenet megjelenése: {success_message.text}).")
              except TimeoutException:
                    try:
                        error_message = short_wait.until(EC.visibility_of_element_located((
                             By.XPATH, "//p[contains(@class, 'response-message') or contains(@class, 'errorMessage')]"
                        )))
                        print(f"❌ A regisztráció nem sikerült (hibaüzenet: {error_message.text}). Aktuális URL: {driver.current_url}")
                    except TimeoutException:
                         print(f"❌A regisztráció nem sikerült. Nincs átirányítás a bejelentkezési oldalra, és nem találtunk sikeres/hibaüzenetet. Aktuális URL: {driver.current_url}")


    except TimeoutException:
         print("❌ Időtúllépés történt a regisztrációs mezők vagy a küldés gomb megtalálásakor.")
    except Exception as e:
        print(f"❌ Nem sikerült tesztelni a regisztrációs űrlap benyújtását: {str(e)}")

    try:
        print("\\nTeszteljük a kötelező mezők validálását...")
        driver.get("http://localhost:3000/regisztracio")
        wait.until(EC.url_contains("regisztracio"))

        submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Regisztráció')]")))
        submit_button.click()
        time.sleep(1)
        if "regisztracio" in driver.current_url:
             print("✅ A kötelező mezők validálása működik (maradtunk a regisztrációs oldalon).")
        else:
            print("❌ A kötelező mezők validálása nem működött (URL változott üres benyújtás után).")
    except TimeoutException:
         print("❌ Nem sikerült megtalálni a regisztráció gombot a kötelező mezők teszteléséhez.")
    except Exception as e:
        print(f"❌ Nem sikerült tesztelni a kötelező mezők validálását: {str(e)}")

    print("\n=== Regisztráció tesztek befejezve ===")

    print("\nBérlőként történő bejelentkezés a foglalási tesztekhez...")
    driver.get("http://localhost:3000/belepes")
    tenant_logged_in = False 
    try:
        tenant_username = "Berlo"
        tenant_password = "Berlo12345" 

        wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Felhasználónév']"))).send_keys(tenant_username)
        driver.find_element(By.XPATH, "//input[@placeholder='Jelszó']").send_keys(tenant_password)
        driver.find_element(By.XPATH, "//button[text()='Bejelentkezés']").click()
        wait.until(EC.url_changes("http://localhost:3000/belepes"))

        if "belepes" not in driver.current_url:
             print("✅ A bérlő sikeresen bejelentkezett.")
             tenant_logged_in = True
        else: 
              try:
                   login_error = short_wait.until(EC.visibility_of_element_located((By.XPATH, "//p[contains(@class, 'errorMessage')]")))
                   print(f"❌ A bérlő bejelentkezése nem sikerült (Hiba: {login_error.text}). A foglalási tesztek kihagyva.")
              except TimeoutException:
                   print("❌ A bérlő bejelentkezése nem sikerült (maradtunk a bejelentkezési oldalon, hibaüzenet nem található). A foglalási tesztek kihagyva.")

    except TimeoutException:
         print("❌ A bejelentkezési elemekre vagy a bérlő bejelentkezés utáni átirányításra várakozva lejárt az idő.")
    except Exception as e:
         print(f"❌ Hiba történt a bérlő bejelentkezése során: {str(e)}. A foglalási tesztek kihagyva.")

    property_id = "41"  
    print(f"\nNavigálás az ingatlan részletező oldalára: ID {property_id}")
    driver.get(f"http://localhost:3000/ingatlanok/{property_id}")
    wait.until(EC.url_contains(f"ingatlanok/{property_id}"))

    print("\n=== Részletek Komponens Tesztek ===")

    if f"ingatlanok/{property_id}" in driver.current_url:
        print("✅ Az ingatlan részletező oldal sikeresen betöltődött.")
    else:
        print("❌ Nem sikerült betölteni az ingatlan részletező oldalát.")
        raise Exception(f"Nem sikerült betölteni a Részletek oldalt a következő ID-val: {property_id}")

    try:
        main_image = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".propertyImage"))) 
        print("✅A fő ingatlan kép megjelenik.")

        title = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".propertyTitle"))) 
        location = driver.find_element(By.CSS_SELECTOR, ".propertyLocation") 
        print(f"✅ Az ingatlan adatai megjelennek: {title.text}, {location.text}")

        price = driver.find_element(By.CSS_SELECTOR, ".propertyPrice") 
        if "Ft" in price.text:
            print("✅ Az ingatlan ára helyesen jelenik meg.")
        else:
             print(f"❌ Az ingatlan árának formátuma hibásnak tűnik: {price.text}")

        description = driver.find_element(By.CSS_SELECTOR, ".propertyDescription") 
        if len(description.text) > 10: 
            print("✅ Az ingatlan leírása megjelenik.")
        else:
            print("❌ Az ingatlan leírása hiányzik vagy túl rövid.")
    except TimeoutException:
         print("❌ Időtúllépés történt az ingatlaninformációs szekciók (kép, cím stb.) betöltésére várva.")
    except Exception as e:
        print(f"❌ Hiba történt az ingatlaninformációs szekciók tesztelésekor.: {str(e)}")

    try:
        details_section = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".otherDetails"))) 
        print("✅ Az ingatlan részletei szekció megjelenik.")

        details_text = details_section.text
        check_items = ["m²", "Szobák száma", "Feltöltés dátuma"] 
        missing_items = [item for item in check_items if item not in details_text]
        if not missing_items:
            print("✅ Minden várt ingatlan részletek kulcsszó jelen van.")
        else:
            print(f"❌ Néhány ingatlan részletek kulcsszó hiányzik: {', '.join(missing_items)}")

    except TimeoutException:
        print("❌ Az ingatlan részletei szekció nem található, vagy nem látható.")
    except Exception as e:
         print(f"❌ Hiba történt az ingatlan részletei szekció tesztelésekor: {e}")

    try:
        services_section = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".services")))
        service_items = services_section.find_elements(By.CSS_SELECTOR, ".service") 
        if len(service_items) > 0:
            print(f"✅ Megtalálva {len(service_items)} szolgáltatási elemek.")
        else:
            print("ℹ️ Nincsenek felsorolva szolgáltatások a szolgáltatások szekcióban.")
    except TimeoutException:
        print("❌ A szolgáltatások szekció nem található, vagy nem látható.")
    except Exception as e:
         print(f"❌ Hiba történt a szolgáltatások szekció tesztelésekor: {e}")

    try:
        contact_card = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".propertyContactCard"))) 
        print("✅ A tulajdonos elérhetőségi kártyája megjelenik.")

        owner_name = contact_card.find_element(By.CSS_SELECTOR, ".uploaderName") 
        owner_email = contact_card.find_element(By.CSS_SELECTOR, ".propertyContactValue") #

        if owner_name.is_displayed() and owner_email.is_displayed():
            print(f"✅ A tulajdonos információi megjelennek: {owner_name.text}, {owner_email.text}")
        else:
            print("❌ A tulajdonos neve vagy email címe nem látható az elérhetőségi kártyán.")
    except TimeoutException:
        print("❌ A tulajdonos elérhetőségi kártya nem található, vagy nem látható..")

    if tenant_logged_in:
        print("\nTesting Booking Calendar...")
        try:
            calendar_section = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".calendarSection"))) 
            print("✅ A foglalási naptár szekció megjelenik..")

            calendar = calendar_section.find_element(By.CLASS_NAME, "react-calendar") 
            start_date_input = calendar_section.find_element(By.ID, "startDate") 
            end_date_input = calendar_section.find_element(By.ID, "endDate") 
            book_button = calendar_section.find_element(By.XPATH, ".//button[contains(text(), 'Foglalás')]") 

            start_day_element = None
            end_day_element = None
            selected_start_date_str = None
            selected_end_date_str = None

            clickable_days = calendar.find_elements(By.XPATH, ".//button[not(@disabled) and contains(@class, 'react-calendar__tile') and not(contains(@class, 'react-calendar__month-view__days__day--neighboringMonth'))]")

            print(f"Megtalálva {len(clickable_days)} potenciálisan elérhető nap a jelenlegi naptár nézetben.")

            if len(clickable_days) >= 2:
                try:
                    start_day_element = clickable_days[0]
                    start_day_text = start_day_element.find_element(By.TAG_NAME, "abbr").get_attribute("aria-label")
                    print(f"Kísérlet történik a kezdő dátum kiválasztására: {start_day_text}")
                    start_day_element.click()
                    time.sleep(0.5)

                    end_day_element = clickable_days[1]
                    end_day_text = end_day_element.find_element(By.TAG_NAME, "abbr").get_attribute("aria-label")
                    print(f"Kísérlet történik a végdátum kiválasztására: {end_day_text}")
                    end_day_element.click()
                    time.sleep(0.5)

                    selected_start_date_str = start_date_input.get_attribute("value")
                    selected_end_date_str = end_date_input.get_attribute("value")

                    if selected_start_date_str and selected_end_date_str:
                        print(f"✅ A dátum kiválasztása tükröződik a mezőkben: Kezdő='{selected_start_date_str}', Vég='{selected_end_date_str}'.")

                        print("Kísérlet történik a foglalás gombjának megnyomására...")
                        booking_button_clickable = wait.until(EC.element_to_be_clickable(book_button))
                        booking_button_clickable.click()

                        try:
                            response_message = wait.until(EC.visibility_of_element_located((
                                By.XPATH, "//p[contains(@id, 'bookingResponse') or contains(@class, 'bookingMessage')]" 
                            )))
                            print(f"✅ A foglalási válasz megérkezett.: {response_message.text}")
                        except TimeoutException:
                            print("❌ Nincs foglalási válasz üzenet megjelenítve, vagy időtúllépés történt..")
                        except Exception as booking_resp_e:
                             print(f"❌ Hiba történt a foglalási válasz ellenőrzésekor.: {booking_resp_e}")

                    else:
                         print("❌ A dátum kiválasztása nem frissítette megfelelően a mezőket.")

                except ElementNotInteractableException as e_interact:
                     print(f"❌ Nem sikerült rákattintani a kiválasztott dátumokra: {e_interact}")
                except NoSuchElementException as e_nose:
                     print(f"❌ Nem sikerült megtalálni az elemeket a naptár gombjaiban: {e_nose}")
                except Exception as date_e:
                     print(f"❌ Hiba történt a dátum kiválasztása vagy a foglalás gombjára való kattintás során: {date_e}")

            else: 
                 print("ℹ️ A jelenlegi naptár nézetben nem található elegendő elérhető nap a tartomány kiválasztásához.")


        except TimeoutException:
             print("❌ Időtúllépés történt a naptár szekciójára vagy annak elemeire várva..")
        except Exception as e:
            print(f"❌ Hiba történt a foglalási funkció tesztelésekor: {str(e)}")
    else: 
         print("ℹ️ A foglalási tesztek kihagyása, mivel a bérlő bejelentkezése nem sikerült, vagy ki lett hagyva.")

    print("\nAjánlott ingatlanok tesztelése...")
    try:
        original_property_id_from_url = driver.current_url.split("/")[-1]

        recommended_section = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".moreRecs"))) 
        print("✅ Ajánlott ingatlanok szekció megtalálva.")

        recommended_properties = []
        try:
             recommended_properties = WebDriverWait(driver, 10).until( 
                 EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".moreRecs .propertyCard")) 
             )
             print(f"✅ {len(recommended_properties)} ajánlott ingatlan található.")
        except TimeoutException:
              print("ℹ️ Nincsenek ajánlott ingatlan kártyák találhatók a szekcióban.")


        if recommended_properties:
            first_recommended = recommended_properties[0]
            recommended_property_link_element = first_recommended.find_element(By.TAG_NAME, "a") 
            recommended_property_link = recommended_property_link_element.get_attribute("href")
            recommended_property_id = recommended_property_link.split("/")[-1]

            print(f"✅ Az első ajánlott ingatlan ide mutat: {recommended_property_link}")

            driver.execute_script("arguments[0].scrollIntoView(true);", recommended_property_link_element)
            time.sleep(0.5)
            wait.until(EC.element_to_be_clickable(recommended_property_link_element)).click()

            wait.until(lambda d: f"ingatlanok/{recommended_property_id}" in d.current_url and original_property_id_from_url != recommended_property_id)
            print(f"✅ Az ajánlott ingatlan navigáció működik – átirányított a következő ingatlan azonosítóra: {recommended_property_id}.")

            driver.back()
            wait.until(lambda d: f"ingatlanok/{original_property_id_from_url}" in d.current_url)
            print("✅ Sikeresen visszalépett az eredeti ingatlanra.")

        else:
            print("ℹ️ Az ajánlott kártya kattintási teszt kihagyása, mivel nem találhatóak kártyák.")

    except TimeoutException:
        print("❌ Az ajánlott ingatlanok szekció nem található, vagy időtúllépés történt a navigációra/elemekre várva.")
    except Exception as e:
        print(f"❌ Hiba történt az ajánlott ingatlanok szekció tesztelésekor: {str(e)}")

    print("\n=== Reszletek test sikeres ===")

    print("\nNavigálás az 'Rólunk' oldalra...")
    driver.get("http://localhost:3000/rolunk")
    wait.until(EC.url_contains("rolunk"))

    print("\n=== Rólunk komponens tesztek ===")
    try: 

        if "rolunk" in driver.current_url:
            print("✅ A(z) 'Rólunk' oldal sikeresen betöltődött.")
        else:
            print("❌Nem sikerült betölteni az 'Rólunk' oldalt..")
            raise Exception("Failed to load Rolunk page") 

        try:
            logo = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".aboutUsLogo"))) 
            header = driver.find_element(By.XPATH, "//h1[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'rólunk')]") # Case-insensitive check

            print("✅ A logo és a fejléc helyesen jelenik meg.")
        except TimeoutException:
            print("❌ Nem sikerült megtalálni a logót vagy a fejlécet.")
        except Exception as e:
             print(f"❌ Hiba történt a logo/fejléc ellenőrzésekor: {e}")

        try:
            about_text = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".aboutUsText"))) 
            if len(about_text.text) > 50:  
                print("✅ A(z) 'Rólunk' szöveges tartalom megjelenik.")
            else:
                print("❌ A(z) 'Rólunk' szöveges tartalom hiányzik vagy túl rövid.")
        except TimeoutException:
            print("❌ Nem sikerült megtalálni az 'Rólunk' szöveges szekciót.")
        except Exception as e:
             print(f"❌ Hiba történt a(z) 'Rólunk' szöveg ellenőrzésekor: {e}")

        try:
            values_title = wait.until(EC.visibility_of_element_located((By.XPATH, "//h1[contains(text(), 'Értékeink')]"))) 
            value_cards = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".valueCard"))) 

            EXPECTED_VALUE_CARDS = 3
            if len(value_cards) == EXPECTED_VALUE_CARDS:
                print(f"✅ A 'Values' szekció megjelenik, és {len(value_cards)} értékkártyát tartalmaz.")

                incomplete_cards = []
                for i, card in enumerate(value_cards):
                    try:
                        icon = card.find_element(By.TAG_NAME, "svg") 
                        title = card.find_element(By.TAG_NAME, "h1") 
                        paragraphs = card.find_elements(By.TAG_NAME, "p") 

                        if not (icon.is_displayed() and title.is_displayed() and len(paragraphs) >= 1 and paragraphs[0].text):
                             incomplete_cards.append(f"Card {i+1} (content missing)")
                    except NoSuchElementException:
                         incomplete_cards.append(f"Card {i+1} (structure error)")

                if not incomplete_cards:
                     print(f"✅ All {EXPECTED_VALUE_CARDS} value cards seem complete.")
                else:
                     print(f"❌ Az értékkártya(k) tartalma hiányos: {', '.join(incomplete_cards)}")

            else: 
                 print(f"❌ Értékek szekció: Várt {EXPECTED_VALUE_CARDS} kártya, talált: {len(value_cards)}.")

        except TimeoutException:
            print("❌ Nem sikerült megtalálni az 'Értékek' címet vagy az értékkártyákat.")
        except Exception as e:
            print(f"❌ Nem sikerült ellenőrizni az 'Értékek' szekciót: {str(e)}")

        try:
            team_title = wait.until(EC.visibility_of_element_located((By.XPATH, "//h1[contains(text(), 'Csapatunk')]"))) 
            team_cards = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".teamCard"))) 

            MIN_TEAM_MEMBERS = 3 
            if len(team_cards) >= MIN_TEAM_MEMBERS:
                print(f"✅ Nem sikerült ellenőrizni az 'Értékek' szekciót:.")

                incomplete_cards = []
                for i, card in enumerate(team_cards[:MIN_TEAM_MEMBERS]):
                    try:
                        img = card.find_element(By.CSS_SELECTOR, ".teamCardImg") 
                        name = card.find_element(By.CSS_SELECTOR, ".teamCardName") 
                        role = card.find_element(By.CSS_SELECTOR, ".teamCardInfo") 

                        if not (img.is_displayed() and name.is_displayed() and role.is_displayed() and name.text and role.text):
                             incomplete_cards.append(f"Card {i+1} (content missing)")
                    except NoSuchElementException:
                        incomplete_cards.append(f"Card {i+1} (structure error)")

                if not incomplete_cards:
                     print(f"✅ Az első {MIN_TEAM_MEMBERS} csapattag kártya teljesnek tűnik.")
                else:
                     print(f"❌ A csapattag kártya(i) tartalma hiányos: {', '.join(incomplete_cards)}")

            else:
                 print(f"❌ Csapat szekció: Legalább {MIN_TEAM_MEMBERS} tagot vártunk, de {len(team_cards)} található.")

        except TimeoutException:
            print("❌ Nem található csapat cím vagy csapattag kártyák.")
        except Exception as e:
            print(f"❌ Nem sikerült ellenőrizni a csapat szekciót.: {e}")


        try:
            ratings_title = wait.until(EC.visibility_of_element_located((By.XPATH, "//h1[contains(text(), 'Értékelések')]"))) 
            rating_cards = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".ratingCard"))) 

            MIN_RATINGS = 4 
            if len(rating_cards) >= MIN_RATINGS:
                print(f"✅ Értékelések szekció {len(rating_cards)} visszajelzéssel megjelenítve.")

                incomplete_cards = []
                for i, card in enumerate(rating_cards[:MIN_RATINGS]): 
                    try:
                        img = card.find_element(By.CSS_SELECTOR, ".ratingCardPfp") 
                        name = card.find_element(By.CSS_SELECTOR, ".ratingCardName") 
                        text = card.find_element(By.CSS_SELECTOR, ".ratingCardText")

                        if not (img.is_displayed() and name.is_displayed() and text.is_displayed() and name.text and text.text):
                            incomplete_cards.append(f"Card {i+1} (content missing)")
                    except NoSuchElementException:
                         incomplete_cards.append(f"Card {i+1} (structure error)")

                if not incomplete_cards:
                     print(f"✅ Az első {MIN_RATINGS} értékelő kártya teljesnek tűnik..")
                else:
                     print(f"❌ Az értékelő kártya(k) tartalma hiányos: {', '.join(map(str, incomplete_cards))}")

            else: 
                 print(f"❌ Értékelések szekció: Legalább {MIN_RATINGS} értékelést vártunk, de ennyi található: {len(rating_cards)}.")

        except TimeoutException:
             print("❌ Nem található értékelés cím vagy értékelő kártyák.")
        except Exception as e:
             print(f"❌ Nem sikerült ellenőrizni az értékelések szekciót: {e}")

        try:
            footer = wait.until(EC.visibility_of_element_located((By.TAG_NAME, "footer")))
            print("✅ A lábléc megjelenítve.")
        except TimeoutException:
            print("❌ A lábléc nem található.")
        except Exception as e:
             print(f"❌ Hiba történt a lábléc ellenőrzésekor: {e}")


        print("\n=== A Rólunk tesztek befejeződtek. ===")

    except Exception as e: 
        print(f"❌ Hiba történt a Rólunk tesztek során: {str(e)}")

except Exception as e:
    print(f"\n❌❌❌ Feldolgozatlan hiba történt a szkript végrehajtása során: {str(e)} ❌❌❌")
    import traceback
    print(traceback.format_exc())

finally:
    print("\nClosing WebDriver...")
    if 'driver' in locals() and driver:
        try:
             driver.quit()
             print("A WebDriver sikeresen bezáródott.")
        except Exception as quit_e:
             print(f"Hiba történt a WebDriver bezárása során: {quit_e}")
    else:
        print("A WebDriver nincs inicializálva, vagy már bezáródott.")
    time.sleep(5)
