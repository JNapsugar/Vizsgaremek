# Rentify - Ingatlanbérlési Platform
A projekt célja egy modern ingatlanbérlési platform megvalósítása, amely lehetővé teszi a bérlők számára, hogy ingatlanokat böngésszenek és részletes információkat tekintsenek meg róluk. 
Ezen kívül a tulajdonosok számára biztosítja, hogy feltöltsenek ingatlanokat és kezeljék azokat a platformon. 
A platform lehetőséget biztosít a felhasználók számára, hogy fiókot hozzanak létre és nyomon követhessék bérléseikkel kapcsolatos információikat.
A rendszer frontend, backend és adatbázis szinten is teljes funkcionalitást biztosít.
## Funkciók

### Bérlők számára:
##
- Lehetővé teszi az ingatlanok keresését és szűrését különböző paraméterek alapján.
- Részletes információkat biztosít az ingatlanokról, beleértve azok jellemzőit, szolgáltatásait és árát.
- Foglalási ajánlatok küldése a tulajdonosoknak, illetve szükség esetén a foglalások törlése.
- Profil a foglalások megtekintésére és a személyes adatok kezelésére.

### Tulajdonosok számára:
##
- Biztosítja, hogy ingatlanokat töltsenek fel a platformra.
- Lehetővé teszi az ingatlanok, és azok elérhetőségének frissítését.
- Az ingatlanokhoz érkező foglalási ajánlatok elfogadását és elutasítása.
- Profil azt feltöltött ingatlanok adminisztrációjához és a személyes adatok kezeléhez.

## Branch-ek
A projekt négy fő branch-ra van felosztva, amelyek a következőket tartalmazzák:

### 1. Frontend
A Frontend branch a platform felhasználói felületét (UI) tartalmazza, amely React-alapú alkalmazás. Ez a branch tartalmazza:
##
- React komponensek: Az ingatlanok megjelenítéséhez és kereséséhez szükséges komponensek.
- CSS stílusok: Az alkalmazás stílusai, reszponzív dizájn és vizuális elemek.
- Képek és média: A platformhoz szükséges képek, ikonok és egyéb vizuális tartalmak.

### 2. Backend
A Backend branch a web API-t tartalmazza, amely az ingatlanbérlési platform működését biztosítja. Ezen a branch-en található:
##
- API fejlesztés: Az ingatlanok, felhasználók, bérlési tranzakciók kezeléséhez szükséges RESTful API.
- Felhasználói fiók kezelése: A regisztráció, bejelentkezés, fiók adatok kezelése, valamint a jelszóváltoztatás és fiók biztonság kezelése.

### 3. Adatbázis
Az Adatbázis branch a platform adatbázis struktúráját tartalmazza. Ez a branch a következőket tartalmazza:
##
- MySQL adatbázis fájlok: Az adatbázis séma és a táblák definíciói, amelyek az ingatlanok, felhasználók és egyéb adatokat tárolják.
- Adatbázisterv: Az adatbázis struktúráját leíró dokumentáció, amely tartalmazza a táblák kapcsolatát, a fő kulcsokat és az adatbázis optimalizálását.

### 4. Karbantartó
A Karbantartó branch a platform karbantartó felületét tartalmazza. Ez a branch a következőket tartalmazza:
##
- WPF alkalmazás a felhasználók, ingatlanok és foglalások kezeléséhez.

### 5. Teszt
A Teszt branch a rendszer minőségének ellenőrzését végző automatikus és manuális teszteket. Ez a branch a következőket tartalmazza:
##
- Egységtesztelés a Jest keretrendszerrel a frontend komponensek ellenőrzésére.
- Backend API tesztelése Postman és Jest segítségével.
- Tesztdokumentáció
  
### 6. Dokumentáció
A Dokumentáció branch az összes projektmunkával kapcsolatos dokumentációt tartalmazza. Ezen a branch-en található:
##
- UX/UI képek: Az alkalmazás felhasználói élményéhez és felhasználói felületéhez tartozó design képek.
- Logikai térkép: A rendszer logikai felépítését bemutató diagramok.
- In progress dokumentumok: A projekt fejlesztésének aktuális állapotát és a már elvégzett munkákat tartalmazó dokumentációk.
- Felhasználói dokumentáció: Az alkalmazás használatát bemutató kézikönyv a végfelhasználók számára.
- Prezentáció: A projekt bemutatásához készített prezentáció a projekt céljáról, funkcióiról és megoldásairól.

##
### 7. React Natív mobilalkalmazás
Az weblapunk telefonos nézete: (https://snack.expo.dev/zOEAz6GGQLesL8KICsZnx).
