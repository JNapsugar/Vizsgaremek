
import React, {useState, useEffect} from 'react';
import {useParams } from 'react-router-dom';
import axios from 'axios';
import '../style.css';
import Navbar from '../Components/Navbar';
import PropertyCard from '../Components/PropertyCard';
//import Carousel from './Carousel';

const App = () => {
        const [activeIndex, setActiveIndex] = useState(0);
        const images = [
            "/img/header1.jpg",
            "/img/header2.jpg",
            "/img/header3.jpg",
            "/img/header4.jpg",
            "/img/header5.jpg"
        ];
    
        useEffect(() => {
            const interval = setInterval(() => {
                setActiveIndex(prevIndex => (prevIndex + 1) % images.length);
            }, 3000);
            return () => clearInterval(interval);
        }, []);

    const { ingatlanId } = useParams();
    const[property,setProperty] = useState({});
    
    useEffect(() => {
        axios.get(`https://localhost:7079/api/Ingatlan/ingatlanok/${ingatlanId}`)
            .then(res => {setProperty(res.data);})
            .catch(error => console.log(error));
    }, [ingatlanId]);
    
return (
    
    <div>
        <Navbar/>
        <header className="smallHeader">
            <div className="headerImages">
                {images.map((image, index) => (
                    <img key={index} src={image} className={`headerImage ${index === activeIndex ? 'active' : ''}`} alt={`Header ${index + 1}`} />
                ))}
            </div>
            <h1 className="smallHeaderTitle">Ingatlanok</h1>
        </header>

    <div className="propertyMainContent">
        <img src="/img/placeholder.jpg" alt="Placeholder" loading="lazy" className='propertyPlaceholder'/>
        <div className="mainDetails">
            <p className="propertyTitle">{property.helyszin}</p>
            <p className="propertyLocation">{property.cim}</p>
            <p className="propertyPrice">{property.ar} Ft/éjszaka</p>
            <p className="propertyShortDescription">{property.leiras}</p>
        </div> 
    </div>

    <hr />

    <div className="propertyOtherContent">
        <div className="otherDetails">
            <p className="propertyDetailsTitle">Részletek</p>
            <p className="propertyLongDescription">
                Méret: {property.meret}m²<br />
                Szobák száma: {property.szoba} <br />
                Feltöltés dátuma: {property.feltoltesDatum}
            </p>
            <p className="propertyDetailsTitle">Szolgáltatások</p>
            <div className="services">
                {property.szolgaltatasok && property.szolgaltatasok.split(', ').map((service, index) => {
                    let iconSrc;
                    switch (service) {
                        case "Wi-Fi": iconSrc = "/img/icons/wifi.svg"; break;
                        case "kutya hozható": iconSrc = "/img/icons/paw.svg"; break;
                        case "parkolás": iconSrc = "/img/icons/parking.svg"; break;
                        case "medence": iconSrc = "/img/icons/pool.svg"; break;
                        case "kert": iconSrc = "/img/icons/garden.svg"; break;
                        case "légkondícionálás": iconSrc = "/img/icons/airconditioning.svg"; break;
                        case "billiárd": iconSrc = "/img/icons/pooltable.svg"; break;
                        case "ping-pong": iconSrc = "/img/icons/pingpong.svg"; break;
                        case "akadálymentes": iconSrc = "/img/icons/wheelchair.svg"; break;
                        case "baba bútorok": iconSrc = "/img/icons/baby.svg"; break;
                        case "grill": iconSrc = "/img/icons/grill.svg"; break;
                        case "horgásztó": iconSrc = "/img/icons/fishing.svg"; break;
                        case "istálló": iconSrc = "/img/icons/stable.svg"; break;
                        case "erkély/terasz": iconSrc = "/img/icons/balcony.svg"; break;
                        case "házimozi": iconSrc = "/img/icons/cinema.svg"; break;
                        case "mosógép": iconSrc = "/img/icons/washingmachine.svg"; break;
                        case "kávőfőző": iconSrc = "/img/icons/coffeemaker.svg"; break;
                        case "takarítószolgálat": iconSrc = "/img/icons/cleaning.svg"; break;
                        case "biztonsági kamera": iconSrc = "/img/icons/securitycamera.svg"; break;
                        case "golfpálya": iconSrc = "/img/icons/golf.svg"; break;
                        case "spajz": iconSrc = "/img/icons/pantry.svg"; break;
                        default: iconSrc = "/img/icons/plus.svg"; break;
                    }
                    return (
                        <div key={index} className="service">
                            <img src={iconSrc} alt={service} />
                            {service}
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="propertyContactCard">
            <p className="propertyContactTitle">Kapcsolat:</p>
            <img src="/img/placeholder.jpg" className="uploaderImg" alt="Uploader" />
            <a className="uploaderName">Feltöltő neve</a>
            <div className="propertyContact">
            <span>Telefon:</span><span className="propertyContactValue">0000000000</span>
        </div>
        <div className="propertyContact">
            <span>Email:</span><span className="propertyContactValue">xxxxxxxxxxxxxxxxx</span>
        </div>
        </div>
    </div>

    <hr />

    <p className="moreRecsTitle">További ajánlatok</p>

    <div className="moreRecs">
        {Object.keys(property).length>0 ? <PropertyCard key={2} property={property}/> : ""}
    </div>

    <img src="/img/city2.png" className="footerImg" alt="City View" />
    <footer>
        <h3>Elérhetőségek</h3>
    </footer>

    </div>
);
};

export default App;
