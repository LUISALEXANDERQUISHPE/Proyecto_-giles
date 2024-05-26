import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";
import images from '../Assets/img/images';
import './LoginForm.css';

const LoginForm = () => {
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');



    const handleCorreoElectronicoChange = (e) => {
        const value = e.target.value;
        setCorreoElectronico(value);
    };

    const handleCorreoElectronicoBlur = () => {
        if (!correoElectronico.endsWith('@uta.edu.ec')) {
           setError('El correo debe terminar en @uta.edu.ec');
        }else {
            setError(''); // Limpiar el error si el correo ahora es correcto
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Limpiar errores previos
        try {
            const response = await fetch('/login', {
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
                return; // Detener la ejecución más allá de este punto si hay un error
            }
    
            const data = await response.json(); // Analiza la respuesta como JSON
            localStorage.setItem('isAuthenticated', 'true'); // Almacenar estado de autenticación
            window.location.href = '/menu'; // Redirigir al usuario al menú
    
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError(error.message || 'Error al iniciar sesión');
        }
    };
    
    
    
    return (
        <div className='container'>
            <div className='login-wrapper'>
                <div className='wrapper'>
                    <form onSubmit={handleSubmit}>
                        <h1>Universidad Técnica<br />de Ambato</h1>
                        <h2>ADMINISTRACION DE TITULACION</h2>
                        {error && <div className="error-message">{error}</div>}
                        <div className="input-box">
                            <label htmlFor="email">DIRECCION DE CORREO INSTITUCIONAL</label>
                            <input type='email' id="email" required value={correoElectronico} onChange={handleCorreoElectronicoChange} onBlur={handleCorreoElectronicoBlur} />
                        </div>
                        <div className="input-box">
                            <label htmlFor="password">CONTRASEÑA</label>
                            <input type='password' id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            <FaEyeSlash className='icon' />
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
