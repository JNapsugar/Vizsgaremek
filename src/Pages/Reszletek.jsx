import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import '../style.css';
import Navbar from '../Components/Navbar';
import Footer from "../Components/Footer";
import PropertyCard from '../Components/PropertyCard';
import Calendar from 'react-calendar';

const App = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [property, setProperty] = useState({});
    const [propertyImage, setPropertyImage] = useState({});
    const [owner, setOwner] = useState({});
    const [properties, setProperties] = useState([]);
    const [propertyImages, setPropertyImages] = useState([]);
    const { ingatlanId } = useParams();
    const permission = sessionStorage.getItem("permission");
    const userId = sessionStorage.getItem("userId");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectingStart, setSelectingStart] = useState(true);
    const [bookedDates, setBookedDates] = useState([]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const images = [
        "/img/headers/header1.jpg",
        "/img/headers/header2.jpg",
        "/img/headers/header3.jpg",
        "/img/headers/header4.jpg",
        "/img/headers/header5.jpg"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        axios.get(`https://localhost:7079/api/Ingatlan/ingatlanok/${ingatlanId}`)
            .then(res => { setProperty(res.data); })
            .catch(error => console.log(error));
    }, [ingatlanId]);

    useEffect(() => {
        axios.get(`https://localhost:7079/api/Ingatlankepek/ingatlankepek/${ingatlanId}`)
            .then(res => setPropertyImage(res.data))
            .catch(error => { console.error(error); })
    }, [ingatlanId]);

    useEffect(() => {
        if (property.tulajdonosId) {
            axios.get(`https://localhost:7079/api/Felhasznalo/felhasznalo/${property.tulajdonosId}`)
                .then(res => setOwner(res.data))
                .catch(error => { console.error(error); });
        }
    }, [property.tulajdonosId]);

    useEffect(() => {
        axios.get('https://localhost:7079/api/Ingatlan/ingatlanok')
            .then(res => {
                const randomProperties = res.data.sort(() => Math.random() - 0.5);
                const otherProperties = randomProperties.slice(0, 3);
                setProperties(otherProperties);
            })
            .catch(error => console.log(error));
    }, [ingatlanId]);

    useEffect(() => {
        axios.get('https://localhost:7079/api/Ingatlankepek/ingatlankepek')
            .then(res => setPropertyImages(res.data))
            .catch(error => { console.error(error); })
    }, []);

    useEffect(() => {
        axios.get(`https://localhost:7079/api/Foglalasok/ingatlan/${ingatlanId}`)
            .then(res => {
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
            })
            .catch(error => console.error(error));
    }, [ingatlanId]);
    

    const handleDateChange = (date) => {
        if (selectingStart) {
            setStartDate(date);
            setEndDate(null);
            setSelectingStart(false);
            document.getElementById('bookingResponse').innerText = "";
        } else {
            const selectedDates = getDateRange(startDate, date);
            const isConflict = selectedDates.some(d => bookedDates.includes(d));
            if (isConflict) {
                document.getElementById('bookingResponse').innerText = "A választott időszak már foglalt időpontot tartalmaz!";
                setStartDate(null);
                setEndDate(null);
                setSelectingStart(true);
                return;
            }
            setEndDate(date);
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
            if (startDate && date.getTime() === startDate.getTime()) {
                return 'react-calendar__tile--start';
            }
            if (endDate && date.getTime() === endDate.getTime()) {
                return 'react-calendar__tile--end';
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
            befejezesDatum: endDate.toISOString()
        };

        axios.post('https://localhost:7079/api/Foglalasok/addBooking', bookingData)
            .then(response => {
                document.getElementById('bookingResponse').innerText = "Foglalási kérelem sikeresen elküldve!";
            })
            .catch(error => {
                console.error("Hiba történt a foglalás során", error);
                document.getElementById('bookingResponse').innerText = "Hiba történt a foglalási kérelem elküldésekor!";
            });
    };

    console.log(bookedDates);
    
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
                        {property.szolgaltatasok && property.szolgaltatasok.split(', ').map((service, index) => {
                            let iconSrc;
                            switch (service) {
                                case "Wi-fi": iconSrc = "/img/icons/wifi.svg"; break;
                                case "kutya hozható": iconSrc = "/img/icons/paw.svg"; break;
                                case "parkolás": iconSrc = "/img/icons/parking.svg"; break;
                                case "medence": iconSrc = "/img/icons/pool.svg"; break;
                                case "kert": iconSrc = "/img/icons/garden.svg"; break;
                                case "légkondícionálás": iconSrc = "/img/icons/airconditioning.svg"; break;
                                case "billiárd": iconSrc = "/img/icons/pooltable.svg"; break;
                                case "ping-pong": iconSrc = "/img/icons/pingpong.svg"; break;
                                case "akadálymentes": iconSrc = "/img/icons/wheelchair.svg"; break;
                                case "baba bútorok": iconSrc = "/img/icons/baby.svg"; break;
                                case "grill": iconSrc = "/img/icons/grill.svg"; break;
                                case "horgásztó": iconSrc = "/img/icons/fishing.svg"; break;
                                case "istálló": iconSrc = "/img/icons/stable.svg"; break;
                                case "erkély/terasz": iconSrc = "/img/icons/balcony.svg"; break;
                                case "házimozi": iconSrc = "/img/icons/cinema.svg"; break;
                                case "mosógép": iconSrc = "/img/icons/washingmachine.svg"; break;
                                case "kávőfőző": iconSrc = "/img/icons/coffeemaker.svg"; break;
                                case "takarítószolgálat": iconSrc = "/img/icons/cleaning.svg"; break;
                                case "biztonsági kamera": iconSrc = "/img/icons/securitycamera.svg"; break;
                                case "golfpálya": iconSrc = "/img/icons/golf.svg"; break;
                                case "spajz": iconSrc = "/img/icons/pantry.svg"; break;
                                default: iconSrc = "/img/icons/plus.svg"; break;
                            }
                            return (
                                <div key={index} className="service">
                                    <img src={iconSrc} alt={service} />
                                    {service}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="propertyContactCard">
                    <p className="propertyContactTitle">Kapcsolat:</p>
                    <img
                        src={owner.ProfilePicturePath ? owner.ProfilePicturePath : "/img/defaultPfp.jpg"}
                        className="uploaderImg" alt="Uploader" loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/img/defaultPfp.jpg"; }}
                    />

                    <a className="uploaderName">{owner.loginNev}</a>
                    <div className="propertyContact">
                        <span>Név:</span><span className="propertyContactValue">{owner.name}</span>
                    </div>
                    <div className="propertyContact">
                        <span>Email:</span><span className="propertyContactValue">{owner.email}</span>
                    </div>
                </div>
            </div>

            {permission === '3' ? (
                <div>
                    <hr />
                    <div className='calendarSection'>
                        <div className='calendarContainer'>
                            <Calendar
                                onChange={handleDateChange}
                                value={selectingStart ? startDate : endDate}
                                minDate={selectingStart ? new Date(today.getTime() + 86400000) : startDate}
                                tileClassName={tileClassName} tileDisabled={tileDisabled}
                            />
                        </div>
                        <div className="datesContainer">
                            <h1>{selectingStart ? "Válasszon kezdődátumot" : "Válasszon végdátumot"}</h1>
                            <input type="text" id="startDate" className='dateInput'
                                value={startDate ? startDate.toLocaleDateString() : ""}
                                placeholder="Válasszon dátumot" readOnly
                            /><br />
                            <input type="text" id="endDate" className='dateInput'
                                value={endDate ? endDate.toLocaleDateString() : ""}
                                placeholder="Válaszzon dátumot" readOnly
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
                    let propertyImg = propertyImages.find(img => img.ingatlanId === property.ingatlanId);
                    return <PropertyCard key={index} property={property} propertyImg={propertyImg} />;
                })}
            </div>

            <img src="/img/city2.png" className="footerImg" alt="City View" />
            <Footer />
        </div>
    );
};

export default App;
