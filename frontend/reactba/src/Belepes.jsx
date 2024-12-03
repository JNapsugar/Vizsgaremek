import React, { useState } from "react";
import "./style.css";


function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Logging in with", username, password);
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

        <a href="elfelejtettjelszo.html">
            <p className="belepesBtn">Elfelejtett jelszó</p>
        </a>

        <button type="submit" className="btn">
            Bejelentkezés
        </button>
    </form>

    <div className="sign-up-link">
        <a href="regisztracio.html">Még nincs fiókja? Regisztráljon most!</a>
    </div>
</div>
</div>
);
}

export default LoginPage;
