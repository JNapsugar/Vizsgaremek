import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style.css";

const Profil = () => {
    const Navbar = () => (
        <nav className="navbar">
            <Link to="/home" className="navItem">Főoldal</Link>
            <Link to="/ingatlanok" className="navItem">Ingatlanok</Link>
            <Link to="/kiadas" className="navItem">Kiadás</Link>
            <Link to="/rolunk" className="navItem">Rólunk</Link>
            <button className="belepesBtn">
                <Link to="/belepes">Belépés</Link>
            </button>
        </nav>
    );

    const [userData, setUserData] = useState({
        username: "Felhasználónév",
        fullName: "Teljes név",
        email: "xxxxxxxxxxxxxxx",
        phone: "xxxxxxxxxxxxxxx",
        registrationDate: "xxxxxxxxxxxxxxx",
    });

    const [properties, setProperties] = useState([]);

    useEffect(() => {
        axios.get('/userData') 
            .then(res => setUserData(res.data))
            .catch(error => console.error(error));
        
        axios.get('/userProperties') 
            .then(res => setProperties(res.data))
            .catch(error => console.error(error));
    }, []);

    const ProfileHouseCard = ({ image, name, location }) => (
        <div className="profileHouseCard">
            <img src={image} alt="property" />
            <p>{name}<br /><span>{location}</span></p>
            <button>Részletek</button>
        </div>
    );

    return (
        <div>
            <Navbar />
            <header className="smallHeader">
                <div className="headerImages">
                    <img src="img/header1.jpg" className="headerImage active" alt="header" />
                    <img src="img/header2.jpg" className="headerImage" alt="header" />
                    <img src="img/header3.jpg" className="headerImage" alt="header" />
                    <img src="img/header4.jpg" className="headerImage" alt="header" />
                    <img src="img/header5.jpg" className="headerImage" alt="header" />
                </div>
                <h1 className="smallHeaderTitle" id="profileHeaderTitle">Saját profil</h1>
            </header>
            <div className="profileContent">
                <div className="profileSide">
                    <img src="img/placeholder.jpg" className="profilePicture" alt="profile" />
                    <p className="ProfileUsername">{userData.username}</p>
                    <p className="ProfileFullname">{userData.fullName}</p>
                </div>
                <div className="profileDetails">
                    <p className="profileTitle">Meghirdetett ingatlanok</p>
                    <div className="profileHouses">
                        {properties.map((property, index) => (
                            <ProfileHouseCard
                                key={index}
                                image={property.image}
                                name={property.name}
                                location={property.location}
                            />
                        ))}
                    </div>
                    <p className="profileTitle">Adatok</p>
                    <div className="profileData">
                        <p className="profileDataRow">Felhasználónév <span>{userData.username}</span></p>
                        <p className="profileDataRow">Teljes név <span>{userData.fullName}</span></p>
                        <p className="profileDataRow">Email <span>{userData.email}</span></p>
                        <p className="profileDataRow">Jelszó <span>*********</span></p>
                    </div>
                    <button className="logOut">Kijelentkezés</button>
                </div>
            </div>
            <img src="img/city2.png" className="footerImg" alt="footer" />
            <footer>
                <h3>Elérhetőségek</h3>
            </footer>
        </div>
    );
};

export default Profil;
