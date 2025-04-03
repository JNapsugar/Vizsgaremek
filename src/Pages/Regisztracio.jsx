import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Styles/Belepes_Regisztacio.css";
import { motion } from 'framer-motion';

const Regisztracio = () => {
    const [formData, setFormData] = useState({
        name: "",
        loginName: "",
        email: "",
        password: "",
        permissionId: 3,
    });

    const [responseMessage, setResponseMessage] = useState("");
    const navigate = useNavigate();

    //Jelszóellenőrzés
	const validatePassword = (password) => {
		const requirements = [
			{ regex: /.{8,}/, message: "Legalább 8 karakter hosszúnak kell lennie" },
			{ regex: /[a-z]/, message: "Tartalmaznia kell legalább egy kisbetűt" },
			{ regex: /[A-Z]/, message: "Tartalmaznia kell legalább egy nagybetűt" },
			{ regex: /[0-9]/, message: "Tartalmaznia kell legalább egy számot" }
		];
		const failedRequirement = requirements.find(req => !req.regex.test(password));
		return failedRequirement ? `A jelszónak ${failedRequirement.message}` : null;
	};

    //Regisztációs adatok módosítása
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    //Regisztációs adatok elküldése
    const handleSubmit = async (e) => {
        e.preventDefault();
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            setResponseMessage(passwordError);
            return;
        }

        try {
            const response = await axios.post("https://localhost:7079/api/Felhasznalo/Register", formData);

            if (response.status === 200) {
                const { token, username } = response.data;
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("username", username);
                navigate('/belepes');
            }
        } catch (error) {
            if (error.response) {
                setResponseMessage(error.response.data);
            } else {
                setResponseMessage("Hiba történt a regisztráció során.");
            }
        }
    };

    return (
        <div className='Login'>
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.3 }}>
                <div className='loginDiv'>
                    <h1 className='loginTitle'>Regisztráció</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='input-box'>
                            <input
                                placeholder='Név'
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                placeholder='Felhasználónév'
                                type="text"
                                name="loginName"
                                value={formData.loginName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                placeholder='Email'
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                placeholder='Jelszó'
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="permission-toggle">
                            <label htmlFor="permission-toggle" className="toggle-label">
                                <span>Kiadó</span>
                                <input
                                    type="checkbox"
                                    id="permission-toggle"
                                    name="permissionId"
                                    value={formData.permissionId === 3 ? "3" : "2"}
                                    checked={formData.permissionId === 3}
                                    onChange={(e) => setFormData({ ...formData, permissionId: e.target.checked ? 3 : 2 })}
                                />
                                <span className="slider"></span>
                                <span>Bérlő</span>
                            </label>
                        </div>
                        <button type="submit" className='loginBtn'>Regisztráció</button>
                    </form>
                    {responseMessage && (
                        <p className='response-message'>{responseMessage}</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Regisztracio;