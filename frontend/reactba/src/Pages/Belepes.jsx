import React, { useState } from "react";
import {Link} from "react-router-dom";


function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
    event.preventDefault();
};

return (
    <div className="Login">
    <div className="wrapper">
        <h1>Bejelentkezés</h1>

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
        <Link to={"/elfelejtettjelszo"} className="login-link">Elfelejtett jelszó</Link>
        <button type="submit" className="btn">
            Bejelentkezés
        </button>
    </form>
    <Link to={"/regisztracio"} className="login-link">Még nincs fiókja? Regisztráljon most!</Link>
</div>
</div>
);
}

export default LoginPage;
