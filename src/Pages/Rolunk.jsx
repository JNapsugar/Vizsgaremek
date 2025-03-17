import React, { useState, useEffect } from 'react';
import '../style.css';
import Navbar from '../Components/Navbar';
import Footer from "../Components/Footer";
import { Lightbulb, ShieldShaded, People } from 'react-bootstrap-icons';


const Ingatlanok = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [
        "img/headers/header1.jpg",
        "img/headers/header2.jpg",
        "img/headers/header3.jpg",
        "img/headers/header4.jpg",
        "img/headers/header5.jpg"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div>
            <Navbar />
            <header className="smallHeader">
                <div className="headerImages">
                    {images.map((image, index) => (
                        <img key={index} src={image} className={`headerImage ${index === activeIndex ? 'active' : ''}`} alt={`Header ${index + 1}`} />
                    ))}
                </div>
                <h1 className="smallHeaderTitle">Rólunk</h1>
            </header>
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
            </div>
            <div className='aboutUsTeam'>
            <h1 className='title'>Csapatunk</h1>
            </div>
            <img src="img/city2.png" className="footerImg" alt="City view" />
            <Footer />
        </div>
    );
};

export default Ingatlanok;
