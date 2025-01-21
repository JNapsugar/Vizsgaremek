import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import '../style.css';
import Navbar from '../Components/Navbar';
import PropertyCard from '../Components/PropertyCard';
import { ClipLoader } from 'react-spinners';

const Ingatlanok = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [
        "img/header1.jpg",
        "img/header2.jpg",
        "img/header3.jpg",
        "img/header4.jpg",
        "img/header5.jpg"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);


    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const toggleFilter = () => {
        setIsFilterExpanded(!isFilterExpanded);
    };

    const[properties,setProperties] = useState([]);
    const[isPending, setPending] = useState(false);
    const[error, setError] = useState(false);
    
    useEffect(() => {
        setPending(true);
        axios.get('https://localhost:7079/api/Ingatlan/ingatlanok')
        .then(res => setProperties(res.data))
        .catch(error =>{ console.error(error+" mégilyet!");
                setError(true)})
        .finally(() => setPending(false));
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

            <div className="filter" id="filter" >
                <div className="filterRow">
                    <div className="filterSelectContainer">
                        <label>Megye</label>
                        <select className="filterSelect">
                            <option>Összes</option>
                            <option>valami</option>
                        </select>
                    </div>
                    <div className="filterSelectContainer">
                        <label>Város</label>
                        <select className="filterSelect">
                            <option>Összes</option>
                            <option>valami</option>
                        </select>
                    </div>
                    <div className="filterSelectContainer">
                        <label>Férőhely</label>
                        <select className="filterSelect">
                            <option>Mindegy</option>
                            <option>valami</option>
                        </select>
                    </div>
                    <div className="filterSelectContainer">
                        <label>Rendezés</label>
                        <select className="filterSelect">
                            <option>Alapértelmezett</option>
                            <option>valami</option>
                        </select>
                    </div>
                    <div className="showMoreFilter" id="showMoreFilter" onClick={toggleFilter}>
                        {isFilterExpanded ? 'Kevesebb▲' : 'További▼'}
                    </div>
                </div>

                <div className={`filterRow filterMore ${isFilterExpanded ? 'expanded' : ''}`} id="filterMore">
                    <label>Wifi: </label>
                    <input type="checkbox" id="wifiCb" className="filterCheckbox" />
                    <label>Háziállat: </label>
                    <input type="checkbox" id="petCb" className="filterCheckbox" />
                </div>
            </div>

            <div className="gridCards" id="cards">
            {isPending ? (
                <ClipLoader color='#e09900' loading={isPending} size={100}/>
            ) : error ? (<div className="errorMessage">Nem sikerült betölteni az adatokat</div>   
            ) : (
                <div>
                    {properties.map((property) => (
                        <PropertyCard property={property}/>
                    ))}
                </div>)}
            </div>

            <img src="img/city2.png" className="footerImg" alt="City view" />
            <footer>
                <h3>Elérhetőségek</h3>
            </footer>
        </div>
    );
}

export default Ingatlanok;
