import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style.css';

function PasswordReset() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

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
            <div className="wrapper">
                <h1>Jelszó visszaállítása</h1>
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
                    <button type="submit" className="btn">Jelszó visszaállítása</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default PasswordReset;
