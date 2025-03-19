import '../style.css';
import Navbar from '../Components/Navbar';
import SmallHeader from '../Components/SmallHeader';
import Footer from "../Components/Footer";
import { Lightbulb, ShieldShaded, People } from 'react-bootstrap-icons';


const Rolunk = () => {
    return (
        <div>
            <Navbar />
            <SmallHeader title="Rólunk" />
            <div className='aboutUs'>
                <div className='aboutUsTextContainer'>
                    <img src="./img/Logo.png" alt="Rentify" className='aboutUsLogo'/>
                    <p className='aboutUsText'>
                        A Rentify 2025-ben alakult, amikor kis csapatunk úgy döntött, hogy változtat az ingatlanbérlési piacon. Láttuk, hogy a bérlők és a tulajdonosok számára is sokszor nehézkes és átláthatatlan a folyamat. Ezért létrehoztuk a Rentify-t, hogy mindenki számára egyszerűbbé és biztonságosabbá tegyük az ingatlanbérlést.
                        <br /><br />Célunk, hogy mindenki számára elérhetővé tegyük a kényelmes és biztonságos ingatlanbérlést. Legyen szó egy kis lakásról, egy nagy családi házról, a Rentify segít, hogy megtaláld a tökéletes ingatlant.
                        Egy olyan jövőt álmodunk, ahol az ingatlanbérlés nem jelent bonyodalmat vagy bizonytalanságot.
                    </p>
                </div>
                <div className='aboutUsValues'>
                    <h1 className='title'>Értékeink</h1>
                    <div className='valueCardContainer'>
                    <div className='valueCard'>
                        <Lightbulb/>
                        <h1>Felhasználóközpontúság:</h1>
                        <p>A felhasználóink igényei mindig az első helyen állnak nálunk. Minden döntésünket úgy hozzuk, hogy az a bérlők és tulajdonosok számára is előnyös legyen.</p> 
                        <p>A felhasználói élmény a legfontosabb. Ezért folyamatosan fejlesztjük platformunkat, hogy mindenki számára kényelmes és hatékony legyen.</p>
                    </div>
                    <div className='valueCard'>
                        <ShieldShaded/>
                        <h1>Átláthatóság:</h1>
                        <p>Hiszünk abban, hogy az ingatlanbérlésnek átláthatónak és tisztességesnek kell lennie. Ezért minden információt egyértelműen és nyíltan közlünk, hogy a felhasználóink biztonságban érezzék magukat.</p> 
                        <p>Nálunk nincsenek rejtett költségek vagy meglepetések.</p> 
                    </div>
                    <div className='valueCard'>
                        <People/>
                        <h1>Innováció:</h1>
                        <p>Nyitottak vagyunk az új ötletekre és megoldásokra. Minden visszajelzést figyelembe veszünk, és folyamatosan fejlesztjük szolgáltatásainkat, hogy a lehető legjobb élményt nyújtsuk felhasználóinknak.</p>
                        <p>Az innováció révén igyekszünk előre látni és kielégíteni a bérlők és tulajdonosok jövőbeli igényeit.</p> 
                    </div>
                    </div>
                </div>
                <div className='aboutUsTeam'>
                <h1 className='title'>Csapatunk</h1>
                <div className='teamCardContainer'>
                    <div className="teamCard">
                    <div className="teamCardContent">
                        <img src="./img/people/JancsurakNapsugar.jpg" alt="JancsurakNapsugar" className='teamCardImg'/>
                        <div className="teamCardDescription">
                        <p className="teamCardName">
                            <strong>Jancsurák Napsugár</strong>
                        </p>
                        <p className="teamCardInfo">
                            Frontend
                        </p>
                        </div>
                    </div>
                    </div>
                    <div className="teamCard">
                    <div className="teamCardContent">
                        <img src="./img/people/VargaAntonia.jpg" alt="VargaAntonia" className='teamCardImg'/>
                        <div className="teamCardDescription">
                        <p className="teamCardName">
                            <strong>Varga Antónia</strong>
                        </p>
                        <p className="teamCardInfo">
                            Backend
                        </p>
                        </div>
                    </div>
                    </div>
                    <div className="teamCard">
                    <div className="teamCardContent">
                        <img src="./img/people/KatonaAlexandra.jpg" alt="KatonaAlexandra" className='teamCardImg'/>
                        <div className="teamCardDescription">
                        <p className="teamCardName">
                            <strong>Katona Alexandra</strong>
                        </p>
                        <p className="teamCardInfo">
                            Adatbázis-WPF
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div className='aboutUsRatings'>
                <h1 className='title'>Értékelések</h1>
                <div className='ratingsContainer'>
                    <div className='ratingCard'>
                        <img src="./img/people/VargaJudit.jpeg" alt="VargaJudit" className='ratingCardPfp'/>
                        <p className='ratingCardName'>Varga Judit</p>
                        <p className='ratingCardText'>'A Rentify-en keresztül nemcsak gyorsan találtuk meg a megfelelő nyaralóját a Balaton-parton, de az oldalon található részletes leírások és képek alapján könnyen eldönthettük, hogy melyik ingatlan felel meg az igényeinknek. Az egész folyamat zökkenőmentes volt.'</p>
                    </div>
                    <div className='ratingCard'>
                        <img src="./img/people/TothBalazs.jpeg" alt="TothBalazs" className='ratingCardPfp'/>
                        <p className='ratingCardName'>Tóth Balázs</p>
                        <p className='ratingCardText'>'A Rentify átlátható és könnyen kezelhető felülete segítségével gyorsan megtaláltam a tökéletes lakást. Nagyon elégedett vagyok a szolgáltatással, és bátran ajánlom mindenkinek, aki lakást keres.</p>
                    </div>
                    <div className='ratingCard'>
                        <img src="./img/people/NemethEszter.jpeg" alt="NemethEszter" className='ratingCardPfp'/>
                        <p className='ratingCardName'>Németh Eszter</p>
                        <p className='ratingCardText'>'A Rentify felületén nagyon egyszerű volt feltölteni és kiadni a lakásomat. A részletes űrlapok segítségével minden információt könnyedén hozzáadtam, és a képeket is gyorsan feltudtam tölteni. Az ingatlan adatait később is könnyen szerkeszthettem, ha változott valami. A platform átlátható és felhasználóbarát, így minden lépés zökkenőmentes volt.'</p>
                    </div>
                    <div className='ratingCard'>
                        <img src="./img/people/KovacsJanos.jpeg" alt="KovacsJanos" className='ratingCardPfp'/>
                        <p className='ratingCardName'>Kovács János</p>
                        <p className='ratingCardText'>'A Rentify-en keresztül nemcsak gyorsan találtam meg a megfelelő bérlőket, de a bérlési időszakokat is könnyedén kezelhettem. Az oldal átlátható felülete és a különböző szolgáltatások nagyban megkönnyítették a dolgomat. Mindenkinek csak ajánlani tudom, aki ingatlant szeretne kiadni.</p>
                    </div>
                </div>
            </div>
            <div className='aboutUsEnd'>
                <h1 className='title'>500+ aktív bérlő és 1000+ ingatlan vár rád a Rentify-en. Csatlakozz te is közösségünkhöz!</h1>
                <p>Ha kérdésed van, írj nekünk az ingatlanberlesiplatform@gmail.com e-mail címen.</p>
            </div>
            </div>
            <img src="img/city2.png" className="footerImg" alt="City view" />
            <Footer />
        </div>
    );
};

export default Rolunk;
