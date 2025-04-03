import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Styles/Belepes_Regisztacio.css";
import { motion } from 'framer-motion';

function ElfelejtettJelszo() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    //Új jelszó kérés
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://localhost:7079/api/Felhasznalo/RequestPassword/${email}`);
            setMessage(response.data);
            setTimeout(() => {
                navigate('/belepes');
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data || 'Hiba történt a kérés feldolgozása közben.');
        }
    };
    
    return (
        <div className="Login">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.3 }}>
            <div className="loginDiv">
                <h1 className='loginTitle'>Jelszó visszaállítása</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Email cím"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="loginBtn">Jelszó visszaállítása</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </motion.div>
        </div>
    );
}

export default ElfelejtettJelszo;
