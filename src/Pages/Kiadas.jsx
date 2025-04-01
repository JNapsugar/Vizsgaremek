import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Kiadas_Ingatlankezeles.css";
import { Link } from "react-router-dom";
import Navbar from '../Components/Navbar';
import SmallHeader from "../Components/SmallHeader";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";
import { RiseLoader } from "react-spinners";

const Kiadas = () => {
    const [uploadStatus, setUploadStatus] = useState('');
    const [properties, setProperties] = useState([]);
    const [locations, setLocations] = useState([]);
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
        kep: ''
    });
    const services = [
        "Wi-Fi", "kutya hozható", "parkolás", "medence", "kert", "légkondícionálás",
        "billiárd", "ping-pong", "akadálymentes", "baba bútorok", "grill", "horgásztó",
        "garázs", "erkély/terasz", "házi mozi", "mosógép", "kávéfőző", "takarító szolgálat",
        "biztonsági kamera", "golfpálya", "spájz"
    ];
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
            setIsLoggedIn(true);
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        axios.get('https://localhost:7079/api/Ingatlan/ingatlanok')
            .then(res => setProperties(res.data))
            .catch(error => console.error(error));

        axios.get('https://localhost:7079/api/Telepules/telepulesek')
            .then(res => setLocations(res.data))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (properties.length > 0 && formData.ingatlanId === 0) {
            const newIngatlanId = Math.max(...properties.map(p => p.ingatlanId)) + 1;
            setFormData(prev => ({ ...prev, ingatlanId: newIngatlanId }));
        }
    }, [properties, formData.ingatlanId]);

    const handleChange = (e) => {
        const { name, type, value } = e.target;
        if (type === "file") {
            const file = e.target.files[0];
            if (file) {
                const renamedFile = new File([file], `${formData.ingatlanId}.png`, { type: file.type });
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: renamedFile,
                    kepPreview: URL.createObjectURL(renamedFile)
                }));
            }
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleCheckboxChange = (label) => {
        setFormData((prevData) => {
            const updatedServices = prevData.szolgaltatasok ? prevData.szolgaltatasok.split(", ") : [];
            const newServices = updatedServices.includes(label) 
                ? updatedServices.filter(item => item !== label) 
                : [...updatedServices, label];
            return { ...prevData, szolgaltatasok: newServices.join(", ") };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert("Kérlek jelentkezz be!");
            return;
        }
        setUploadStatus('uploading');
        
        try {
            const { ingatlanId, cim, leiras, helyszin, ar, szoba, meret, szolgaltatasok, tulajdonosId, kep } = formData;
            await axios.post('https://localhost:7079/api/Ingatlan/ingatlanok', {
                IngatlanId: ingatlanId,
                Cim: cim,
                Leiras: leiras,
                Helyszin: helyszin,
                Ar: parseFloat(ar),
                Szoba: parseInt(szoba),
                Meret: parseInt(meret),
                Szolgaltatasok: szolgaltatasok,
                TulajdonosId: parseInt(tulajdonosId),
                FeltoltesDatum: new Date().toISOString(),
            }, { headers: { Authorization: `Bearer ${token}` } });

            let imageUploadSuccess = true;
            let kepUrl = "img/placeholder.jpg";
            
            if (kep) {
                try {
                    const fileData = new FormData();
                    fileData.append("file", kep);
                    await axios.post('https://localhost:7079/api/FileUpload/FtpServer', fileData, {
                        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                    });
                    kepUrl = `http://images.ingatlanok.nhely.hu/${ingatlanId}.png`;
                } catch (error) {
                    console.error('Hiba történt a kép feltöltése során:', error);
                    imageUploadSuccess = false;
                }
            }

            try {
                await axios.post('https://localhost:7079/api/Ingatlankepek/ingatlankepek', {
                    KepUrl: kepUrl,
                    IngatlanId: ingatlanId,
                    FeltoltesDatum: new Date().toISOString(),
                }, {
                    headers: { 
                        'Content-Type': 'application/json', 
                        Authorization: `Bearer ${token}` 
                    },
                });
            } catch (error) {
                console.error('Hiba történt a kép adatbázisba mentése során:', error);
                imageUploadSuccess = false;
            }

            if (imageUploadSuccess || !kep) {
                setUploadStatus('success');
            } else {
                setUploadStatus('image_error');
            }
        } catch (error) {
            console.error('Hiba történt az ingatlan hozzáadása során:', error);
            setUploadStatus('error');
        }
    };

    const Checkbox = ({ id, label, checked, onChange }) => (
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
    
    return (
        <div>
            <Navbar />
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.3 }}>
                <SmallHeader title="Ingatlan kiadás" />
                {uploadStatus === 'success' ? (
                    <div className="succesfulUpload">
                        <p>Ingatlan sikeresen hozzáadva!</p>
                        <Link to={"/profil"}><button className="starBtn">Ingatlanjaim</button></Link>
                        <Link to={"/"}><button className="starBtn">Főoldal</button></Link>
                    </div>
                ) : uploadStatus === 'image_error' ? (
                    <div className="succesfulUpload">
                        <p>Az ingatlan adatai sikeresen feltöltve, de a kép feltöltése nem sikerült.</p>
                        <p>Később módosíthatod az ingatlant és újra próbálkozhatsz a kép feltöltésével.</p>
                        <Link to={"/profil"}><button className="starBtn">Ingatlanjaim</button></Link>
                        <Link to={"/"}><button className="starBtn">Főoldal</button></Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="uploadForm">
                        <div className="uploadRow">
                            <label className="uploadLabel">Cím:</label>
                            <input type="text" name="cim" value={formData.cim} onChange={handleChange} required className="uploadInput" />
                        </div>
                        <div className="uploadRow">
                            <label className="uploadLabel">Ár/éjszaka (Ft):</label>
                            <input type="number" name="ar" value={formData.ar} onChange={handleChange} required className="uploadInput" />
                        </div>
                        <div className="uploadRow">
                            <label className="uploadLabel">Szobák száma:</label>
                            <input type="number" name="szoba" value={formData.szoba} onChange={handleChange} required className="uploadInput" />
                        </div>
                        <div className="uploadRow">
                            <label className="uploadLabel">Méret (m²):</label>
                            <input type="number" name="meret" value={formData.meret} onChange={handleChange} required className="uploadInput" />
                        </div>
                        <div className="uploadRow">
                            <label className="uploadLabel">Helyszín:</label>
                            <select name="helyszin" value={formData.helyszin} onChange={handleChange} required>
                                <option value="">Válassz várost</option>
                                {locations.map((location, index) => (
                                    <option key={index} value={location.nev}>{location.nev}</option>
                                ))}
                            </select>
                        </div>
                        <div className="uploadRow">
                            <label className="uploadLabel">Leírás:</label>
                            <textarea name="leiras" value={formData.leiras} onChange={handleChange} className="uploadInput" required />
                        </div>
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
                        <div className="uploadRow">
                            <label className="uploadLabel">Kép:</label>
                            <label htmlFor="fileUpload" className="imgUploadButton">Fájl kiválasztása</label>
                            <input type="file" id="fileUpload" name="kep" onChange={handleChange} className="imgUploadInput"/>
                            {formData.kepPreview && <img src={formData.kepPreview} alt="Preview" className="imgPreview" />}
                        </div>
                        <button className="starBtn" disabled={uploadStatus === 'uploading'}>
                            Ingatlan feltöltése
                        </button>
                        <div className="uploadMessage">
                            {uploadStatus === 'uploading' && (
                                <div className="uploadMessage"><RiseLoader color="#e09900" size={10} /></div>
                            )}
                            {uploadStatus === 'error' && (
                                <p>Nem sikerült hozzáadni az ingatlant. Kérjük próbáld újra később.</p>
                            )}
                        </div>
                    </form>
                )}
                <img src="/img/city2.png" className="footerImg" alt="City View" />
                <Footer />
            </motion.div>
        </div>
    );
}

export default Kiadas;