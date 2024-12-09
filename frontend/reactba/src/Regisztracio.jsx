import React, { useState } from 'react';
import './style.css';

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration submitted', { username, password, email });
};

return (
    <div className="Login">
    <div className="wrapper">
        <h1>Regisztráció</h1>
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

            <div className="input-box">
                <input 
                    type="email" 
                    placeholder="E-mail" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
            </div>

            <button type="submit" className="btn">Regisztráció</button>
        </form>
    </div>
    </div>
);
}

export default Registration;
