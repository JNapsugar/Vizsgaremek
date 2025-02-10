import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../style.css";

const ProfileModification = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({
        loginNev: '',
        email: '',
        name: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

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

    useEffect(() => {
        const storedLoginNev = localStorage.getItem("username");
        const storedEmail = localStorage.getItem("email");
        const storedName = localStorage.getItem("name");

        if (storedLoginNev && storedEmail && storedName) {
            setUserData({
                loginNev: storedLoginNev,
                email: storedEmail,
                name: storedName,
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            setIsLoggedIn(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userData.newPassword !== userData.confirmNewPassword) {
            alert("Az új jelszavak nem egyeznek!");
            return;
        }

        try {
            const response = await axios.post("https://localhost:7079/api/Felhasznalo/" + localStorage.getItem("username"), {
                loginNev: userData.loginNev,
                oldPassword: userData.oldPassword,
                newPassword: userData.newPassword,
                name: userData.name,
                email: userData.email
            });

            alert(response.data.message || "Profil sikeresen frissítve!");

            setUserData((prevData) => ({
                ...prevData,
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            }));
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Hiba történt a profil frissítése során!");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="profileModification">
                <h2 className="profileModificationTitle">Profil módosítása</h2>
                <form onSubmit={handleSubmit} className="profileModificationForm">
                    <div className="profileModificationGroup">
                        <label className="profileModificationLabel">Felhasználónév</label>
                        <input
                            type="text"
                            name="loginNev"
                            value={userData.loginNev}
                            onChange={handleChange}
                            className="profileModificationInput"
                        />
                    </div>
                    <div className="profileModificationGroup">
                        <label className="profileModificationLabel">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="profileModificationInput"
                        />
                    </div>
                    <div className="profileModificationGroup">
                        <label className="profileModificationLabel">Teljes név</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            className="profileModificationInput"
                        />
                    </div>
                    <div className="profileModificationGroup">
                        <label className="profileModificationLabel">Régi jelszó</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={userData.oldPassword}
                            onChange={handleChange}
                            className="profileModificationInput"
                        />
                    </div>
                    <div className="profileModificationGroup">
                        <label className="profileModificationLabel">Új jelszó</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={userData.newPassword}
                            onChange={handleChange}
                            className="profileModificationInput"
                        />
                    </div>
                    <div className="profileModificationGroup">
                        <label className="profileModificationLabel">Új jelszó megerősítése</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={userData.confirmNewPassword}
                            onChange={handleChange}
                            className="profileModificationInput"
                        />
                    </div>
                    <button type="submit" className="profileModificationButton">Módosítások mentése</button>
                </form>
            </div>
        </div>
    );
};

export default ProfileModification;
