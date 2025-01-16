
import React, {useState, useEffect} from 'react';
import { Link,useParams } from 'react-router-dom';
import axios from 'axios';
import './style.css';
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
        }, [images.length]);

    const { ingatlanId } = useParams();
    const[house,setHouse] = useState({});
    console.log(ingatlanId);
    
    useEffect(() => {
        axios.get(`https://localhost:7079/api/ingatlanok/${ingatlanId}`)
            .then(res => setHouse(res.data))
            .catch(error => console.log(error));
    }, [ingatlanId]);
    
return (
    <div>
        <nav className="navbar">
                <Link to={"/home"} className="navItem">Főoldal</Link>
                <Link to={"/ingatlanok"} className="navItem">Ingatlanok</Link>
                <Link to={"/kiadas"} className="navItem">Kiadás</Link>
                <Link to={"/rolunk"} className="navItem">Rólunk</Link>
                <button className="belepesBtn"><Link to={"/belepes"}>Belépés</Link></button>
        </nav>

        <header className="smallHeader">
            <div className="headerImages">
                {images.map((image, index) => (
                    <img key={index} src={image} className={`headerImage ${index === activeIndex ? 'active' : ''}`} alt={`Header ${index + 1}`} />
                ))}
            </div>
            <h1 className="smallHeaderTitle">Ingatlanok</h1>
        </header>

    <div className="houseMainContent">
    <img src="/img/placeholder.jpg" alt="Placeholder" className=''/>

        <div className="mainDetails">
            <p className="houseTitle">{house.cim}</p>
            <p className="houseLocation">{house.helyszin}</p>
            <p className="housePrice">{house.ar}Ft/éjszaka</p>
            <p className="houseShortDescription">{house.leiras}</p>
        </div> 
    </div>

    <hr />

    <div className="houseOtherContent">
        <div className="otherDetails">
            <p className="houseDetailsTitle">Részletek</p>
            <p className="houseLongDescription">
                Méret: {house.meret}m²<br /><br />
                Feltöltés dátuma: {house.feltoltesDatum}
            </p>
            <p className="houseDetailsTitle">Szolgáltatások</p>
            <div className="services">
            {house.szolgaltatasok && house.szolgaltatasok.split(' ').map((service, index) => (
                <div key={index} className="service">
                    <img src="/img/icons/plus.svg" alt={service} />
                    {service}
                </div>
            ))}
    </div>

        </div>

        <div className="houseContactCard">
            <p className="houseContactTitle">Kapcsolat:</p>
            <img src="img/placeholder.jpg" className="uploaderImg" alt="Uploader" />
            <a href="" className="uploaderName">Feltöltő neve</a>
            <div className="houseContact">
            <span>Telefon:</span><span className="houseContactValue">0000000000</span>
        </div>
        <div className="houseContact">
            <span>Email:</span><span className="houseContactValue">xxxxxxxxxxxxxxxxx</span>
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
