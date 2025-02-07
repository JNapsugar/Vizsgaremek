import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style.css';
import Navbar from '../Components/Navbar';
import PropertyCard from '../Components/PropertyCard';
import PropertyListItem from '../Components/PropertyListItem';
import { RiseLoader } from 'react-spinners';

const Ingatlanok = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [
        "img/headers/header1.jpg",
        "img/headers/header2.jpg",
        "img/headers/header3.jpg",
        "img/headers/header4.jpg",
        "img/headers/header5.jpg"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    const [properties, setProperties] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [isPending, setPending] = useState(false);
    const [error, setError] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [filters, setFilters] = useState({
        megye: "Összes",
        helyszin: "Összes",
        szoba: "Mindegy",
        rendezes: "Mindegy",
        nezet: "grid",
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

    const handleFilterChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFilters({ ...filters, [id]: type === "checkbox" ? checked : value });
        switch (id) {
            case "helyszin":
                const selectedCity = locations.find(location => location.nev === value);
                if (selectedCity) {
                    setFilters(prevFilters => ({ ...prevFilters, megye: selectedCity.megye }));
                    document.getElementById("megye").value = selectedCity.megye;}
                break;
            case "megye":
                value === "Összes"? setFilteredLocations(locations) : setFilteredLocations(locations.filter(location => location.megye === value))
                break;
            case "rendezes":
                    const orderBy = value.split('-')[0]
                    if (value.split('-')[1] === "asc") {
                        setProperties(prevProperties => {
                            return [...prevProperties].sort((a, b) => a[orderBy] - b[orderBy])
                        });
                    } else if (value.split('-')[1] === "desc") {
                        setProperties(prevProperties => {
                            return [...prevProperties].sort((a, b) => b[orderBy] - a[orderBy])
                        })
                    }
                break;  
            case "nezet":
                    filters.nezet = value;
                break;
        };
    };

    const filteredProperties = properties.filter(property => {;
        return (
            (filters.megye === "Összes" || filteredLocations.some(location => location.nev === property.helyszin)) &&
            (filters.helyszin === "Összes" || property.helyszin === filters.helyszin) &&
            (filters.szoba === "Mindegy" || ((property.szoba <= 5) ? (property.szoba == filters.szoba) : (filters.szoba === "Több mint 5"))) &&
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
    
    const Checkbox = ({ id, label}) => {
        return (
            <div className='checkboxContainer'>
                <label >{label}: </label>
                <input type="checkbox" id={id} className="filterCheckbox" onChange={handleFilterChange} />
            </div>
        );
    };

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
                            {counties.map((countie, index) => (
                                <option key={index} value={countie}>{countie}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filterSelectContainer">
                        <label>Város</label>
                        <select id="helyszin" className="filterSelect" onChange={handleFilterChange}>
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
                        <div className='viewBtn' onClick={() => handleFilterChange({ target: { id: 'nezet', value: 'grid' } })}><img src="./img/icons/grid.png" alt="grid" /></div>
                        <div className='viewBtn' onClick={() => handleFilterChange({ target: { id: 'nezet', value: 'list' } })}><img src="./img/icons/list.png" alt="list" /></div>
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
                    <Checkbox id="istalloCb" label="Istálló"  />
                    <Checkbox id="erkelyTeraszCb" label="Erkély/Terasz"/>
                    <Checkbox id="hazimoziCb" label="Házimozi" />
                    <Checkbox id="mosogepCb" label="Mosógép" />
                    <Checkbox id="kavefozoCb" label="Kávéfőző" />
                    <Checkbox id="takaritokCb" label="Takarítószolgálat"  />
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
                        <img src="img/errordog.gif" />
                    </div>
                ) : (
                    filteredProperties.length==0? (
                        <div className="errorMessage">
                            Nem található ilyen ingatlan
                            <img src="img/errordog.gif" />
                        </div>
                        
                    ) : (
                        <div className='cardContainer'>
                            {filteredProperties.map((property) => (
                                filters.nezet === "grid"? 
                                <PropertyCard key={property.id} property={property} /> :
                                <PropertyListItem key={property.id} property={property} />
                        ))}
                        </div>
                        )
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
