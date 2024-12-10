import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import './style.css';

const App = () => {
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

    const[houses,setHouses] = useState([]);
    const[isPending, setPending] = useState(false);
    
    useEffect(() => {
        setPending(true);
        axios.get('')
        .then(res => setHouses(res.data))
        .catch(error => console.log(error))
        .finally(() => setPending(false));
    }, []);

    return (
        <div className="App">
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

            <div className="filter" id="filter" style={{ height: isFilterExpanded ? '18rem' : '9rem' }}>
                <div className="filterRow">
                    <div className="filterSelectContainer">
                        <label>Ország</label>
                        <select className="filterSelect">
                            <option>Összes</option>
                            <option>valami</option>
                        </select>
                    </div>
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
                    <input type="checkbox" id="wifiCb" className="filterCheckbox" />
                </div>
            </div>

            <div className="gridCards" id="cards">
            {isPending ? (
                <div className="spinner-border"></div>
            ) : (
                <div>
                {houses.map((house, index) => (
                    <div key={index} className="card">
                        <img src="img/placeholder.jpg" alt={house.location} />
                        <div className="card-content">
                            <h2>{house.location} <span className="price">{house.price}</span></h2>
                            <div className="TovabbiInformaciok">
                                <p>{house.rooms}<br />{house.services}</p>
                            </div>
                            <button>További információk</button>
                        </div>
                    </div>
                ))}</div>)}
            </div>

            <img src="img/city2.png" className="footerImg" alt="City view" />
            <footer>
                <h3>Elérhetőségek</h3>
            </footer>
        </div>
    );
}

export default App;
