import React, { useState, useEffect } from 'react';
import '../style.css';
import Navbar from '../Components/Navbar';
import Footer from "../Components/Footer";


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

            
            <img src="img/city2.png" className="footerImg" alt="City view" />
            <Footer />
        </div>
    );
};

export default Ingatlanok;
