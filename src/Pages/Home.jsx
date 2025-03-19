import React, { useState, useEffect }from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import "../style.css";
import Navbar from "../Components/Navbar";
import { RiseLoader } from "react-spinners";
import PropertyCard from "../Components/PropertyCard";
import Footer from "../Components/Footer";

const Home = () => {

    const images = [
        "./img/headers/header1.jpg",
        "./img/headers/header2.jpg",
        "./img/headers/header3.jpg",
        "./img/headers/header4.jpg",
        "./img/headers/header5.jpg"
    ];
    
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    },[images.length]);


    const [cities,setCities] = useState([]);
    const [featured,setFeatured] = useState([]);
    const [propertyImages, setPropertyImages] = useState([]);
    const [isCityPending, setCityPending] = useState(false);
    const [isFeaturedPending, setFeaturedPending] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [featuredError, setFeaturedError] = useState(false);

    useEffect(() => {
        const popularCityNames = ["Budapest", "Miskolc", "Debrecen", "Szeged", "Pécs", "Siófok"]
        const fetchCities = () => {
            setCityPending(true);
            axios.get('https://localhost:7079/api/Telepules/telepulesek')
                .then(res => {
                    const popularCities = res.data.filter(city => popularCityNames.includes(city.nev));
                    setCities(popularCities);
                })
                .catch(error => {
                    setCityError(true);
                    console.error("Hiba a betöltés során: ", error);
                })
                .finally(() => setCityPending(false));
        };
        fetchCities();
    }, []);
    
useEffect(() => {
    const fetchFeatured = () => {
        setFeaturedPending(true);
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
    }
    fetchFeatured();
    }, []);

    useEffect(() => {
        axios.get('https://localhost:7079/api/Ingatlankepek/ingatlankepek')
            .then(res => setPropertyImages(res.data))
            .catch(error => { console.error(error); })
    }, []);
    
    const CityCard = ({ city }) => (
        <div className="cityCard">
            <img src={city.kep} alt={city.nev} loading="lazy"/>
            <div className="cityCardContent">
                <p className="cityCardTitle">{city.nev}</p>
                <p className="cityCardDescription">{city.leiras}</p>
                <Link to={`/ingatlanok?city=${encodeURIComponent(city.nev)}`} onClick={() => window.scrollTo({ top: 0 })}>
                    <button>{city.nev}i ingatlanok megtekintése</button>
                </Link>

            </div>
        </div>      
    );    
    
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
    
    const FeaturedSection = () => (
        <section className="kiemeltSection">
            <h2 className="sectionTitle">Kiemelt ingatlanok</h2>
            <div className="kiemeltCards">
                {featured.map((property, index) => {
                    let propertyImg = propertyImages.find(img => img.ingatlanId === property.ingatlanId);
                    return <PropertyCard key={index} property={property} propertyImg={propertyImg}/>
                })}
            </div>
            <Link to="/ingatlanok" className="headerBtnLink"><button className="moreBtn">
                További ingatlanok
            </button></Link>
            <img src="./img/city2.png" className="footerImg" alt="footer" />
        </section>
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
                    <button className="starBtn">
                    <Link to="/ingatlanok">
                            INGATLAN KERESÉSE
                    </Link>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`absolute star-${i + 1} animate-spin-slow`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53" className="w-6 h-6 text-yellow-400">
                                <path fill="currentColor"d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"/>
                            </svg>
                        </div>
                    ))}
                    </button>
                </div>
            </header>
            <div className="homeContent">
                {isCityPending ? (<div className="loading"><RiseLoader color="#e09900" size={15}/></div>) : cityError ? <p className="errorMessage">Hiba történt a városok betöltése során.</p> : (
                <CitySection />
                )}
                <img src="./img/city.png" className="cityImg" alt="city" />
                {isFeaturedPending ? (<div className="loading"><RiseLoader color="#e09900" size={15}/></div>) : featuredError ? <p className="errorMessage">Hiba történt az ingatlanok betöltése során. <img src="img/errordog.gif" alt="hiba" /></p> : (
                <FeaturedSection />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Home;
