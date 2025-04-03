import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomeHeader = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    //Header képek
    const images = [
        "../../img/headers/header1.jpg",
        "../../img/headers/header2.jpg",
        "../../img/headers/header3.jpg",
        "../../img/headers/header4.jpg",
        "../../img/headers/header5.jpg"
    ];

    //Header képek váltakozása
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
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
    );
};

export default HomeHeader;