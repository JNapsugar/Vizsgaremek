import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../style.css';
import Navbar from '../Components/Navbar';
import PropertyCard from '../Components/PropertyCard';
import { RiseLoader } from 'react-spinners';

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

    const [properties, setProperties] = useState([]);
    const [isPending, setPending] = useState(false);
    const [error, setError] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [filters, setFilters] = useState({
        megye: "Összes",
        helyszin: "Összes",
        szobak: "Mindegy",
        wifiCb: false,
        petCb: false,
        parkolasCb: false,
        medenceCb: false,
        kertCb: false,
        legkondiCb: false,
        billiardCb: false,
        pingpongCb: false,
        akadalymentesCb: false,
        babaButorokCb: false,
        grillCb: false,
        horgasztoCb: false,
        istalloCb: false,
        erkelyTeraszCb: false,
        hazimoziCb: false,
        mosogepCb: false,
        kavefozoCb: false,
        takaritokCb: false,
        biztonsagiKameraCb: false,
        golfpalyaCb: false,
        spajzCb: false
    });

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

        return (
            (filters.megye === "Összes" || property.helyszin === megyeHelyszin) &&
            (filters.helyszin === "Összes" || property.helyszin === filters.helyszin) &&
            (filters.szobak === "Mindegy" || ((property.szobak <= 3) ? (property.szobak === filters.szobak) : (filters.szobak === "Több mint 3"))) &&
            (!filters.wifiCb || property.szolgaltatasok.includes("Wi-Fi")) &&
            (!filters.petCb || property.szolgaltatasok.includes("kutya hozható")) &&
            (!filters.parkolasCb || property.szolgaltatasok.includes("parkolás")) &&
            (!filters.medenceCb || property.szolgaltatasok.includes("medence")) &&
            (!filters.kertCb || property.szolgaltatasok.includes("kert")) &&
            (!filters.legkondiCb || property.szolgaltatasok.includes("légkondícionálás")) &&
            (!filters.billiardCb || property.szolgaltatasok.includes("billiárd")) &&
            (!filters.pingpongCb || property.szolgaltatasok.includes("ping-pong")) &&
            (!filters.akadalymentesCb || property.szolgaltatasok.includes("akadálymentes")) &&
            (!filters.babaButorokCb || property.szolgaltatasok.includes("baba bútorok")) &&
            (!filters.grillCb || property.szolgaltatasok.includes("grill")) &&
            (!filters.horgasztoCb || property.szolgaltatasok.includes("horgászási lehetőség")) &&
            (!filters.istalloCb || property.szolgaltatasok.includes("istálló")) &&
            (!filters.erkelyTeraszCb || property.szolgaltatasok.includes("erkély/terasz")) &&
            (!filters.hazimoziCb || property.szolgaltatasok.includes("házi mozi")) &&
            (!filters.mosogepCb || property.szolgaltatasok.includes("mosógép")) &&
            (!filters.kavefozoCb || property.szolgaltatasok.includes("kávéfőző")) &&
            (!filters.takaritokCb || property.szolgaltatasok.includes("takarítószolgálat")) &&
            (!filters.biztonsagiKameraCb || property.szolgaltatasok.includes("biztonsági kamera")) &&
            (!filters.golfpalyaCb || property.szolgaltatasok.includes("golfpálya"))
        );
    });

    useEffect(() => {
        setPending(true);
        axios.get('https://localhost:7079/api/Ingatlan/ingatlanok')
            .then(res => setProperties(res.data))
            .catch(error => { console.error(error); setError(true); })
            .finally(() => setPending(false));
    }, []);

    return (
        <div>
            <Navbar />
            <header className="smallHeader">
                <div className="headerImages">
                    {images.map((image, index) => (
                        <img key={index} src={image} className={`headerImage ${index === activeIndex ? 'active' : ''}`} alt={`Header ${index + 1}`} />
                    ))}
                </div>
                <h1 className="smallHeaderTitle">Ingatlanok</h1>
            </header>

            <div className="filter" id="filter">
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
                    <div className='checkboxContainer'>
                        <label>Wi-Fi: </label>
                        <input type="checkbox" id="wifiCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Kutya hozható: </label>
                        <input type="checkbox" id="petCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Parkolás: </label>
                        <input type="checkbox" id="parkolasCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Medence: </label>
                        <input type="checkbox" id="medenceCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Kert: </label>
                        <input type="checkbox" id="kertCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Légkondícionálás: </label>
                        <input type="checkbox" id="legkondiCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Billiárd: </label>
                        <input type="checkbox" id="billiardCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Ping-pong: </label>
                        <input type="checkbox" id="pingpongCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Akadálymentes: </label>
                        <input type="checkbox" id="akadalymentesCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Baba bútorok: </label>
                        <input type="checkbox" id="babaButorokCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Grill: </label>
                        <input type="checkbox" id="grillCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Horgásztó: </label>
                        <input type="checkbox" id="horgasztoCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Istálló: </label>
                        <input type="checkbox" id="istalloCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Erkély/Terasz: </label>
                        <input type="checkbox" id="erkelyTeraszCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Házimozi: </label>
                        <input type="checkbox" id="hazimoziCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Mosógép: </label>
                        <input type="checkbox" id="mosogepCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Kávéfőző: </label>
                        <input type="checkbox" id="kavefovoCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Takarítószolgálat: </label>
                        <input type="checkbox" id="takaritokCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Biztonsági kamera: </label>
                        <input type="checkbox" id="biztonsagiKameraCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Golfpálya: </label>
                        <input type="checkbox" id="golfpalyCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                    <div className='checkboxContainer'>
                        <label>Spajz: </label>
                        <input type="checkbox" id="spajzCb" className="filterCheckbox" onChange={handleFilterChange} />
                    </div>
                </div>

            </div>

            <div className="gridCards" id="cards">
                {isPending ? (
                    <RiseLoader color='#e09900' loading={isPending} size={15} />
                ) : error ? (
                    <div className="errorMessage">Nem sikerült betölteni az adatokat</div>
                ) : (
                    <div className='kiemeltCards'>
                        {filteredProperties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </div>

            <img src="img/city2.png" className="footerImg" alt="City view" />
            <footer>
                <h3>Elérhetőségek</h3>
            </footer>
        </div>
    );
};

export default Ingatlanok;
