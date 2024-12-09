import React, { useState } from 'react';
import './style.css';

function PasswordReset() {
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('New password:', newPassword);
};

return (
    <div className="Login">
    <div className="wrapper">
        <h1>Jelszó visszaállítása</h1>
    <form onSubmit={handleSubmit}>
        <div className="input-box">
            <input
                type="password"
                placeholder="Új jelszó"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
        </div>
        
        <button type="submit" className="btn">Jelszó megváltoztatása</button>
    </form>
    </div>
    </div>
);
}

export default PasswordReset;
