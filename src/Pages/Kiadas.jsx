import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";

const IngatlanForm = () => {
    const [formData, setFormData] = useState({
        cim: '',
        leiras: '',
        helyszin: '',
        ar: '',
        meret: '',
        szolgaltatasok: '',
        tulajdonosId: '',
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setIsLoggedIn(true);
            setToken(storedToken);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
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
                    Cim: formData.cim,
                    Leiras: formData.leiras,
                    Helyszin: formData.helyszin,
                    Ar: parseFloat(formData.ar),
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

            if (response.status === 200 || response.status === 201) {
                alert("Ingatlan sikeresen hozzáadva!");
                setFormData({
                    cim: '',
                    leiras: '',
                    helyszin: '',
                    ar: '',
                    meret: '',
                    szolgaltatasok: '',
                    tulajdonosId: '',
                });
            }
        } catch (error) {
            console.error('Hiba történt az ingatlan hozzáadása során:', error);
            alert('Nem sikerült hozzáadni az ingatlant. Ellenőrizd az adatokat és próbáld újra.');
        }
    };

    const Navbar = () => (
        <nav className="navbar">
            <Link to="/home" className="navItem">Főoldal</Link>
            <Link to="/ingatlanok" className="navItem">Ingatlanok</Link>
            {isLoggedIn && (
                <Link to="/kiadas" className="navItem">Kiadás</Link>
            )}
            <Link to="/rolunk" className="navItem">Rólunk</Link>
            {isLoggedIn ? (
                <>
                    <Link to="/profil" className="navItem">Profil</Link>
                    <button className="kilepesBtn" onClick={handleLogout}>
                        Kijelentkezés
                    </button>
                </>
            ) : (
                <button className="belepesBtn">
                    <Link to="/belepes">Belépés</Link>
                </button>
            )}
        </nav>
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        window.location.href = "/belepes";
    };

    return (
        <div>
            <Navbar />
            <h2>Új ingatlan hozzáadása</h2>
            {!isLoggedIn ? (
                <p>Bejelentkezés szükséges az ingatlan hozzáadásához.</p>
            ) : (
                <form onSubmit={handleSubmit} className="kiadasForm">
                    <div>
                        <label>Cím:</label>
                        <input
                            type="text"
                            name="cim"
                            value={formData.cim}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Leírás:</label>
                        <textarea
                            name="leiras"
                            value={formData.leiras}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Helyszín:</label>
                        <input
                            type="text"
                            name="helyszin"
                            value={formData.helyszin}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Ár:</label>
                        <input
                            type="number"
                            name="ar"
                            value={formData.ar}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Méret:</label>
                        <input
                            type="number"
                            name="meret"
                            value={formData.meret}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Szolgáltatások:</label>
                        <input
                            type="text"
                            name="szolgaltatasok"
                            value={formData.szolgaltatasok}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Ingatlan hozzáadása</button>
                </form>
            )}
        </div>
    );
};

export default IngatlanForm;
