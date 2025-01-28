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
    }, []);

    const [properties,setProperties] = useState([]);
    const [isPending, setPending] = useState(false);
    const [error, setError] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [filters, setFilters] = useState({
        megye: "Összes",
        helyszin: "Összes",
        szobak: "Mindegy",
        wifiCb: false,
        petCb: false });   

    const toggleFilter = () => {
        setIsFilterExpanded(!isFilterExpanded);
    };

    const handleFilterChange = (e) => {
        const { id, value, type, checked } = e.target;

        setFilters({ ...filters, [id]: type === "checkbox" ? checked : value });
    };

    const filteredProperties = properties.filter(property => {
        let megyeHelyszin = "";

        switch (filters.megye) {
            case "Pest":
                megyeHelyszin = "Budapest";
                break;
            case "Borsod-Abaúj-Zemplén":
                megyeHelyszin = "Miskolc";
                break;
            case "Hajdú-Bihar":
                megyeHelyszin = "Debrecen";
                break;
            case "Csongrád-Csanád":
                megyeHelyszin = "Szeged";
                break;
            case "Baranya":
                megyeHelyszin = "Pécs";
                break;
            case "Somogy":
                megyeHelyszin = "Siófok";
                break;
        }
        console.log(megyeHelyszin);
        return (
            (filters.megye === "Összes" || property.helyszin === megyeHelyszin) &&
            (filters.helyszin === "Összes" || property.helyszin === filters.helyszin) &&
            (filters.szobak === "Mindegy" || ((property.szobak <= 3) ? (property.szobak === filters.szobak) : (filters.szobak === "Több mint 3"))) &&
            (!filters.wifiCb || property.szolgaltatasok.includes("wifi")) &&
            (!filters.petCb || property.szolgaltatasok.includes("háziállat"))
        );
    });


    
    useEffect(() => {
        setPending(true);
        //https://localhost:7079/api/Ingatlan/ingatlanok
        axios.get('/data/featured.json')
        .then(res => setProperties(res.data))
        .catch(error =>{ console.error(error);
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
                        <select id="megye" className="filterSelect" onChange={handleFilterChange}>
                            <option>Összes</option>
                            <option>Pest</option>
                            <option>Borsod-Abaúj-Zemplén</option>
                            <option>Hajdú-Bihar</option>
                            <option>Csongrád-Csanád</option>
                            <option>Baranya</option>
                            <option>Somogy</option>
                        </select>
                    </div>
                    <div className="filterSelectContainer">
                        <label>Város</label>
                        <select id="helyszin" className="filterSelect" onChange={handleFilterChange}>
                            <option>Összes</option>
                            <option>Budapest</option>
                            <option>Miskolc</option>
                            <option>Debrecen</option>
                            <option>Pécs</option>
                            <option>Siófok</option>
                        </select>
                    </div>
                    <div className="filterSelectContainer">
                        <label>Szobák</label>
                        <select id="szobak" className="filterSelect" onChange={handleFilterChange}>
                            <option>Mindegy</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>Több mint 3</option>
                        </select>
                    </div>
                    <div className="filterSelectContainer">
                        <label>Rendezés</label>
                        <select id="rendezes" className="filterSelect">
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
                    <input type="checkbox" id="wifiCb" className="filterCheckbox" onChange={handleFilterChange}/>
                    <label>Háziállat: </label>
                    <input type="checkbox" id="petCb" className="filterCheckbox" onChange={handleFilterChange}/>
                </div>
            </div>

            <div className="gridCards" id="cards">
            {isPending ? (
                <ClipLoader color='#e09900' loading={isPending} size={100}/>
            ) : error ? (<div className="errorMessage">Nem sikerült betölteni az adatokat</div>   
            ) : (
                <div className='kiemeltCards'>
                    {filteredProperties.map((property) => (
                        <PropertyCard key={property.id} property={property}/>
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
