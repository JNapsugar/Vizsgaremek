import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../style.css';
import Navbar from '../Components/Navbar';
import SmallHeader from '../Components/SmallHeader';
import PropertyCard from '../Components/PropertyCard';
import PropertyListItem from '../Components/PropertyListItem';
import Footer from "../Components/Footer";
import { RiseLoader } from 'react-spinners';
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const Ingatlanok = () => {    
    const [properties, setProperties] = useState([]);
    const [propertyImages, setPropertyImages] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [isPending, setPending] = useState(false);
    const [error, setError] = useState(false);
    const [searchParams] = useSearchParams();
    const cityName = searchParams.get("city") || "Összes";
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [isListDisabled, setIsListDisabled] = useState(window.innerWidth < 1300);
    const [filters, setFilters] = useState({
        megye: "Összes",
        helyszin: cityName,
        szoba: "Mindegy",
        rendezes: "Mindegy",
        nezet: window.innerWidth < 1300 ? "grid" : "list",
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
        garazsCb: false,
        erkelyTeraszCb: false,
        hazimoziCb: false,
        mosogepCb: false,
        kavefozoCb: false,
        takaritokCb: false,
        biztonsagiKameraCb: false,
        golfpalyaCb: false,
        spajzCb: false
    });

    useEffect(() => {
        setPending(true);
        axios.get('https://localhost:7079/api/Telepules/telepulesek')
            .then(res => {setLocations(res.data); setFilteredLocations(res.data)})
            .catch(error => { console.error(error); setError(true); })
            .finally(() => setPending(false));
    }, []);
    const counties = Array.from(new Set(locations.map(location => location.megye)));
    const toggleFilter = () => {
        setIsFilterExpanded(!isFilterExpanded);
    };
    
    const handleFilterChange = useCallback((e) => {
        const { id, value, type, checked } = e.target;
        
        setFilters(prevFilters => {
            switch (id) {
                case "helyszin":
                    const selectedCity = locations.find(location => location.nev === value);
                    return {
                        ...prevFilters,
                        helyszin: value,
                        megye: selectedCity ? selectedCity.megye : prevFilters.megye
                    };
                case "megye":
                    document.getElementById("helyszin").value = "Összes";
                    setFilteredLocations(
                        value === "Összes" ? locations : locations.filter(location => location.megye === value)
                    );
                    return {
                        ...prevFilters,
                        megye: value,
                        helyszin: "Összes"
                    };
                case "rendezes":
                    const orderBy = value.split('-')[0];
                    if (value.split('-')[1] === "asc") {
                        setProperties(prevProperties =>
                            [...prevProperties].sort((a, b) => a[orderBy] - b[orderBy])
                        );
                    } else if (value.split('-')[1] === "desc") {
                        setProperties(prevProperties =>
                            [...prevProperties].sort((a, b) => b[orderBy] - a[orderBy])
                        );
                    }
                    return { ...prevFilters, rendezes: value };
                case "nezet":
                    return { ...prevFilters, nezet: value };
                default:
                    return { ...prevFilters, [id]: type === "checkbox" ? checked : value };
            }
        });
    }, [locations]);

    useEffect(() => {
        if (cityName !== "Összes") {
            handleFilterChange({ 
                target: { id: "helyszin", value: cityName } 
            });
        }
    }, [cityName, locations, handleFilterChange]);

    const filteredProperties = properties.filter(property => {;
        return (
            (filters.megye === "Összes" || filteredLocations.some(location => location.nev === property.helyszin)) &&
            (filters.helyszin === "Összes" || property.helyszin === filters.helyszin) &&
            (filters.szoba === "Mindegy" || (filters.szoba === "Több mint 5" ? property.szoba > 5 : property.szoba === parseInt(filters.szoba))) &&
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
            (!filters.horgasztoCb || property.szolgaltatasok.includes("horgásztó")) &&
            (!filters.garazsCb || property.szolgaltatasok.includes("garázs")) &&
            (!filters.erkelyTeraszCb || property.szolgaltatasok.includes("erkély/terasz")) &&
            (!filters.hazimoziCb || property.szolgaltatasok.includes("házi mozi")) &&
            (!filters.mosogepCb || property.szolgaltatasok.includes("mosógép")) &&
            (!filters.kavefozoCb || property.szolgaltatasok.includes("kávéfőző")) &&
            (!filters.takaritokCb || property.szolgaltatasok.includes("takarító szolgálat")) &&
            (!filters.biztonsagiKameraCb || property.szolgaltatasok.includes("biztonsági kamera")) &&
            (!filters.golfpalyaCb || property.szolgaltatasok.includes("golfpálya"))
        );
    });

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1300) {
                setFilters(prevFilters => ({ ...prevFilters, nezet: "grid" }));
                setIsListDisabled(true);
            } else {
                setIsListDisabled(false);
            }
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setPending(true);
        axios.get('https://localhost:7079/api/Ingatlan/ingatlanok')
            .then(res => setProperties(res.data))
            .catch(error => { console.error(error); setError(true); })
            .finally(() => setPending(false));
    }, []);

    useEffect(() => {
        setPending(true);
        axios.get('https://localhost:7079/api/Ingatlankepek/ingatlankepek')
            .then(res => setPropertyImages(res.data))
            .catch(error => { console.error(error); setError(true); })
            .finally(() => setPending(false));
    }, []);

    const Checkbox = ({ id, label}) => {
        return (
            <div className='checkboxContainer'>
                <label>{label}: </label>
                <input type="checkbox" id={id} className="filterCheckbox" onChange={handleFilterChange} checked={filters[id]} />
            </div>
        );
    };   
    
    return (
        <div>
        <Navbar />
        <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}>
            <SmallHeader title="Ingatlanok" />
            <div className="filter" id="filter">
                <div className="filterRow">
                    <div className="filterSelectContainer">
                        <label>Megye</label>
                        <select id="megye" className="filterSelect" onChange={handleFilterChange} value={filters.megye}>
                            <option>Összes</option>
                            {counties.map((countie, index) => (
                                <option key={index} value={countie}>{countie}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filterSelectContainer">
                        <label>Város</label>
                        <select id="helyszin" className="filterSelect" onChange={handleFilterChange} value={filters.helyszin}>
                            <option>Összes</option>
                            { filteredLocations.map((location, index) => (
                                    <option key={index} value={location.nev}>{location.nev}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filterSelectContainer">
                        <label>Szobák</label>
                        <select id="szoba" className="filterSelect" onChange={handleFilterChange}>
                            <option>Mindegy</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>Több mint 5</option>
                        </select>
                    </div>
                    <div className="filterSelectContainer">
                        <label>Rendezés</label>
                        <select id="rendezes" className="filterSelect" onChange={handleFilterChange}>
                            <option>Mindegy</option>
                            <option value={"ar-asc"}>Ár szerint növekvő</option>
                            <option value={"ar-desc"}>Ár szerint csökkenő</option>
                            <option value={"meret-asc"}>Méret szerint növekvő</option>
                            <option value={"meret-desc"}>Méret szerint csökkenő</option>
                            <option value={"szoba-asc"}>Szobaszám szerint növekvő</option>
                            <option value={"szoba-desc"}>Szobaszám szerint csökkenő</option>
                        </select>
                    </div>
                    <div className="showMoreFilter" id="showMoreFilter" onClick={toggleFilter}>
                        {isFilterExpanded ? 'Kevesebb▲' : 'További▼'}
                    </div>
                    <div className='viewBtnContainer'>
                        <div className='viewBtn' onClick={() => handleFilterChange({ target: { id: 'nezet', value: 'grid' } })}>
                            <img src="./img/icons/grid.png" alt="grid" />
                        </div>
                        <div className={`viewBtn ${isListDisabled ? 'disabled' : ''}`} 
                            onClick={!isListDisabled ? () => handleFilterChange({ target: { id: 'nezet', value: 'list' } }) : null}
                            title={isListDisabled ? "A lista nézet csak nagyobb képernyőkön elérhető" : ""}>
                            <img src="./img/icons/list.png" alt="list" style={{ opacity: isListDisabled ? 0.5 : 1 }} />
                        </div>
                    </div>
                </div>

                <div className={`filterRow filterMore ${isFilterExpanded ? 'expanded' : ''}`} id="filterMore">
                    <Checkbox id="wifiCb" label="Wi-Fi" />
                    <Checkbox id="petCb" label="Kutya hozható" />
                    <Checkbox id="parkolasCb" label="Parkolás" />
                    <Checkbox id="medenceCb" label="Medence" />
                    <Checkbox id="kertCb" label="Kert"/>
                    <Checkbox id="legkondiCb" label="Légkondícionálás"/>
                    <Checkbox id="billiardCb" label="Billiárd"/>
                    <Checkbox id="pingpongCb" label="Ping-pong"/>
                    <Checkbox id="akadalymentesCb" label="Akadálymentes"/>
                    <Checkbox id="babaButorokCb" label="Baba bútorok"/>
                    <Checkbox id="grillCb" label="Grill"/>
                    <Checkbox id="horgasztoCb" label="Horgásztó" />
                    <Checkbox id="garazsCb" label="Garázs"  />
                    <Checkbox id="erkelyTeraszCb" label="Erkély/Terasz"/>
                    <Checkbox id="hazimoziCb" label="Házi mozi" />
                    <Checkbox id="mosogepCb" label="Mosógép" />
                    <Checkbox id="kavefozoCb" label="Kávéfőző" />
                    <Checkbox id="takaritokCb" label="Takarító szolgálat"  />
                    <Checkbox id="biztonsagiKameraCb" label="Biztonsági kamera"/>
                    <Checkbox id="golfpalyaCb" label="Golfpálya"  />
                    <Checkbox id="spajzCb" label="Spajz"  />
                </div>
            </div>

            <div className="cardContainer" id="cards">
                {isPending ? (
                    <RiseLoader color='#e09900' loading={isPending} size={15} />
                ) : error ? (
                    <div className="errorMessage">
                        Nem sikerült betölteni az adatokat
                        <img src="img/errordog.gif" alt="hiba"/>
                    </div>
                ) : (
                    filteredProperties.length===0? (
                        <div className="errorMessage">
                            Nem található ilyen ingatlan
                            <img src="img/errordog.gif" alt="hiba"/>
                        </div>
                        
                    ) : (
                        <div className='cardContainer'>
                            {filteredProperties.map((property, index) => {
                                let propertyImg = propertyImages.find(img => img.ingatlanId === property.ingatlanId);
                                return filters.nezet === "grid" ? (
                                <PropertyCard
                                    key={property.IngatlanId ? property.IngatlanId : `key-${index}`}
                                    property={property}
                                    propertyImg={propertyImg}
                                />
                                ) : (
                                <PropertyListItem
                                    key={property.IngatlanId ? property.IngatlanId : `key-${index}`}
                                    property={property}
                                    propertyImg={propertyImg}
                                />
                                );
                            })}
                        </div>
                        )
                )}
            </div>

            <img src="img/city2.png" className="footerImg" alt="City view" />
            <Footer />
        </motion.div>
        </div>
    );
};

export default Ingatlanok;
