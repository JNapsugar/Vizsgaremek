import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

const RegistrationForm = () => {
const [formData, setFormData] = useState({
    name: "",
    loginName: "",
    email: "",
    password: "",
});

const [responseMessage, setResponseMessage] = useState("");

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post("https://localhost:7079/api/Login/Register", formData);
        setResponseMessage(response.data); 
    if (response.status === 200) {
        alert('Sikeres regisztráció!'); 
        navigate('/profil')
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
        <button type="submit" className='btn'>Regisztráció</button>
    </form>
        {responseMessage && <p>{responseMessage}</p>}
    </div>
    </div>
    );
};

export default RegistrationForm;