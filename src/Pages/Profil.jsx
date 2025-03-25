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
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("username");
    const [profileData, setProfileData] = useState({
        loginNev: "Felhasználónév",
        email: "felhasználó@domain.com",
        name: "Teljes név",
        permissionId: 0,
        profilePicturePath: "",
    });
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [propertyImages, setPropertyImages] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (!token || !username) return;        
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(
                    `https://localhost:7079/api/felhasznalo/me/${username}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProfileData(response.data);
            } catch (error) {
                console.error("Hiba a felhasználói adatok betöltésokor:", error);
            }
        };
        fetchProfileData();
    }, [token, username]);

    useEffect(() => {
        if (!token || !profileData.id) return;
        const fetchData = async () => {
            try {
                const propertiesResponse = await axios.get(
                    `https://localhost:7079/api/Ingatlan/ingatlanok`,
                    { headers: { Authorization: `Bearer ${token}` } });
                    setProperties(propertiesResponse.data)

                if (profileData.permissionId === 2) {
                    const userProperties = propertiesResponse.data.filter(
                        property => property.tulajdonosId === profileData.id);
                        setProperties(userProperties);
                }

                if (profileData.permissionId === 1 || profileData.permissionId === 3) {
                    const endpoint = profileData.permissionId === 3 
                        ? `https://localhost:7079/api/Foglalasok/user/${userId}`
                        : `https://localhost:7079/api/Foglalasok/allBookings`;
                    
                    const bookingsResponse = await axios.get(endpoint, {
                        headers: { Authorization: `Bearer ${token}` }});
                        setBookings(bookingsResponse.data);
                }

                const imagesResponse = await axios.get(
                    `https://localhost:7079/api/Ingatlankepek/ingatlankepek`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPropertyImages(imagesResponse.data);

            } catch (error) {
                console.error("Hiba az ingatlanképek betöltésekor:", error);
            }
        };
        fetchData();
    }, [profileData.id, profileData.permissionId, token, userId]);


    const PropertyCard = ({ id, kep, cim, helyszin }) => (
        <div className="profilePropertyCard">
            <img src={kep} alt="property" />
            <p>{helyszin}<br /><span>{cim}</span></p>
            <div className="buttonContainer">
                <button>
                    <Link to={`/ingatlanok/${id}`}>Részletek</Link>
                </button>
                <button>
                    <Link to={`/ingatlanKezeles/${id}`}>Kezelés</Link>
                </button>
            </div>
        </div>
    );

    const BookingCard = ({ id, kep, helyszin, kezdesDatum, befejezesDatum, allapot, ingatlanId }) => (
        <div className="profileBookingCard">
            <img src={kep} alt="property" />
            <p>{helyszin}<br /><span>{allapot}</span></p>
            <div className="bookingDatesContainer">
                <p>Kezdés: {new Date(kezdesDatum).toLocaleDateString()}</p>
                <p>Befejezés: {new Date(befejezesDatum).toLocaleDateString()}</p>
            </div>
            <div className="buttonContainer">
                <button>
                    <Link to={`/ingatlanok/${ingatlanId}`}>Részletek</Link>
                </button>
                <button onClick={() => handleDeleteBooking(id)}>
                    Foglalás törlése
                </button>
            </div>
        </div>
    );

    const handleDeleteBooking = async (id) => {
        if (!window.confirm("Biztosan törölni szeretnéd a foglalást?")) return;
        
        try {
            await axios.delete(`https://localhost:7079/api/Foglalasok/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(bookings.filter(booking => booking.foglalasId !== id));
        } catch (error) {
            console.error("Hiba történt a foglalás törlésekor.", error);
            alert("Hiba történt a foglalás törlésekor.");
        }
    };

    const handleSaveProfile = async () => {
        try {
            let profilePictureUrl = profileData.profilePicturePath;
            
            if (profileData.profilePicturePath instanceof File) {
                const formData = new FormData();
                const renamedFile = new File(
                    [profileData.profilePicturePath], 
                    `${userId}pfp.png`, 
                    { type: profileData.profilePicturePath.type }
                );
                formData.append("file", renamedFile);
                
                await axios.post(
                    'https://localhost:7079/api/FileUpload/FtpServer',
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                profilePictureUrl = `http://images.ingatlanok.nhely.hu/${userId}pfp.png`;
            }

            await axios.put(
                `https://localhost:7079/api/Felhasznalo/${userId}`,
                { ...profileData, profilePicturePath: profilePictureUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setIsEditMode(false);
            sessionStorage.setItem("username", profileData.loginNev);
        } catch (error) {
            console.error("Hiba történt a profil mentésekor.", error);
            alert("Hiba történt a profil mentésekor.");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                `https://localhost:7079/api/Felhasznalo/logout/`, 
                { LoginNev: profileData.loginNev },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            sessionStorage.clear();
            navigate("/belepes");
        } catch (error) {
            console.error("Hiba történt a kijelentkezés során.", error);
            alert("Hiba történt a kijelentkezés során.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Biztosan törölni szeretnéd a fiókodat? Ez visszafordíthatatlan művelet.")) return;
        
        try {
            await axios.delete(
                `https://localhost:7079/api/Felhasznalo/delete/${username}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            sessionStorage.clear();
            navigate("/belepes");
        } catch (error) {
            console.error("Hiba történt a fiók törlésekor.", error);
            alert("Hiba történt a fiók törlésekor.");
        }
    };

    const getPropertyImage = (propertyId) => {
        const propertyImg = propertyImages.find(img => img.ingatlanId === propertyId);
        return propertyImg ? propertyImg.kepUrl : "img/placeholder.jpg";
    };
    
    return (
        <div>
            <Navbar />
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.3 }}>
                <SmallHeader title="Saját profil" />
                <div className="profileContent">
                    <div className="profileSide">
                        <img 
                            src={profileData.profilePicturePath || "/img/defaultPfp.jpg"}
                            className="profilePicture" alt="profile" loading="lazy"
                            onError={(e) => { e.target.onerror = null; e.target.src = "/img/defaultPfp.jpg"; }}
                        />
                        <p className="ProfileUsername">{profileData.loginNev}</p>
                        <p className="ProfileFullname">{profileData.name}</p>
                    </div>

                    <div className="profileDetails">
                        {(profileData.permissionId === 1 || profileData.permissionId === 2) && (
                            <>
                                <p className="profileTitle">Meghirdetett ingatlanok</p>
                                <div className="profileProperties">
                                    {properties.length > 0 ? (
                                        properties.map((property) => (
                                            <PropertyCard
                                                key={property.ingatlanId}
                                                id={property.ingatlanId}
                                                kep={getPropertyImage(property.ingatlanId)}
                                                cim={property.cim}
                                                helyszin={property.helyszin}
                                            />
                                        ))
                                    ) : (
                                        <div className="errorMessage">
                                            Nincsenek feltöltött ingatlanok
                                            <img src="img/errordog.gif" alt="hiba" width={170}/>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {(profileData.permissionId === 1 || profileData.permissionId === 3) && (
                            <>
                                <p className="profileTitle">Foglalások</p>
                                <div className="profileProperties">
                                    {bookings.length > 0 ? (
                                        bookings.map((booking) => {
                                            const property = properties.find(p => p.ingatlanId === booking.ingatlanId);
                                            if (!property) return null;
                                            return (
                                                <BookingCard
                                                    key={booking.foglalasId}
                                                    id={booking.foglalasId}
                                                    kep={getPropertyImage(booking.ingatlanId)}
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
                        {isEditMode ? (
                            <div className="profileData">
                            {[
                                { label: "Felhasználónév", field: "loginNev", inputType: "text" },
                                { label: "Teljes név", field: "name", inputType: "text" },
                                { label: "Email", field: "email", inputType: "text" },
                                { label: "Jelszó", field: "password", inputType: "password" },
                                { label: "Profilkép", field: "profilePicturePath", inputType: "file" }
                            ].map(({ label, field, inputType }) => (
                                <p key={field} className="profileDataRow">
                                    {label}
                                    <input
                                        type={inputType}
                                        value={inputType !== "file" ? profileData[field] || "" : undefined}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            [field]: inputType === "file" ? e.target.files[0] : e.target.value
                                        })}
                                        {...(inputType === "file" ? {} : { value: profileData[field] || "" })}
                                    />
                                </p>
                            ))}
                            </div>
                        ) : (
                            <div className="profileData">
                                <p className="profileDataRow">Felhasználónév <span>{profileData.loginNev}</span></p>
                                <p className="profileDataRow">Teljes név <span>{profileData.name}</span></p>
                                <p className="profileDataRow">Email <span>{profileData.email}</span></p>
                                <p className="profileDataRow">Jelszó <span>*********</span></p>
                            </div>
                        )}

                        {isEditMode ? (
                            <button className="ProfileEditBtn" onClick={handleSaveProfile}>
                                Mentés
                            </button>
                        ) : (
                            <button className="ProfileEditBtn" onClick={() => setIsEditMode(true)}>
                                Adatok módosítása
                            </button>
                        )}
                        <button className="profileRedBtn" onClick={handleLogout}>
                            Kijelentkezés
                        </button>
                        <button className="profileRedBtn" onClick={handleDeleteAccount}>
                            Fiók törlése
                        </button>    
                    </div>
                </div>

                <img src="/img/city2.png" className="footerImg" alt="City View" />
                <Footer />
            </motion.div>
        </div>
    );
};

export default Profil;