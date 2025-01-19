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

    const [registrationData, setRegistrationData] = useState({
        loginName: "Felhasználónév",
        email: "felhasználó@domain.com",
        name: "Teljes név",
        password: "********",
    });

    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        if (token && username) {
            axios.get(`https://localhost:7079/api/felhasznalo/me/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(res => setRegistrationData(res.data))
            .catch(error => console.error("Error fetching user data:", error));
        } else {
            console.error("No token or username found");
        }
    }, []);

    const ProfileHouseCard = ({ image, name, location }) => (
        <div className="profileHouseCard">
            <img src={image} alt="property" />
            <p>{name}<br /><span>{location}</span></p>
            <button>Részletek</button>
        </div>
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/belepes";
    };

    const handleDeleteAccount = () => {
        const confirmation = window.confirm("Biztosan törölni szeretnéd a fiókodat? Ez visszafordíthatatlan művelet.");
    
        if (confirmation) {
            const token = localStorage.getItem("token");
            const username = localStorage.getItem("username");
    
            if (token && username) {
                axios.delete(`https://localhost:7079/api/Felhasznalo/delete/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    window.location.href = "/belepes"; 
                })
                .catch(error => {
                    console.error("Hiba történt a fiók törlésekor:", error);
                    alert("Hiba történt a fiók törlésekor.");
                });
            } else {
                alert("Nem található a felhasználói adatok, kérlek jelentkezz be.");
            }
        }
    };
    

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
                    <p className="ProfileUsername">{registrationData.loginName}</p>
                    <p className="ProfileFullname">{registrationData.name}</p>
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
                        <p className="profileDataRow">Felhasználónév <span>{registrationData.loginNev}</span></p>
                        <p className="profileDataRow">Teljes név <span>{registrationData.name}</span></p>
                        <p className="profileDataRow">Email <span>{registrationData.email}</span></p>
                        <p className="profileDataRow">Jelszó <span>*********</span></p>
                    </div>
                    <button className="logOut" onClick={handleLogout}>Kijelentkezés</button>
                    <button className="logOut" onClick={handleDeleteAccount}>Fiók törlése</button> 
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
