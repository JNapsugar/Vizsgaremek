import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from '../Components/Navbar';
import Footer from "../Components/Footer";
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
    const [propertyImages, setPropertyImages] = useState([]);
    const [isEditView, setIsEditView] = useState(false); 

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
                })
                .catch((error) => console.error("Hiba az adatok betöltésekor:", error));
        } else {
            console.error("Hibás felhasználó");
        }
    }, []);
    
    useEffect(() => {
        if (registrationData.permissionId === 2 || registrationData.permissionId === 3) {
            const token = localStorage.getItem("token");     
            axios .get(`https://localhost:7079/api/Ingatlan/ingatlanok`, {
                    headers: { Authorization: `Bearer ${token}` }, })
                .then((response) => {
                    const filteredProperties = response.data.filter(property => property.tulajdonosId === registrationData.id);
                    setProperties(filteredProperties);
                })
                .catch((error) => console.error("Hiba az ingatlanok betöltésekor:", error));

                axios .get(`https://localhost:7079/api/Ingatlankepek/ingatlankepek`, {
                    headers: { Authorization: `Bearer ${token}` }, })
                .then((response) => {setPropertyImages(response.data);})
                .catch((error) => console.error("Hiba az ingatlanok betöltésekor:", error));
        }
    }, [registrationData.id]);
    

    const ProfilePropertyCard = ({ id, kep, cim, location }) => (
        <div className="profilePropertyCard">
            <img src={kep} alt="property" />
            <p>{location}<br /><span>{cim}</span></p>
            <div className="buttonContainer">
                <button>
                    <Link to={"/ingatlanok/" + id}>Részletek</Link>
                </button>
                <button>
                    <Link to={"/ingatlanKezeles/" + id}>Kezelés</Link>
                </button>
            </div>
        </div>
    );


    const handleSave = () => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
    
        if (token && username) {
            console.log(registrationData);
            axios
                .put(`https://localhost:7079/api/Felhasznalo/${username}`, registrationData, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setIsEditView(false);
                })
                .catch((error) => {
                    console.error("Hiba a profil mentésekor:", error);
                    alert("Hiba történt a profil mentésekor.");
                });
        } else {
            alert("Nem található a felhasználói adatok, kérlek jelentkezz be.");
        }
    };
    

    const handleLogout = () => {
        const token = localStorage.getItem("token");
        const username = registrationData.loginNev;
        
        if (token && username) {
            axios.post(`https://localhost:7079/api/Felhasznalo/logout/`,{ LoginNev: username }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                sessionStorage.removeItem("permission");
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
                    <img 
                        src={registrationData.ProfilePicturePath ? registrationData.ProfilePicturePath : "/img/defaultPfp.jpg"} 
                        className="profilePicture" alt="Uploader" loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/img/defaultPfp.jpg"; }}
                    />
                    <p className="ProfileUsername">{registrationData.loginNev}</p>
                    <p className="ProfileFullname">{registrationData.name}</p>
                </div>
                <div className="profileDetails">
                {registrationData.permissionId === 2 && (
                    <>
                        <p className="profileTitle">Meghirdetett ingatlanok</p>
                        <div className="profileProperties">
                        {properties.length > 0 ? (
                                properties.map((property, index) => {
                                    let propertyImg = propertyImages.find(img => img.ingatlanId === property.ingatlanId);
                                    const imageSrc = propertyImg ? propertyImg.kepUrl : "img/placeholder.jpg"; 
                                    return (
                                        <ProfilePropertyCard
                                            key={index}
                                            id={property.ingatlanId}
                                            kep={imageSrc}
                                            cim={property.cim}
                                            location={property.helyszin}
                                        />
                                    );
                                })
                            ) : (
                                <div className="errorMessage">
                                    Nincsenek feltöltött ingatlanok
                                    <img src="img/errordog.gif" alt="hiba" width={170}/>
                                </div>
                                
                            )}
                        </div>
                    </>
                )}

                    <p className="profileTitle">Adatok</p>
                    {isEditView? <div className="profileData">
                        <p className="profileDataRow">Felhasználónév
                            <input type="text" value={registrationData.loginNev} onChange={(e) => setRegistrationData({ ...registrationData, loginNev: e.target.value })} />
                        </p>
                        <p className="profileDataRow">Teljes név
                            <input type="text" value={registrationData.name} onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })} />
                        </p>
                        <p className="profileDataRow">Email
                            <input type="text" value={registrationData.email} onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })} />
                        </p>
                        <p className="profileDataRow">Jelszó
                            <input type="password" value={registrationData.password} onChange={(e) => setRegistrationData({ ...registrationData, password: e.target.value })} />
                        </p>
                    </div>
                    :
                    <div className="profileData">
                        <p className="profileDataRow">Felhasználónév<span>{registrationData.loginNev}</span></p>
                        <p className="profileDataRow">Teljes név <span>{registrationData.name}</span></p>
                        <p className="profileDataRow">Email <span>{registrationData.email}</span></p>
                        <p className="profileDataRow">Jelszó <span>*********</span></p>
                    </div>}
                    {isEditView?
                    <button className="ProfileEditBtn" onClick={handleSave}>Mentés</button> : 
                    <button className="ProfileEditBtn" onClick={() => setIsEditView(true)}>Adatok módosítása</button> }
                    <button className="profileRedBtn" onClick={handleLogout}>Kijelentkezés</button>
                    <button className="profileRedBtn" onClick={handleDeleteAccount}>Fiók törlése</button>    
                </div>
            </div>
            <img src="/img/city2.png" className="footerImg" alt="City View" />
            <Footer />
        </div>
    );
};

export default Profil;
