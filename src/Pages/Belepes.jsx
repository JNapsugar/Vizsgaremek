import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Belepes_Regisztacio.css";
import { motion } from "framer-motion";

export const Belepes = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = { loginName: username, Password: password };
        try {
            const loginResponse = await loginUser(payload);
            await fetchUserDetails(username);
            sessionStorage.setItem("token", loginResponse.token);
            sessionStorage.setItem("username", username);
            navigate("/profil");
        } catch (error) {
            console.error("Bejelentkezési hiba:", error.message);
            setError(error.message || "A bejelentkezés nem sikerült.");
        }
    };

    //Bejelentkezés
    const loginUser = async (payload) => {
        try {
            const response = await axios.post("https://localhost:7079/api/felhasznalo/login", payload, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || "A bejelentkezés nem sikerült");
        }
    };

    //Felhasználó adatainak lekérése
    const fetchUserDetails = async (username) => {
        try {
            const response = await axios.get(`https://localhost:7079/api/Felhasznalo/me/${username}`);
            sessionStorage.setItem("permission", response.data.permissionId);
            sessionStorage.setItem("userId", response.data.id);
        } catch (error) {
            console.error("Hiba a felhasználói adatok lekérésekor:", error.message);
            throw new Error(error.response?.data || "Nem sikerült lekérni a felhasználói adatokat");
        }
    };

    return (
        <div className="Login">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.3 }}>
                <div className="loginDiv">
                    <h1 className="loginTitle">Bejelentkezés</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Felhasználónév"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Jelszó"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="error">{error}</p>}
                        <Link to="/elfelejtettjelszo" className="login-link">Elfelejtette a jelszavát?</Link>
                        <button type="submit" className="loginBtn">
                            Bejelentkezés
                        </button>
                    </form>

                    <Link to="/regisztracio" className="login-link">Még nincs fiókja? Regisztráljon most!</Link>
                </div>
            </motion.div>
        </div>
    );
}
export default Belepes;
