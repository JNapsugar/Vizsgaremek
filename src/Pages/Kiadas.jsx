import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from '../Components/Navbar';
import SmallHeader from "../Components/SmallHeader";
import Footer from "../Components/Footer";

import "../style.css";

const IngatlanForm = () => {
    const [properties, setProperties] = useState([]);
    useEffect(() => {
        axios.get('https://localhost:7079/api/Ingatlan/ingatlanok')
            .then(res => setProperties(res.data))
            .catch(error => { console.error(error); })
    }, []);


    const [formData, setFormData] = useState({
        ingatlanId: 0,
        cim: '',
        leiras: '',
        helyszin: '',
        ar: '',
        szoba: '',
        meret: '',
        szolgaltatasok: '',
        tulajdonosId: sessionStorage.getItem("userId"),
        kep:''   
    });
    
    const [succesful, setSuccesful] = useState(false);
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

    const [locations, setLocations] = useState([]);
    useEffect(() => {
        axios.get('https://localhost:7079/api/Telepules/telepulesek')
            .then(res => { setLocations(res.data); })
            .catch(error => { console.error(error); })
    }, []);

    useEffect(() => {
        if (properties.length > 0) {
            const newIngatlanId = properties[properties.length - 1].ingatlanId + 1;
            setFormData((prevData) => ({
                ...prevData,
                ingatlanId: newIngatlanId
            }));
        }
    }, [properties]);

    const handleChange = (e) => {
        const { name, type } = e.target;
        if (type === "file") {
            const file = e.target.files[0];
            if (file) {
                const renamedFile = new File([file], `${formData.ingatlanId}.png`, { type: file.type });
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: renamedFile,
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: e.target.value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!isLoggedIn) {
            alert("Kérlek jelentkezz be!");
            return;
        }
    
        try {
            const response = await axios.post(
                'https://localhost:7079/api/Ingatlan/ingatlanok',
                {
                    IngatlanId: formData.ingatlanId,
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
            
            let kepUrl = "";
            if (formData.kep) {
                const fileData = new FormData();
                fileData.append("file", formData.kep);
    
                await axios.post(
                    'https://localhost:7079/api/FileUpload/FtpServer',
                    fileData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                kepUrl = `http://images.ingatlanok.nhely.hu/${formData.ingatlanId}.png`;
            }
            else{
                kepUrl = "img/placeholder.jpg";
            }
            await axios.post(
                'https://localhost:7079/api/Ingatlankepek/ingatlankepek',
                {
                    kepUrl: kepUrl,
                    ingatlanId: formData.ingatlanId,
                    feltoltesDatum: new Date().toISOString(),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200 || response.status === 201) {
                setSuccesful(true);
                setFormData({
                    cim: '',
                    leiras: '',
                    helyszin: '',
                    ar: '',
                    szoba: '',
                    meret: '',
                    szolgaltatasok: '',
                    tulajdonosId: '',
                    kep: ''
                });
            }
        } catch (error) {
            console.error('Hiba történt az ingatlan hozzáadása során:', error);
            alert('Nem sikerült hozzáadni az ingatlant. Ellenőrizd az adatokat és próbáld újra.');
        }
    };

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


    return (
        <div>
            <Navbar />
            <SmallHeader title="Ingatlan kiadás" />
            {succesful ? (
                <div className="succesfulUpload">
                    <p>Ingatlan sikeresen hozzáadva!</p>
                    <Link to={"/profil"}><button className="starBtn">Ingatlanjaim</button></Link>
                    <Link to={"/"}><button className="starBtn">Főoldal</button></Link>
                    
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="uploadForm">
                    
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
                        <label className="uploadLabel">Kép:</label>
                        <input
                            type="file"
                            name="kep"
                            onChange={handleChange}
                            className="uploadInput"
                        />
                    </div>
                    <hr />
                    <div className="uploadRow">
                        <label className="uploadLabel">Szolgáltatások:</label>
                        <div className="uploadServiceContainer">
                            <Checkbox id="wifiCb" label="Wi-Fi" checked={formData.szolgaltatasok.includes("Wi-Fi")} onChange={handleCheckboxChange} />
                            <Checkbox id="petCb" label="kutya hozható" checked={formData.szolgaltatasok.includes("kutya hozható")} onChange={handleCheckboxChange} />
                            <Checkbox id="parkolasCb" label="parkolás" checked={formData.szolgaltatasok.includes("parkolás")} onChange={handleCheckboxChange} />
                            <Checkbox id="medenceCb" label="medence" checked={formData.szolgaltatasok.includes("medence")} onChange={handleCheckboxChange} />
                            <Checkbox id="kertCb" label="kert" checked={formData.szolgaltatasok.includes("kert")} onChange={handleCheckboxChange} />
                            <Checkbox id="legkondiCb" label="légkondícionálás" checked={formData.szolgaltatasok.includes("légkondícionálás")} onChange={handleCheckboxChange} />
                            <Checkbox id="billiardCb" label="billiárd" checked={formData.szolgaltatasok.includes("billiárd")} onChange={handleCheckboxChange} />
                            <Checkbox id="pingpongCb" label="ping-pong" checked={formData.szolgaltatasok.includes("ping-pong")} onChange={handleCheckboxChange} />
                            <Checkbox id="akadalymentesCb" label="akadálymentes" checked={formData.szolgaltatasok.includes("akadálymentes")} onChange={handleCheckboxChange} />
                            <Checkbox id="babaButorokCb" label="baba bútorok" checked={formData.szolgaltatasok.includes("baba bútorok")} onChange={handleCheckboxChange} />
                            <Checkbox id="grillCb" label="grill" checked={formData.szolgaltatasok.includes("grill")} onChange={handleCheckboxChange} />
                            <Checkbox id="horgasztoCb" label="horgásztó" checked={formData.szolgaltatasok.includes("horgásztó")} onChange={handleCheckboxChange} />
                            <Checkbox id="garazsCb" label="garázs" checked={formData.szolgaltatasok.includes("garázs")} onChange={handleCheckboxChange} />
                            <Checkbox id="erkelyTeraszCb" label="erkély/terasz" checked={formData.szolgaltatasok.includes("erkély/terasz")} onChange={handleCheckboxChange} />
                            <Checkbox id="hazimoziCb" label="házi mozi" checked={formData.szolgaltatasok.includes("házi mozi")} onChange={handleCheckboxChange} />
                            <Checkbox id="mosogepCb" label="mosógép" checked={formData.szolgaltatasok.includes("mosógép")} onChange={handleCheckboxChange} />
                            <Checkbox id="kavefozoCb" label="kávéfőző" checked={formData.szolgaltatasok.includes("kávéfőző")} onChange={handleCheckboxChange} />
                            <Checkbox id="takaritokCb" label="takarító szolgálat" checked={formData.szolgaltatasok.includes("takarító szolgálat")} onChange={handleCheckboxChange} />
                            <Checkbox id="biztonsagiKameraCb" label="biztonsági kamera" checked={formData.szolgaltatasok.includes("biztonsági kamera")} onChange={handleCheckboxChange} />
                            <Checkbox id="golfpalyaCb" label="golfpálya" checked={formData.szolgaltatasok.includes("golfpálya")} onChange={handleCheckboxChange} />
                            <Checkbox id="spajzCb" label="spájz" checked={formData.szolgaltatasok.includes("spájz")} onChange={handleCheckboxChange} />
                        </div>
                    </div>
                    
                    <button className="starBtn">
                    Ingatlan feltöltése
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`absolute star-${i + 1} animate-spin-slow`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 784.11 815.53"
                            className="w-6 h-6 text-yellow-400"
                        >
                            <path
                            fill="currentColor"
                            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                            />
                        </svg>
                        </div>
                    ))}
                    </button>
                </form>
            )}
            <img src="/img/city2.png" className="footerImg" alt="City View" />
            <Footer />
        </div>
    );
}

export default IngatlanForm;
