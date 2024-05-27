import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";
import images from '../Assets/img/images';
import './LoginForm.css';

const LoginForm = () => {
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleCorreoElectronicoChange = (e) => {
        setCorreoElectronico(e.target.value);
    };

    const handleCorreoElectronicoBlur = () => {
        if (!correoElectronico.endsWith('@uta.edu.ec')) {
            setError('El correo debe terminar en @uta.edu.ec');
        } else {
            setError('');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5000/login', { // Asegúrate de que la URL sea correcta
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo_electronico: correoElectronico,
                    contrasenia: password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || `HTTP error! status: ${response.status}`);
                return;
            }

            const data = await response.json();
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userName', `${data.nombre} ${data.apellido}`);
            localStorage.setItem('userEmail', correoElectronico);
            window.location.href = '/menu';

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError(error.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className='container'>
            <div className='login-wrapper'>
                <div className='wrapper'>
                    <form onSubmit={onSubmit}>
                        <h1>Universidad Técnica<br />de Ambato</h1>
                        <h2>ADMINISTRACION DE TITULACION</h2>
                        {error && <div className="error-message">{error}</div>}
                        <div className="input-box">
                            <label htmlFor="email">DIRECCION DE CORREO INSTITUCIONAL</label>
                            <input
                                type='email'
                                id="email"
                                required
                                value={correoElectronico}
                                onChange={handleCorreoElectronicoChange}
                                onBlur={handleCorreoElectronicoBlur}
                            />
                        </div>
                        <div className="input-box">
                            <label htmlFor="password">CONTRASEÑA</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {showPassword ? (
                                <FaEye className='icon' onClick={togglePasswordVisibility} />
                            ) : (
                                <FaEyeSlash className='icon' onClick={togglePasswordVisibility} />
                            )}
                        </div>
                        <div className="remember-forgot">
                            <label><input type='checkbox' /> RECUERDAME</label>
                        </div>
                        <button type='submit'>INICIAR SESION</button>
                        <div className='register-link'>
                            <p>
                                <RiVipCrownFill className='icon1' />
                                FISEI <Link to="/register">REGISTRARSE</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <div className="image-wrapper">
                <img src={images.img1} alt="Descripción de la imagen" />
            </div>
            <div className="image-wrapper1">
                <img src={images.img2} alt="Descripción de la imagen" />
            </div>
        </div>
    );
};

export default LoginForm;
