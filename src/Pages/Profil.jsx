import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from '../Components/Navbar';
import "../style.css";

const Profil = () => {
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

    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [registrationData, setRegistrationData] = useState({
        loginNev: "Felhasználónév",
        email: "felhasználó@domain.com",
        name: "Teljes név",
        PermissionId: 0
    });
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        if (token && username) {
            setIsLoggedIn(true);
            axios
                .get(`https://localhost:7079/api/felhasznalo/me/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    setRegistrationData(res.data);
                    if (res.data.PermissionId === 2 || res.data.PermissionId === 3) {   
                        axios
                            .get(`https://localhost:7079/api/Ingatlan/ingatlanok`, {
                                headers: { Authorization: `Bearer ${token}` },
                            })
                            .then((response) => setProperties(response.data))
                            .catch((error) => console.error("Error fetching properties:", error));
                    }
                })
                .catch((error) => console.error("Error fetching user data:", error));
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
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        
        if (token && username) {
            axios.post(`https://localhost:7079/api/Felhasznalo/logout/`,{ LoginNev: username }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                setIsLoggedIn(false);
                window.location.href = "/belepes";
            })
            .catch(error => {
                console.error("Hiba történt a kijelentkezés során:", error);
                alert("Hiba történt a kijelentkezés során.");
            });
        } else {
            alert("Nem található a felhasználói adatok, kérlek jelentkezz be.");
        }
    };

    const handleDeleteAccount = () => {
        const confirmation = window.confirm("Biztosan törölni szeretnéd a fiókodat? Ez visszafordíthatatlan művelet.");
        if (confirmation) {
            const token = localStorage.getItem("token");
            const username = localStorage.getItem("username");
            if (token && username) {
                axios.delete(`https://localhost:7079/api/Felhasznalo/delete/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    setIsLoggedIn(false);
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
                    {images.map((image, index) => (
                        <img key={index} src={image} className={`headerImage ${index === activeIndex ? 'active' : ''}`} alt={`Header ${index + 1}`} />
                    ))}
                </div>
                <h1 className="smallHeaderTitle" id="profileHeaderTitle">Saját profil</h1>
            </header>
            <div className="profileContent">
                <div className="profileSide">
                    <img src="img/placeholder.jpg" className="profilePicture" alt="profile" />
                    <p className="ProfileUsername">{registrationData.loginNev}</p>
                    <p className="ProfileFullname">{registrationData.name}</p>
                </div>
                <div className="profileDetails">
                    {registrationData.PermissionId === 2 && (
                        <>
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
                        </>
                    )}
                    <p className="profileTitle">Adatok</p>
                    <div className="profileData">
                        <p className="profileDataRow">Felhasználónév <span>{registrationData.loginNev}</span></p>
                        <p className="profileDataRow">Teljes név <span>{registrationData.name}</span></p>
                        <p className="profileDataRow">Email <span>{registrationData.email}</span></p>
                        <p className="profileDataRow">Jelszó <span>*********</span></p>
                    </div>
                    <Link to="/profil-modositas"><button className="ProfileEditBtn">Adatok módosítása</button></Link>
                    <button className="profileRedBtn" onClick={handleLogout}>Kijelentkezés</button>
                    <button className="profileRedBtn" onClick={handleDeleteAccount}>Fiók törlése</button>    
                </div>
            </div>
        </div>
    );
};

export default Profil;
