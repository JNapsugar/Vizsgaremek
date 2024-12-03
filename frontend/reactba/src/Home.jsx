import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {useParams, useNavigate, Link} from "react-router-dom";
import "./style.css";

function Home() {
return (
    <div>
        <nav className="navbar">
            <a href="home.html" className="navItem">Főoldal</a>
            <a href="ingatlanok.html" className="navItem">Ingatlanok</a>
            <a href="" className="navItem">Kiadás</a>
            <a href="" className="navItem">Rólunk</a>
            <button className="belepesBtn">
                <Link to="/belepes" className="belepesLink">Belépés</Link>
            </button>
        </nav>

    <header className="header">
        <div className="headerImages">
            <img src="img/header1.jpg" className="headerImage active" alt="header1" />
            <img src="img/header2.jpg" className="headerImage" alt="header2" />
            <img src="img/header3.jpg" className="headerImage" alt="header3" />
            <img src="img/header4.jpg" className="headerImage" alt="header4" />
            <img src="img/header5.jpg" className="headerImage" alt="header5" />
        </div>
        <div className="headerContent">
            <h1 className="headerTitle">Rentify</h1>
            <p className="headerText">
                Üdvözöljük a Rentify oldalán, ahol az ideális ingatlan megtalálása egyszerű és problémamentes. Fedezze fel változatos ingatlankínálatunkat, amelyek az Ön igényeire és életstílusára szabottak. Kezdje meg az utat következő otthona felé még ma!
            </p>
            <a href="ingatlanok.html" className="headerBtn">INGATLAN KERESÉSE</a>
        </div>
    </header>

    <div className="homeContent">
        <section className="citySection">
            <h2 className="sectionTitle">Népszerű városok vagy valami ilyesmi</h2>
            <div className="cityCards">
                {["Budapest", "Budapesti ingatlanok", "Budapesti ingatlanok", "Budapesti ingatlanok", "Budapesti ingatlanok", "Budapesti ingatlanok"].map((title, index) => (
                <div key={index} className="cityCard">
                <img src="img/budapest.jpg" alt={title} />
                <div className="cityCardContent">
                    <p className="cityCardTitle">Valami</p>
                    <p className="cityCardDescription">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus sapiente a nesciunt eum dolorum modi fugit numquam recusandae libero tempore! Expedita placeat quasi sunt alias nam ullam tempora provident ipsum?
                    </p>
                <button>{title} megtekintése</button>
                </div>
            </div>
            ))}
        </div>
        </section>

        <img src="img/city.png" className="cityImg" alt="city" />

        <section className="kiemeltSection">
            <h2 className="sectionTitle">Kiemelt ingatlanok</h2>
            <div className="kiemeltCards">
                {["Helyszin", "Helyszin", "Helyszin", "Helyszin", "Helyszin", "Helyszin"].map((location, index) => (
                <div key={index} className="card">
                    <img src="img/budapest.jpg" alt={location} />
                    <div className="card-content">
                        <h2>{location} <span className="price">ft/ejszaka</span></h2>
                        <div className="TovabbiInformaciok">
                            <p>Szobák száma<br />még valamik</p>
                        </div>
                        <br />
                        <button>További információk</button>
                    </div>
                </div>
            ))}
        </div>
        <button className="moreBtn">További ingatlanok</button>
        <img src="img/city2.png" className="footerImg" alt="city2" />
        </section>
    </div>

    <footer>
        <h3>Elérhetőségek</h3>
    </footer>
    </div>
);
}

export default Home;
