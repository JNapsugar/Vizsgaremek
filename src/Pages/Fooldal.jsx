import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Styles/Fooldal.css";
import Navbar from "../Components/Navbar";
import { RiseLoader } from "react-spinners";
import { motion } from "framer-motion";
import PropertyCard from "../Components/PropertyCard";
import Footer from "../Components/Footer";
import HomeHeader from "../Components/HomeHeader";

const Fooldal = () => {
    const [cities, setCities] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [propertyImages, setPropertyImages] = useState([]);
    const [isCityPending, setCityPending] = useState(false);
    const [isFeaturedPending, setFeaturedPending] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [featuredError, setFeaturedError] = useState(false);

    useEffect(() => {
        const popularCityNames = ["Budapest", "Miskolc", "Debrecen", "Szeged", "Pécs", "Siófok"];        
        const fetchCities = async () => {
            try {
                setCityPending(true);
                const response = await axios.get('https://localhost:7079/api/Telepules/telepulesek');
                const popularCities = response.data.filter(city => popularCityNames.includes(city.nev));
                setCities(popularCities);
            } catch (error) {
                setCityError(true);
                console.error("Hiba a városok betöltése során: ", error);
            } finally {
                setCityPending(false);
            }
        };
        
        fetchCities();
    }, []);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                setFeaturedPending(true);
                const response = await axios.get('https://localhost:7079/api/Ingatlan/ingatlanok');
                const randomProperties = response.data.sort(() => Math.random() - 0.5).slice(0, 9);
                setFeatured(randomProperties);
            } catch (error) {
                setFeaturedError(true);
                console.error("Hiba a kiemelt ingatlanok betöltése során: ", error);
            } finally {
                setFeaturedPending(false);
            }
        };
        
        fetchFeatured();
    }, []);

    useEffect(() => {
        const fetchPropertyImages = async () => {
            try {
                const response = await axios.get('https://localhost:7079/api/Ingatlankepek/ingatlankepek');
                setPropertyImages(response.data);
            } catch (error) {
                console.error("Hiba az ingatlan képek betöltése során: ", error);
            }
        };
        
        fetchPropertyImages();
    }, []);


    const CityCard = ({ city }) => (
        <div className="cityCard">
            <img src={city.kep} alt={city.nev} loading="lazy" />
            <div className="cityCardContent">
                <p className="cityCardTitle">{city.nev}</p>
                <p className="cityCardDescription">{city.leiras}</p>
                <Link to={`/ingatlanok?city=${encodeURIComponent(city.nev)}`}>
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
                    <CityCard key={index} city={city} />
                ))}
            </div>
        </section>
    );

    const FeaturedSection = () => (
        <section className="kiemeltSection">
            <h2 className="sectionTitle">Kiemelt ingatlanok</h2>
            <div className="kiemeltCards">
                {featured.map((property, index) => {
                    const propertyImg = propertyImages.find(img => img.ingatlanId === property.ingatlanId);
                    return <PropertyCard key={index} property={property} propertyImg={propertyImg} />;
                })}
            </div>
            <Link to="/ingatlanok" className="headerBtnLink">
                <button className="moreBtn">További ingatlanok</button>
            </Link>
            <img src="./img/city2.png" className="footerImg" alt="footer" />
        </section>
    );

    return (
        <div>
        <Navbar/>
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.3 }}>
            <HomeHeader/>
            <div className="homeContent">
                {isCityPending ? (<div className="loading"><RiseLoader color="#e09900" size={15}/></div>) : 
                    cityError ? <p className="errorMessage">Hiba történt a városok betöltése során. <img src="img/errordog.gif" alt="hiba" /></p> : (
                        <CitySection />
                )}
                <img src="./img/city.png" className="cityImg" alt="city" />
                {isFeaturedPending ? (<div className="loading"><RiseLoader color="#e09900" size={15}/></div>) :
                    featuredError ? <p className="errorMessage">Hiba történt az ingatlanok betöltése során. <img src="img/errordog.gif" alt="hiba" /></p> : (
                        <FeaturedSection />
                )}
            </div>
            <Footer />
        </motion.div>
        </div>
    );
};

export default Fooldal;
