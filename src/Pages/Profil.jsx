import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../Components/Navbar';
import SmallHeader from "../Components/SmallHeader";
import Footer from "../Components/Footer";
import "../style.css";
import { motion } from "framer-motion";

const Profil = () => {
    const navigate = useNavigate();
    const [registrationData, setRegistrationData] = useState({
        loginNev: "Felhasználónév",
        email: "felhasználó@domain.com",
        name: "Teljes név",
        PermissionId: 0,
        profilePicturePath: "",
    });
    const userId = sessionStorage.getItem("userId");
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [propertyImages, setPropertyImages] = useState([]);
    const [isEditView, setIsEditView] = useState(false); 

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const username = sessionStorage.getItem("username");
    
        if (token && username) {
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
        const token = sessionStorage.getItem("token");
        if (registrationData.permissionId === 2 || registrationData.permissionId === 1) {
            axios.get(`https://localhost:7079/api/Ingatlan/ingatlanok`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const filteredProperties = response.data.filter(property => property.tulajdonosId === registrationData.id);
                setProperties(filteredProperties);
            })
            .catch((error) => console.error("Hiba az ingatlanok betöltésekor:", error));

            axios.get(`https://localhost:7079/api/Ingatlankepek/ingatlankepek`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => { setPropertyImages(response.data); })
            .catch((error) => console.error("Hiba az ingatlan képek betöltésekor:", error));
        }
        if (registrationData.permissionId === 3 || registrationData.permissionId === 1) {
            axios.get(registrationData.permissionId === 3?
                `https://localhost:7079/api/Foglalasok/user/${userId}`:
                `https://localhost:7079/api/Foglalasok/allBookings`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => { setBookings(response.data); })
            .catch((error) => console.error("Hiba a foglalások betöltésekor:", error));

            axios.get(`https://localhost:7079/api/Ingatlan/ingatlanok`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => { setProperties(response.data); })
            .catch((error) => console.error("Hiba az ingatlanok betöltésekor:", error));

            axios.get(`https://localhost:7079/api/Ingatlankepek/ingatlankepek`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => { setPropertyImages(response.data); })
            .catch((error) => console.error("Hiba az ingatlan képek betöltésekor:", error));
        }
    }, [registrationData.id, registrationData.permissionId, userId]);

    const ProfilePropertyCard = ({ id, kep, cim, helyszin }) => (
        <div className="profilePropertyCard">
            <img src={kep} alt="property" />
            <p>{helyszin}<br /><span>{cim}</span></p>
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
    const ProfileBookingCard = ({ id, kep, helyszin, kezdesDatum, befejezesDatum, allapot, ingatlanId }) => (
        <div className="profileBookingCard">
            <img src={kep} alt="property" />
            <p>{helyszin}<br /><span>{allapot}</span></p>
            <div className="bookingDatesContainer">
                <p>Kezdés: {new Date(kezdesDatum).toLocaleDateString()}</p>
                <p>Befejezés: {new Date(befejezesDatum).toLocaleDateString()}</p>
            </div>
            <div className="buttonContainer">
                <button>
                    <Link to={"/ingatlanok/" + ingatlanId}>Részletek</Link>
                </button>
                <button onClick={() => handleDeleteBooking(id)}>
                    Foglalás törlése
                </button>
            </div>
        </div>
    );

    const handleDeleteBooking = (id) => {
        const confirmation = window.confirm("Biztosan törölni szeretnéd a foglalást?");
        if (confirmation) {
            const token = sessionStorage.getItem("token");
            const username = sessionStorage.getItem("username");
            if (token && username) {
                axios.delete(`https://localhost:7079/api/Foglalasok/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    const newBookings = bookings.filter(booking => booking.foglalasId !== id);
                    setBookings(newBookings);
                })
                .catch(error => {
                    console.error("Hiba történt a foglalás törlésekor:", error);
                    alert("Hiba történt a foglalás törlésekor.");
                });
            } else {
                alert("Nem található a felhasználói adatok, kérlek jelentkezz be.");
            }
        }
    }

    const handleSave = () => {
        const token = sessionStorage.getItem("token");
        const username = sessionStorage.getItem("username");
        const userId = sessionStorage.getItem("userId");
    
        if (!token || !username) {
            alert("Nem található a felhasználói adatok, kérlek jelentkezz be.");
            return;
        }
    
        const uploadImage = async () => {
            try {
                if (!registrationData.profilePicturePath || !(registrationData.profilePicturePath instanceof File)) {
                    return `http://images.ingatlanok.nhely.hu/${userId}pfp.png`;
                }
    
                const file = registrationData.profilePicturePath;
                const renamedFile = new File([file], `${userId}pfp.png`, { type: file.type });
    
                const formData = new FormData();
                formData.append("file", renamedFile);
    
                const fileUploadResponse = await axios.post(
                    'https://localhost:7079/api/FileUpload/FtpServer',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        }
                    }
                );
    
                const newProfilePicturePath = fileUploadResponse.data;
                return newProfilePicturePath;
    
            } catch (error) {
                console.error("Hiba történt a kép feltöltésekor:", error);
                throw new Error("Hiba történt a kép feltöltésekor.");
            }
        };
    
        uploadImage()
            .then(async (newProfilePicturePath) => {
                const updatedData = { 
                    ...registrationData, 
                    profilePicturePath: `http://images.ingatlanok.nhely.hu/${userId}pfp.png`
                };
    
                await axios.put(`https://localhost:7079/api/Felhasznalo/${userId}`, updatedData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                setIsEditView(false);
                sessionStorage.setItem("username", registrationData.loginNev);
            })
            .catch((error) => {
                console.error("Hiba a profil mentésekor:", error);
                alert("Hiba történt a profil mentésekor.");
            });
    };        
    
    const handleLogout = () => {
        const token = sessionStorage.getItem("token");
        const username = registrationData.loginNev;
        
        if (token && username) {
            axios.post(`https://localhost:7079/api/Felhasznalo/logout/`, { LoginNev: username }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("username");
                sessionStorage.removeItem("permission");
                navigate("/belepes");
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
            const token = sessionStorage.getItem("token");
            const username = sessionStorage.getItem("username");
            if (token && username) {
                axios.delete(`https://localhost:7079/api/Felhasznalo/delete/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("username");
                    navigate("/belepes");
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
            <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}>
            <SmallHeader title="Saját profil" />
            <div className="profileContent">
                <div className="profileSide">
                    <img 
                        src={registrationData.profilePicturePath ? registrationData.profilePicturePath : "/img/defaultPfp.jpg"}
                        className="profilePicture" alt="profilePicture" loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/img/defaultPfp.jpg"; }}
                    />
                    <p className="ProfileUsername">{registrationData.loginNev}</p>
                    <p className="ProfileFullname">{registrationData.name}</p>
                </div>
                <div className="profileDetails">
                {(registrationData.permissionId === 2 || registrationData.permissionId === 1 )&& (
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
                                            helyszin={property.helyszin}
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
                {(registrationData.permissionId === 3 || registrationData.permissionId === 1) && (
                    <>
                        <p className="profileTitle">Foglalások</p>
                        <div className="profileProperties">
                        {bookings.length > 0 ? (
                            bookings.map((booking, index) => {
                                let property = properties.find(property => property.ingatlanId === booking.ingatlanId);
                                if (!property) return null;
                                let propertyImg = propertyImages.find(img => img.ingatlanId === property.ingatlanId);
                                const imageSrc = propertyImg ? propertyImg.kepUrl : "img/placeholder.jpg"; 
                                
                                return (
                                    <ProfileBookingCard
                                        key={index}
                                        id={booking.foglalasId}
                                        kep={imageSrc}
                                        helyszin={property.helyszin}
                                        kezdesDatum={booking.kezdesDatum}
                                        befejezesDatum={booking.befejezesDatum}
                                        allapot={booking.allapot}
                                        ingatlanId={booking.ingatlanId}
                                    />
                                );
                            })
                        ) : (
                            <div className="errorMessage">
                                Nincsenek foglalások
                                <img src="img/errordog.gif" alt="hiba" width={170} />
                            </div>
                        )}
                        </div>
                    </>
                )}

                    <p className="profileTitle">Adatok</p>
                    {isEditView ? (
                    <div className="profileData">
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
                        <p className="profileDataRow">Profilkép
                            <input type="file" onChange={(e) => setRegistrationData({ ...registrationData, profilePicturePath: e.target.files[0] })}/>
                        </p>
                    </div>
                    ) : (
                    <div className="profileData">
                        <p className="profileDataRow">Felhasználónév<span>{registrationData.loginNev}</span></p>
                        <p className="profileDataRow">Teljes név <span>{registrationData.name}</span></p>
                        <p className="profileDataRow">Email <span>{registrationData.email}</span></p>
                        <p className="profileDataRow">Jelszó <span>*********</span></p>
                    </div>
                    )}
                    {isEditView ? (
                        <button className="ProfileEditBtn" onClick={handleSave}>Mentés</button>
                    ) : (
                        <button className="ProfileEditBtn" onClick={() => setIsEditView(true)}>Adatok módosítása</button>
                    )}
                    <button className="profileRedBtn" onClick={handleLogout}>Kijelentkezés</button>
                    <button className="profileRedBtn" onClick={handleDeleteAccount}>Fiók törlése</button>    
                </div>
            </div>
            <img src="/img/city2.png" className="footerImg" alt="City View" />
            <Footer />
            </motion.div>
        </div>
    );
};

export default Profil;
