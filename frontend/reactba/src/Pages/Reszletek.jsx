
import React, {useState, useEffect} from 'react';
import {useParams } from 'react-router-dom';
import axios from 'axios';
import '../style.css';
import Navbar from '../Components/Navbar';
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
    console.log(ingatlanId);
    
    useEffect(() => {
        axios.get(`https://localhost:7079/api/ingatlanok/${ingatlanId}`)
            .then(res => setProperty(res.data))
            .catch(error => console.log(error));
    }, []);
    
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
    {property.ingatlankepeks && property.ingatlankepeks.length > 0 ? (
                <img src={property.ingatlankepeks[0]} alt={property.cim} loading="lazy"/>
            ) : (
                <img src="/img/placeholder.jpg" alt="Placeholder" loading="lazy"/>
            )}
        <div className="mainDetails">
            <p className="propertyTitle">{property.cim}</p>
            <p className="propertyLocation">{property.helyszin}</p>
            <p className="propertyPrice">{property.ar}Ft/éjszaka</p>
            <p className="propertyShortDescription">{property.leiras}</p>
        </div> 
    </div>

    <hr />

    <div className="propertyOtherContent">
        <div className="otherDetails">
            <p className="propertyDetailsTitle">Részletek</p>
            <p className="propertyLongDescription">
                Méret: {property.meret}m²<br /><br />
                Feltöltés dátuma: {property.feltoltesDatum}
            </p>
            <p className="propertyDetailsTitle">Szolgáltatások</p>
            <div className="services">
            {property.szolgaltatasok && property.szolgaltatasok.split(' ').map((service, index) => (
                <div key={index} className="service">
                    <img src="/img/icons/plus.svg" alt={service} />
                    {service}
                </div>
            ))}
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

    <p className="moreRecsTitle">Továbi ajánlatok</p>

    <div className="moreRecs">
        <div className="card">
            <img src="/img/header1.jpg" alt="Recs 1" />
            <div className="card-content">
                <h2>Helyszin <span className="price">ft/ejszaka</span></h2>
                <div className="TovabbiInformaciok">
                <p>Szobák száma<br />még valamik</p>
                </div>
                <br />
                <button>További információk</button>
            </div>
        </div>
        <div className="card">
            <img src="/img/header1.jpg" alt="Recs 2" />
            <div className="card-content">
                <h2>Helyszin <span className="price">ft/ejszaka</span></h2>
                <div className="TovabbiInformaciok">
                    <p>Szobák száma<br />még valamik</p>
                </div>
                <br />
                <button>További információk</button>
            </div>
        </div>
        <div className="card">
            <img src="/img/header1.jpg" alt="Recs 3" />
            <div className="card-content">
                <h2>Helyszin <span className="price">ft/ejszaka</span></h2>
                <div className="TovabbiInformaciok">
                    <p>Szobák száma<br />még valamik</p>
                </div>
                <br />
                <button>További információk</button>
            </div>
        </div>
    </div>

    <img src="/img/city2.png" className="footerImg" alt="City View" />
    <footer>
        <h3>Elérhetőségek</h3>
    </footer>

    </div>
);
};

export default App;
