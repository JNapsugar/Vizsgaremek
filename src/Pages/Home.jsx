import React, { useState, useEffect }from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import "../style.css";
import Navbar from "../Components/Navbar";
import { RiseLoader } from "react-spinners";
import PropertyCard from "../Components/PropertyCard";

const Home = () => {

    const images = [
        "./img/headers/header1.jpg",
        "./img/headers/header2.jpg",
        "./img/headers/header3.jpg",
        "./img/headersheader4.jpg",
        "./img/headers/header5.jpg"
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
            <img src={city.kep} alt={city.nev} loading="lazy"/>
            <div className="cityCardContent">
                <p className="cityCardTitle">{city.nev}</p>
                <p className="cityCardDescription">{city.leiras}</p>
                <button>{city.nev}i ingatlanok megtekintése</button>
            </div>
        </div>
    );

    const popularCityNames = ["Budapest", "Miskolc", "Debrecen", "Szeged", "Pécs", "Siófok"]
    const CitySection = () => (
        <section className="citySection">
            <h2 className="sectionTitle">Népszerű városok</h2>
            <div className="cityCards">
                {cities.map((city, index) => (
                    <CityCard key={index} city={city}/>
                ))}
            </div>
        </section>
    );
    
    const [cities,setCities] = useState([]);
    const [featured,setFeatured] = useState([]);
    const [isCityPending, setCityPending] = useState(false);
    const [isFeaturedPending, setFeaturedPending] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [featuredError, setFeaturedError] = useState(false);
    
    useEffect(() => {
        fetchCities();
        fetchFeatured();
    }, []);

    const fetchCities = () => {
        setCityPending(true);
        setTimeout(() => {
            axios.get('https://localhost:7079/api/Telepules/telepulesek')
            .then(res => {
                const popularCities = res.data.filter(city => popularCityNames.includes(city.nev));
                setCities(popularCities);
            })
            .catch(error => {
                setCityError(true);
                console.error("Hiba a betöltés során: ", error)
        })
            .finally(() => setCityPending(false));
        }, 2000);
        
    }

    const fetchFeatured = () => {
        setFeaturedPending(true);
        setTimeout(() => {
        axios.get('https://localhost:7079/api/Ingatlan/ingatlanok')
        .then(res => {
            const randomProperties = res.data.sort(() => Math.random() - 0.5);
            const featuredProperties = randomProperties.slice(0, 9);
            setFeatured(featuredProperties);
        })

        .catch(error => {
            setFeaturedError(true);
            console.error("Hiba a betöltés során: ", error)
        })
        .finally(() => setFeaturedPending(false));
        }, 2000);
    }
    
    const FeaturedSection = () => (
        <section className="kiemeltSection">
            <h2 className="sectionTitle">Kiemelt ingatlanok</h2>
            <div className="kiemeltCards">
                {featured.map((property) => (
                    <PropertyCard key={property.id} property={property}/>
                ))}
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
                    <button className="headerBtn">
                        <Link to="/ingatlanok" className="headerBtnLink">
                            INGATLAN KERESÉSE
                        </Link>
                    </button>
                </div>
            </header>
            <div className="homeContent">
                {isCityPending ? (<div className="loading"><RiseLoader color="#e09900" size={15}/></div>) : cityError ? <p className="errorMessage">Hiba történt a városok betöltése során.</p> : (
                <CitySection />
                )}
                <img src="./img/city.png" className="cityImg" alt="city" />
                {isFeaturedPending ? (<div className="loading"><RiseLoader color="#e09900" size={15}/></div>) : featuredError ? <p className="errorMessage">Hiba történt az ingatlanok betöltése során. <img src="img/errordog.gif" /></p> : (
                <FeaturedSection />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Home;
