import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            loginName: username, 
            Password: password,  
        };

        try {
            const response = await fetch("https://localhost:7079/api/felhasznalo/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorMessage = await response.text(); 
                throw new Error(errorMessage || "Login failed.");
            }

            const data = await response.json();
            sessionStorage.setItem("token", data.token); 
            sessionStorage.setItem("username", username); 
            axios.get(`https://localhost:7079/api/Felhasznalo/me/${username}`)
                    .then(res => {sessionStorage.setItem("permission", res.data.permissionId);
                                    sessionStorage.setItem("userId", res.data.id);
                    })
                    .catch(error => console.log(error));
            navigate("/profil");
        } catch (error) {
            console.error("Login error:", error.message);
            setError(error.message); 
        }
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

                    {error && <p className="error">{error}</p>}

                    <Link to="/elfelejtettjelszo" className="login-link">Elfelejtett jelszó</Link>
                    <button type="submit" className="btn">
                        Bejelentkezés
                    </button>
                </form>

                <Link to="/regisztracio" className="login-link">Még nincs fiókja? Regisztráljon most!</Link>
            </div>
        </div>
    );
}

export default LoginPage;
