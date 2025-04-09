import axios from "axios";
import React, { useState, useEffect } from "react";
import "../Styles/Kiadas_Ingatlankezeles.css";
import { Link, useParams } from "react-router-dom";
import { XCircle, Check2Circle, ArrowRight, ArrowLeft } from 'react-bootstrap-icons';
import Navbar from '../Components/Navbar';
import Footer from "../Components/Footer";
import SmallHeader from "../Components/SmallHeader";
import {motion} from "framer-motion";

const IngatlanKezeles = () => {
    const { id } = useParams(); 
    const [formData, setFormData] = useState({
        cim: '',
        leiras: '',
        helyszin: '',
        ar: '',
        szoba: '',
        meret: '',
        szolgaltatasok: '',
        tulajdonosId: sessionStorage.getItem("userId"),
        kep: ''
    });
    const services = [
        "Wi-Fi", "kutya hozható", "parkolás", "medence", "kert", "légkondícionálás",
        "billiárd", "ping-pong", "akadálymentes", "baba bútorok", "grill", "horgásztó",
        "garázs", "erkély/terasz", "házi mozi", "mosógép", "kávéfőző", "takarító szolgálat",
        "biztonsági kamera", "golfpálya", "spájz"
    ];
    const [succesful, setSuccesful] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [berloNevek, setBerloNevek] = useState({});
    const [berloKepek, setBerloKepek] = useState({});
    const [approvedBookings, setApprovedBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 5;
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = bookings.bookings?.slice(indexOfFirstBooking, indexOfLastBooking) || [];

    //Bejelentkezés ellenőrzés
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
            setIsLoggedIn(true);
            setToken(storedToken);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    //Foglalások lekérése
    useEffect(() => {
        axios.get(`https://vizsgaremek-2jmg.onrender.com/api/Foglalasok/ingatlan/${id}`)
            .then(res => { 
                const allBookings = res.data.bookings;
                const accepted = allBookings.filter(booking => booking.allapot === "elfogadva");
                setBookings(res.data);
                setApprovedBookings(accepted);

                // Bérlők nevének és profilképének lekérése
                res.data.bookings.forEach(booking => {
                    axios.get(`https://vizsgaremek-2jmg.onrender.com/api/Felhasznalo/felhasznalo/${booking.berloId}`)
                        .then(response => {
                            setBerloNevek(prevState => ({
                                ...prevState,
                                [booking.berloId]: response.data.name
                            }));
                            setBerloKepek(prevState => ({
                                ...prevState,
                                [booking.berloId]: response.data.profilePicturePath
                            }));
                        })
                        .catch(error => {
                            console.error("Hiba történt a bérlő adatainak lekérése során:", error);
                        });
                });
            })
            .catch(error => { console.error(error); });
    }, [id]);

    //Foglalási időszakok ütközés vizsgálat
    const isOverlapping = (newBooking) => {
        return approvedBookings.some(existing => 
            new Date(newBooking.kezdesDatum) < new Date(existing.befejezesDatum) &&
            new Date(newBooking.befejezesDatum) > new Date(existing.kezdesDatum)
        );
    };

    //Foglalás elfogadása/elutasítása
    const handleBookingResponse = async (bookingId, status) => {
        try {
            const response = await axios.put(
                `https://vizsgaremek-2jmg.onrender.com/api/Foglalasok/valasz/${bookingId}`,
                status, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                setBookings(prevBookings => ({
                    ...prevBookings,
                    bookings: prevBookings.bookings.map(booking =>
                        booking.foglalasId === bookingId ? { ...booking, allapot: status } : booking
                    ),
                    
                }));
                setApprovedBookings(prevApprovedBookings => {
                    if (status === "elfogadva") {
                        const newBooking = bookings.bookings.find(booking => booking.foglalasId === bookingId);
                        return [...prevApprovedBookings, newBooking];
                    }
                    return prevApprovedBookings;
                });
            }
        } catch (error) {
            console.error(`Hiba történt a foglalás állapotának módosítása során:`, error);
        }
    };
    
    //Lapozás
    const handleNextPage = () => {
        if (currentPage < Math.ceil(bookings.bookings.length / bookingsPerPage)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    //Települések lekérése a comboboxhoz
    const [locations, setLocations] = useState([]);
    useEffect(() => {
        axios.get('https://vizsgaremek-2jmg.onrender.com/api/Telepules/telepulesek')
            .then(res => { setLocations(res.data); })
            .catch(error => { console.error(error); });
    }, []);

    //Ingatlan adatainak lekérése
    useEffect(() => {
        axios.get(`https://vizsgaremek-2jmg.onrender.com/api/Ingatlan/ingatlanok/${id}`)
            .then(res => {
                setFormData({
                    cim: res.data.cim,
                    leiras: res.data.leiras,
                    helyszin: res.data.helyszin,
                    ar: res.data.ar,
                    szoba: res.data.szoba,
                    meret: res.data.meret,
                    szolgaltatasok: res.data.szolgaltatasok,
                    tulajdonosId: res.data.tulajdonosId
                });
            })
            .catch(error => {
                console.error("Hiba történt az ingatlan adatainak betöltése során:", error);
            });
    }, [id]);
    useEffect(() => {
        axios.get(`https://vizsgaremek-2jmg.onrender.com/api/Ingatlankepek/ingatlankepek/${id}`)
            .then(res => {
                setFormData((prevData) => ({
                    ...prevData,
                    kep: res.data,
                }));
            })
            .catch(error => {
                console.error("Hiba történt az ingatlankép betöltése során:", error);
            });
    }, [id]);

    //Ingatlan adatainak módosítása
    const handleChange = (e) => {
        const { name, type } = e.target;
        if (type === "file") {
            const file = e.target.files[0];
            if (file) {
                const renamedFile = new File([file], `${id}.png`, { type: file.type });
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: renamedFile,
                    kepPreview: URL.createObjectURL(renamedFile)
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: e.target.value,
            }));
        }
    };
    

    //Módosítások elküldése
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            alert("Kérlek jelentkezz be!");
            return;
        }

        try {
            const response = await axios.put(
                `https://vizsgaremek-2jmg.onrender.com/api/Ingatlan/ingatlanok/${id}`,
                {
                    Cim: formData.cim,
                    Leiras: formData.leiras,
                    Helyszin: formData.helyszin,
                    Ar: parseFloat(formData.ar),
                    Szoba: parseInt(formData.szoba),
                    Meret: parseInt(formData.meret),
                    Szolgaltatasok: formData.szolgaltatasok,
                    TulajdonosId: parseInt(formData.tulajdonosId),
                    FeltoltesDatum: new Date().toISOString(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (formData.kep) {
                //Kép küldése az ftp szerverre
                const fileData = new FormData();
                fileData.append("file", formData.kep);
                await axios.post(
                    'https://vizsgaremek-2jmg.onrender.com/api/FileUpload/FtpServer',
                    fileData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                //Kép url-jének küldése az adatbázisba
                let endpoint = `https://vizsgaremek-2jmg.onrender.com/api/Ingatlankepek/ingatlankepek/${id}`;
                let method = (await axios.get(endpoint).status === 200 ? 'put' : 'post');
                endpoint = (method === 'put' ? endpoint : endpoint.replace(`/${id}`, ''));
                await axios[method](endpoint, {
                    KepUrl: `http://images.ingatlanok.nhely.hu/${id}.png`,
                    IngatlanId: id,
                    FeltoltesDatum: new Date().toISOString(),
                }, { headers: { Authorization: `Bearer ${token}` } });
            }

            if (response.status === 200 || response.status === 204) {
                setSuccesful(true);
            }
        } catch (error) {
            console.error("Hiba történt az ingatlan adatainak módosítása során:", error);
        }
    };

    //Szolgáltatás checkboxok
    const Checkbox = ({ id, label, checked, onChange }) => {
        return (
            <div className='checkboxContainer'>
                <label>{label}: </label>
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={() => onChange(label)}
                    className="uploadCheckbox"
                />
            </div>
        );
    };

    //Szolgáltatások hozzáfűzése
    const handleCheckboxChange = (label) => {
        setFormData((prevData) => {
            const szolgaltatasokArray = prevData.szolgaltatasok ? prevData.szolgaltatasok.split(", ") : [];

            if (szolgaltatasokArray.includes(label)) {
                return {
                    ...prevData,
                    szolgaltatasok: szolgaltatasokArray.filter(item => item !== label).join(", ")
                };
            } else {
                return {
                    ...prevData,
                    szolgaltatasok: [...szolgaltatasokArray, label].join(", ")
                };
            }
        });
    };

    //Ingatlan törlése
    const handleDelete = async () => {
        if (!window.confirm("Biztosan törölni szeretnéd az ingatlant? Ez a művelet nem visszavonható!")) {
            return;
        }
    
        try {
            const response = await axios.delete(`https://vizsgaremek-2jmg.onrender.com/api/Ingatlan/ingatlanok/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setSuccesful(true);
                document.getElementById("foglalaskezeles").style.display = "none";
            }
        } catch (error) {
            console.error("Hiba történt az ingatlan törlése során:", error);
        }
    };
    

    return (
        <div>
            <Navbar />
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.3 }}>
            <SmallHeader title="Ingatlankezelés" />
            
            <div className="uploadForm" id="foglalaskezeles">
                <p className="title">Foglaláskezelés</p>
                {bookings.hasBookings? (
                    <div className="bookingsContainer">
                    <div className="bookingsHeader">
                        <div>Bérlő</div>
                        <div>Foglalás dátuma</div>
                        <div>Kezdés dátuma</div>
                        <div>Befejezés dátuma</div>
                        <div></div>
                        <div></div>
                    </div>
                    {currentBookings.map((booking, index) => (
                        <div className="bookingRow" key={index}>
                            <div className="bookingCell">
                                <img className="bookingPfp" src={berloKepek[booking.berloId]? berloKepek[booking.berloId] : "../img/defaultPfp.jpg"} alt="profile" />
                                {berloNevek[booking.berloId]}
                            </div>
                            <div className="bookingCell">
                                {new Date(booking.letrehozasDatum).toLocaleDateString()}
                            </div>
                            <div className="bookingCell">
                                {new Date(booking.kezdesDatum).toLocaleDateString()}
                            </div>
                            <div className="bookingCell">
                                {new Date(booking.befejezesDatum).toLocaleDateString()}
                            </div>
                            <div className="bookingCell">{booking.allapot}</div>
                            <div className="bookingActions">
                                {booking.allapot === "függőben" && (
                                    <>
                                        <Check2Circle
                                            title={isOverlapping(booking) ? "Már foglalt időpont" : "Elfogadás"}
                                            onClick={isOverlapping(booking) ? null : () => handleBookingResponse(booking.foglalasId, "elfogadva")}
                                            className={isOverlapping(booking) ? "disabled" : ""}
                                        />
                                        <XCircle
                                            title="Elutasítás"
                                            onClick={() => handleBookingResponse(booking.foglalasId, "elutasítva")}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="pagination">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                            <ArrowLeft/>
                        </button>
                        <span>{currentPage} / {Math.ceil(bookings.bookings?.length / bookingsPerPage)}</span>
                        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(bookings.bookings?.length / bookingsPerPage)}>
                            <ArrowRight/>
                        </button>
                    </div>
                </div>
                ) : (
                    <div className="errorMessage">
                        Még nincsenek foglalások
                        <img src="/img/errordog.gif" alt="hiba" className="errordog"/>
                    </div>
                )}
            </div>
            {succesful ? (
                <div className="succesfulUpload">
                    <p>Sikeres művelet!</p>
                    <Link to={"/profil"}><button className="starBtn">Vissza a profilomra</button></Link>
                    <Link to={"/"}><button className="starBtn">Főoldal</button></Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="uploadForm">
                    <p className="title">Adatszerkesztés</p>
                    <div className="uploadRow">
                        <label className="uploadLabel">Cím:</label>
                        <input
                            type="text"
                            name="cim"
                            value={formData.cim}
                            onChange={handleChange}
                            required
                            className="uploadInput"
                        />
                    </div>
                    <hr />
                    <div className="uploadRow">
                        <label className="uploadLabel">Ár (Ft):</label>
                        <input
                            type="number"
                            name="ar"
                            value={formData.ar}
                            onChange={handleChange}
                            required
                            className="uploadInput"
                        />
                    </div>
                    <hr />
                    <div className="uploadRow">
                        <label className="uploadLabel">Szobák száma:</label>
                        <input
                            type="number"
                            name="szoba"
                            value={formData.szoba}
                            onChange={handleChange}
                            required
                            className="uploadInput"
                        />
                    </div>
                    <hr />
                    <div className="uploadRow">
                        <label className="uploadLabel">Méret (m²):</label>
                        <input
                            type="number"
                            name="meret"
                            value={formData.meret}
                            onChange={handleChange}
                            required
                            className="uploadInput"
                        />
                    </div>
                    <hr />
                    <div className="uploadRow">
                        <label className="uploadLabel">Helyszín:</label>
                        <select
                            name="helyszin"
                            value={formData.helyszin}
                            onChange={handleChange}>
                            <option value=""></option>
                            {locations.map((location, index) => (
                                <option key={index} value={location.nev}>{location.nev}</option>
                            ))}
                        </select>
                    </div>
                    <hr />
                    <div className="uploadRow">
                        <label className="uploadLabel">Leírás:</label>
                        <textarea
                            name="leiras"
                            value={formData.leiras}
                            onChange={handleChange}
                            className="uploadInput"
                        />
                    </div>
                    <hr />
                    <div className="uploadRow">
                        <label className="uploadLabel">Szolgáltatások:</label>
                        <div className="uploadServiceContainer">
                            {services.map((service, index) => (
                                <Checkbox
                                    key={index}
                                    id={`${service.replace(/\s+/g, '')}Cb`}
                                    label={service}
                                    checked={formData.szolgaltatasok.includes(service)}
                                    onChange={handleCheckboxChange}
                                />
                            ))}
                        </div>
                    </div>
                    <hr />
                    <div className="uploadRow">
                        <label className="uploadLabel">Kép:</label>
                        <label htmlFor="fileUpload" className="imgUploadButton">Fájl kiválasztása</label>
                        <input
                            type="file"
                            id="fileUpload"
                            name="kep"
                            onChange={handleChange}
                            className="imgUploadInput"
                        />
                        {formData.kepPreview ? (
                            <img src={formData.kepPreview} alt="Preview" className="imgPreview" />
                        ) : (
                            formData.kep && <img src={formData.kep.kepUrl} alt="Preview" className="imgPreview" />
                        )}
                    </div>
                    <button type="submit" className="starBtn">
                        Ingatlan módosítása
                    </button>
                    <button className="starBtn deleteBtn" onClick={handleDelete}>
                        Ingatlan törlése
                    </button>
                </form>
            )}
            <img src="/img/city2.png" className="footerImg" alt="City View" />
            <Footer />
            </motion.div>
        </div>
    );
};

export default IngatlanKezeles;