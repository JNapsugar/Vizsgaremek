import React, { useState, useEffect }from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import "../style.css";
import Navbar from "../Components/Navbar";



const Home = () => {

    
    const images = [
        "./img/header1.jpg",
        "./img/header2.jpg",
        "./img/header3.jpg",
        "./img/header4.jpg",
        "./img/header5.jpg"
    ];
    const cities = [
        {
            image:"./img/budapest.jpg",
            title:"Budapest",
            description:"Budapest pesti oldala, tele látnivalókkal, mint a Parlament és a Hősök tere. Pezsgő városi élet és sok program várja a látogatókat."
        },
        {
            image:"./img/miskolc.jpg",
            title:"Miskolc",
            description:"Miskolc gazdag történelemmel és gyönyörű természeti környezettel várja a látogatókat. A Diósgyőri Vár, a Lillafüredi Palota és a Miskolctapolcai Barlangfürdő népszerű látnivalók. A környező Bükk hegység ideális hely a túrázásra, pihenésre és kikapcsolódásra."
        },
        {
            image:"./img/Debrecen.jpg",
            title:"Debrecen",
            description:"Magyarország második legnagyobb városa, híres a Nagytemplomáról és a Virágkarneválról. Az Alföld keleti részén található."
        },
        {
            image:"./img/Szeged.jpg",
            title:"Szeged",
            description:"Az Alföld egyik legnagyobb városa, híres a Dómjáról és a Szabadtéri Játékokról. A Tisza partján fekszik, sok napsütéses órával."
        },
        {
            image:"./img/Pecs.jpg",
            title:"Pécs",
            description:"A Mecsek lábánál fekvő város, híres a Zsolnay Kulturális Negyedről és mediterrán hangulatáról. Gazdag történelmi örökséggel bír."
        },
        {
            image:"./img/Siofok.png",
            title:"Siofok",
            description:"A Balaton egyik legismertebb városa, népszerű strandjaival és nyüzsgő éjszakai életével. Nyáron a vízparti szórakozás központja."
        },
    ];
    
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    },[]);
    
    const CityCard = ({ city }) => (
        <div className="cityCard">
            <img src={city.image} alt={city.title} loading="lazy"/>
            <div className="cityCardContent">
                <p className="cityCardTitle">{city.title}</p>
                <p className="cityCardDescription">{city.description}</p>
                <button>{city.title}i ingatlanok megtekintése</button>
            </div>
    </div>
    );


    const CitySection = () => (
        <section className="citySection">
            <h2 className="sectionTitle">Népszerű városok</h2>
            <div className="cityCards">
                {cities.map((city) => (
                    <CityCard city={city}/>
                ))}
            </div>
        </section>
    );

    //To-do:Végpont, pending, felhasználói visszajelzés
    /*
    const[houses,setHouses] = useState([]);
    const[isPending, setPending] = useState(false);
    
    useEffect(() => {
        setPending(true);
        axios.get('https://localhost:7079')
        .then(res => setHouses(res.data))
        .catch(error => console.error(error))
        .finally(() => setPending(false));
    }, []);
    */
    const FeaturedPropertyCard = ({ image, city, price, services, rooms }) => (
    <div className="card">
        <img src={image} alt="ingatlan" loading="lazy"/>
        <div className="card-content">
            <h2>{city} <span className="price">{price}</span></h2>
            <div className="TovabbiInformaciok">
            <p>{rooms}szoba<br/>{services}</p>
            </div>
            <button>További információk</button>
        </div>
    </div>
    );
    
    const FeaturedSection = () => (
    <section className="kiemeltSection">
        <h2 className="sectionTitle">Kiemelt ingatlanok</h2>
        <div className="kiemeltCards">
            <FeaturedPropertyCard image="img/header1.jpg" city="Budapest" price="5000 Ft/ejszaka" rooms="3" services="ingyenes wifi, medence" />
            <FeaturedPropertyCard image="img/header2.jpg" city="Budapest" price="15000 Ft/ejszaka" rooms="4" services="háziállat" />
            <FeaturedPropertyCard image="img/header3.jpg" city="Budapest" price="25000 Ft/ejszaka" rooms="2" services="Ingyenes étkezés" />
            <FeaturedPropertyCard image="img/header1.jpg" city="Budapest" price="5000 Ft/ejszaka" rooms="3" services="ingyenes wifi, medence" />
            <FeaturedPropertyCard image="img/header2.jpg" city="Budapest" price="15000 Ft/ejszaka" rooms="4" services="háziállat" />
            <FeaturedPropertyCard image="img/header3.jpg" city="Budapest" price="25000 Ft/ejszaka" rooms="2" services="Ingyenes étkezés" />
            <FeaturedPropertyCard image="img/header1.jpg" city="Budapest" price="5000 Ft/ejszaka" rooms="3" services="ingyenes wifi, medence" />
            <FeaturedPropertyCard image="img/header2.jpg" city="Budapest" price="15000 Ft/ejszaka" rooms="4" services="háziállat" />
            <FeaturedPropertyCard image="img/header3.jpg" city="Budapest" price="25000 Ft/ejszaka" rooms="2" services="Ingyenes étkezés" />
        </div>
        <button className="moreBtn">További ingatlanok</button>
        <img src="./img/city2.png" className="footerImg" alt="footer" />
    </section>
    );
    
    const Footer = () => (
        <footer>
            <h3>Elérhetőségek</h3>
        </footer>
    );
    
    return (
        <div>
            <Navbar/>
            <header className="header">
                <div className="headerImages">
                    {images.map((image, index) => (
                        <img key={index} src={image} className={`headerImage ${index === activeIndex ? 'active' : ''}`} alt={`Header ${index + 1}`} />
                    ))}
                </div>
                <div className="headerContent">
                    <h1 className="headerTitle">Rentify</h1>
                    <p className="headerText">
                        Üdvözöljük a Rentify oldalán, ahol az ideális ingatlan megtalálása egyszerű és problémamentes. Fedezze fel változatos ingatlankínálatunkat, amelyek az Ön igényeire és életstílusára szabottak. Kezdje meg az utat következő otthona felé még ma!
                    </p>
                    <button className="headerBtn"> <Link to="/ingatlanok" className="headerBtnLink"> INGATLAN KERESÉSE </Link></button>
                </div>
            </header>
            <div className="homeContent">
                <CitySection />
                <img src="./img/city.png" className="cityImg" alt="city" />
                <FeaturedSection />
            </div>
            <Footer />
        </div>
    );
};

export default Home;
