import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style.css';
import { motion } from 'framer-motion';

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
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

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
				<div className='wrapper'>
					<h2 className='registerh2'>Regisztráció</h2>
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
						<button type="submit" className='btn'>Regisztráció</button>
					</form>
					{responseMessage && <p className="response-message">{responseMessage}</p>}
				</div>
			</motion.div>
		</div>
	);
};

export default RegistrationForm;
