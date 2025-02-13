import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style.css';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        loginName: "",
        email: "",
        password: "",
        permissionId: 3, 
    });

    const [responseMessage, setResponseMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(formData.permissionId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("https://localhost:7079/api/Felhasznalo/Register", formData);

            if (response.status === 200) {
                const { token, username } = response.data; 

                localStorage.setItem("token", token);
                localStorage.setItem("username", username);

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
            <div className='wrapper'>
                <h2 className='registerh2'>Regisztráció</h2>
                <form onSubmit={handleSubmit}>
                    <div className='input-box'>
                        <input
                            placeholder='Név'
                            type="text"
                            id="name"
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
                            id="loginName"
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
                            id="email"
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
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="permissionId"
                                value="3"
                                onChange={handleChange}
                                checked
                            />
                            Bérlő
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="permissionId"
                                value="2"
                                onChange={handleChange}
                            />
                            Kiadó
                        </label>
                    </div>
                    <button type="submit" className='btn'>Regisztráció</button>
                </form>
                {responseMessage && <p>{responseMessage}</p>}
            </div>
        </div>
    );
};

export default RegistrationForm;
