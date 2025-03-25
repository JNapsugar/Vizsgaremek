import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../style.css';
import Navbar from '../Components/Navbar';
import SmallHeader from '../Components/SmallHeader';
import Footer from "../Components/Footer";
import PropertyCard from '../Components/PropertyCard';

const Reszletek = () => {
    const { ingatlanId } = useParams();
    const permission = sessionStorage.getItem("permission");
    const userId = sessionStorage.getItem("userId");
    const [property, setProperty] = useState({});
    const [propertyImage, setPropertyImage] = useState({});
    const [owner, setOwner] = useState({});
    const [properties, setProperties] = useState([]);
    const [propertyImages, setPropertyImages] = useState([]);
    const [bookedDates, setBookedDates] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectingStart, setSelectingStart] = useState(true);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const serviceIcons = {
        "Wi-Fi": "/img/icons/wifi.svg",
        "kutya hozható": "/img/icons/paw.svg",
        "parkolás": "/img/icons/parking.svg",
        "medence": "/img/icons/pool.svg",
        "kert": "/img/icons/garden.svg",
        "légkondícionálás": "/img/icons/airconditioning.svg",
        "billiárd": "/img/icons/pooltable.svg",
        "ping-pong": "/img/icons/pingpong.svg",
        "akadálymentes": "/img/icons/wheelchair.svg",
        "baba bútorok": "/img/icons/baby.svg",
        "grill": "/img/icons/grill.svg",
        "horgásztó": "/img/icons/fishing.svg",
        "garázs": "/img/icons/garage.svg",
        "erkély/terasz": "/img/icons/balcony.svg",
        "házi mozi": "/img/icons/cinema.svg",
        "mosógép": "/img/icons/washingmachine.svg",
        "kávéfőző": "/img/icons/coffeemaker.svg",
        "takarító szolgálat": "/img/icons/cleaning.svg",
        "biztonsági kamera": "/img/icons/securitycamera.svg",
        "golfpálya": "/img/icons/golf.svg",
        "spájz": "/img/icons/pantry.png"
    };

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`https://localhost:7079/api/Ingatlan/ingatlanok/${ingatlanId}`);
                setProperty(res.data);
            } catch (error) {
                console.error("Hiba az ingatlan betöltésekor:", error);
            }
        };
        fetchProperty();
    }, [ingatlanId]);

    useEffect(() => {
        const fetchPropertyImage = async () => {
            try {
                const res = await axios.get(`https://localhost:7079/api/Ingatlankepek/ingatlankepek/${ingatlanId}`);
                setPropertyImage(res.data);
            } catch (error) {
                console.error("Hiba az ingatlankép betöltésekor:", error);
            }
        };
        fetchPropertyImage();
    }, [ingatlanId]);

    useEffect(() => {
        const fetchOwner = async () => {
            if (property.tulajdonosId) {
                try {
                    const res = await axios.get(`https://localhost:7079/api/Felhasznalo/felhasznalo/${property.tulajdonosId}`);
                    setOwner(res.data);
                } catch (error) {
                    console.error("Hiba a tulajdonos adatainak betltésekor:", error);
                }
            }
        };
        fetchOwner();
    }, [property.tulajdonosId]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await axios.get('https://localhost:7079/api/Ingatlan/ingatlanok');
                const randomProperties = res.data.sort(() => Math.random() - 0.5);
                setProperties(randomProperties.slice(0, 3));
            } catch (error) {
                console.error("Hiba a további ingatlanok betöltésekor:", error);
            }
        };
        fetchProperties();
    }, [ingatlanId]);

    useEffect(() => {
        const fetchPropertyImages = async () => {
            try {
                const res = await axios.get('https://localhost:7079/api/Ingatlankepek/ingatlankepek');
                setPropertyImages(res.data);
            } catch (error) {
                console.error("Hiba a további ingatlanképek betöltésekor:", error);
            }
        };
        fetchPropertyImages();
    }, []);

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const res = await axios.get(`https://localhost:7079/api/Foglalasok/ingatlan/${ingatlanId}`);
                const bookings = res.data.bookings || [];
                const acceptedBookings = bookings.filter(booking => booking.allapot === "elfogadva");

                const dates = acceptedBookings.map(booking => ({
                    start: new Date(booking.kezdesDatum),
                    end: new Date(booking.befejezesDatum)
                }));

                const allBookedDates = [];
                dates.forEach(({ start, end }) => {
                    let currentDate = new Date(start);
                    while (currentDate <= end) {
                        allBookedDates.push(currentDate.toISOString().split('T')[0]);
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                });
                
                setBookedDates(allBookedDates);
            } catch (error) {
                console.error("Error fetching booked dates:", error);
            }
        };
        fetchBookedDates();
    }, [ingatlanId]);

    const handleDateChange = (date) => {
        const adjustedDate = new Date(date);
        adjustedDate.setHours(12, 0, 0, 0);

        if (selectingStart) {
            setStartDate(adjustedDate);
            setEndDate(null);
            setSelectingStart(false);
            document.getElementById('bookingResponse').innerText = "";
        } else {
            const selectedDates = getDateRange(startDate, adjustedDate);
            const isConflict = selectedDates.some(d => bookedDates.includes(d));

            if (isConflict) {
                document.getElementById('bookingResponse').innerText = "A választott időszak már foglalt időpontot tartalmaz!";
                setStartDate(null);
                setEndDate(null);
                setSelectingStart(true);
                return;
            }

            setEndDate(adjustedDate);
            setSelectingStart(true);
        }
    };

    const getDateRange = (start, end) => {
        const dates = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const isBetween = (date) => {
        return startDate && endDate && date > startDate && date < endDate;
    };

    const tileDisabled = ({ date }) => {
        const dateStr = date.toISOString().split('T')[0];
        return bookedDates.includes(dateStr); 
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            if (date.toDateString() === startDate?.toDateString()) {
                return 'startDateTile';
            }
            if (date.toDateString() === endDate?.toDateString()) {
                return 'endDateTile';
            }
            if (isBetween(date)) {
                return 'highlighted';
            }
        }
        return '';
    };

    const handleBooking = () => {
        if (!startDate || !endDate) {
            document.getElementById('bookingResponse').innerText = "Kérlek válassz kezdő és végdátumot!";
            return;
        }

        const bookingData = {
            ingatlanId: property.ingatlanId,
            berloId: userId,
            kezdesDatum: startDate.toISOString(),
            befejezesDatum: endDate.toISOString(),
            allapot: "függőben"
        };

        axios.post('https://localhost:7079/api/Foglalasok/addBooking', bookingData)
            .then(() => {
                document.getElementById('bookingResponse').innerText = "Foglalási kérelem sikeresen elküldve!";
            })
            .catch(error => {
                console.error("Hiba történt a foglalás során", error);
                document.getElementById('bookingResponse').innerText = "Hiba történt a foglalási kérelem elküldésekor!";
            });
    };

    return (
        <div>
            <Navbar />
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.3 }}>
                <SmallHeader title="Részletek" />
                <div className="propertyMainContent">
                    <img src={propertyImage.kepUrl} alt={property.helyszin} loading="lazy" className='propertyImage' />
                    <div className="mainDetails">
                        <p className="propertyTitle">{property.helyszin}</p>
                        <p className="propertyLocation">{property.cim}</p>
                        <p className="propertyPrice">{property.ar} Ft/éjszaka</p>
                        <p className="propertyDescription">{property.leiras}</p>
                    </div>
                </div>

                <hr />

                <div className="propertyOtherContent">
                    <div className="otherDetails">
                        <p className="title">Részletek</p>
                        <p className="propertyDetails">
                            Méret: {property.meret}m²<br />
                            Szobák száma: {property.szoba} <br />
                            Feltöltés dátuma: {new Date(property.feltoltesDatum).toLocaleDateString()}
                        </p>
                        
                        <p className="title">Szolgáltatások</p>
                        <div className="services">
                            {property.szolgaltatasok && property.szolgaltatasok.split(', ').map((service, index) => (
                                <div key={index} className="service">
                                    <img 
                                        src={serviceIcons[service] || "/img/icons/plus.svg"} 
                                        alt={service} 
                                    />
                                    {service}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="propertyContactCard">
                        <p className="propertyContactTitle">Kapcsolat:</p>
                        <img
                            src={owner.ProfilePicturePath || "/img/defaultPfp.jpg"}
                            className="uploaderImg" alt="Uploader" loading="lazy"
                            onError={(e) => { e.target.onerror = null; e.target.src = "/img/defaultPfp.jpg"; }}
                        />
                        <p className="uploaderName">{owner.loginNev}</p>
                        <div className="propertyContact">
                            <span>Név:</span>
                            <span className="propertyContactValue">{owner.name}</span>
                        </div>
                        <div className="propertyContact">
                            <span>Email:</span>
                            <span className="propertyContactValue">{owner.email}</span>
                        </div>
                    </div>
                </div>

                {permission === '3' || permission === '1' ? (
                    <div>
                        <hr />
                        <div className='calendarSection'>
                            <div className='calendarContainer'>
                                <Calendar
                                    onChange={handleDateChange}
                                    value={selectingStart ? startDate : endDate}
                                    minDate={selectingStart ? new Date(today.getTime() + 86400000) : startDate}
                                    tileClassName={tileClassName} 
                                    tileDisabled={tileDisabled}
                                />
                            </div>
                            <div className="datesContainer">
                                <h1>{selectingStart ? "Válasszon kezdődátumot" : "Válasszon végdátumot"}</h1>
                                <input 
                                    type="text" 
                                    id="startDate" 
                                    className='dateInput'
                                    value={startDate ? startDate.toLocaleDateString() : ""}
                                    placeholder="Válasszon dátumot" 
                                    readOnly
                                /><br />
                                <input 
                                    type="text" 
                                    id="endDate" 
                                    className='dateInput'
                                    value={endDate ? endDate.toLocaleDateString() : ""}
                                    placeholder="Válaszzon dátumot" 
                                    readOnly
                                />
                                <button className="starBtn" onClick={handleBooking}>
                                    Foglalás
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className={`absolute star-${i + 1} animate-spin-slow`}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.11 815.53" className="w-6 h-6 text-yellow-400">
                                                <path fill="currentColor" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"/>
                                            </svg>
                                        </div>
                                    ))}
                                </button>
                                <p id='bookingResponse' className='errorMessage'></p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className='errorMessage'>Foglaláshoz jelentkezzen be egy bérlő fiókba</p>
                )}

                <hr />
                
                <p className="title moreRecsTitle">További ajánlatok</p>
                <div className="moreRecs">
                    {properties.map((property, index) => {
                        const propertyImg = propertyImages.find(img => img.ingatlanId === property.ingatlanId);
                        return <PropertyCard key={index} property={property} propertyImg={propertyImg} />;
                    })}
                </div>

                <img src="/img/city2.png" className="footerImg" alt="City View" />
                <Footer />
            </motion.div>
        </div>
    );
};

export default Reszletek;