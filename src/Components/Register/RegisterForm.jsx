import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";
import images from '../Assets/img/images';
import '../Register/registerForm.css'; 

const RegistrationForm = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleNombreChange = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z\s]*$/; // Solo permite letras y espacios en blanco
        if (regex.test(value)) {
            setNombre(value);
        } else {
            setError('El nombre solo puede contener letras y espacios');
        }
    };

    const handleApellidoChange = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z\s]*$/; // Solo permite letras y espacios en blanco
        if (regex.test(value)) {
            setApellido(value);
        } else {
            setError('El apellido solo puede contener letras y espacios');
        }
    };

    const handleCorreoElectronicoChange = (e) => {
        const value = e.target.value;
        setCorreoElectronico(value);
    };

    const handleCorreoElectronicoBlur = () => {
        if (!correoElectronico.endsWith('@uta.edu.ec')) {
            setError('El correo debe terminar en @uta.edu.ec');
        }else{
            setError('');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (event) => {        
        event.preventDefault();
        if(!correoElectronico.endsWith('@uta.edu.ec')){
            setError('El correo debe ser unicamente institucional');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setError('');
        try {
            const response = await fetch('/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    correo_electronico: correoElectronico,
                    contrasenia: password
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            setError('Usuario registrado con éxito.');
            
    
            const data = await response.json();
            setSuccessMessage(data.message);
            // Limpiar los campos del formulario si es necesario
            setNombre('');
            setApellido('');
            setCorreoElectronico('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setError(error.message || 'Error al enviar el formulario');
        }
    };

    return (
        <div className='registration-container'>
            <div className='conta'>
                <div className="registration-image-wrapper">
                    <div className='imgUta'>
                    <img src={images.img1} alt="Descripción de la imagen" />
                    </div>
                </div>
            </div>
         

            <div className='registration-wrapper'>
                <div className='registration-form-wrapper'>
                    <form onSubmit={handleSubmit}>
                        <div className='registration-image-wrapper1'>
                            <div className='img-fisei'>
                            <img src={images.img3} alt="Descripción de la imagen" />
                            </div>
                        </div>

                        <h1>Registrarse</h1>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                        {error && <p className="error-message">{error}</p>}
                        <div className="registration-input-box">
                            <label htmlFor="firstName">NOMBRES</label>
                            <input type='text' id="firstName" name="nombre" required value={nombre} onChange={handleNombreChange} />
                        </div>
                        <div className="registration-input-box">
                            <label htmlFor="lastName">APELLIDOS</label>
                            <input type='text' id="lastName" name="apellido" required value={apellido} onChange={handleApellidoChange} />
                        </div>
                        <div className="registration-input-box">
                            <label htmlFor="email">DIRECCION DE CORREO INSTITUCIONAL</label>
                            <input type='email' id="email" name="correo_electronico" required value={correoElectronico} onChange={handleCorreoElectronicoChange} onBlur={handleCorreoElectronicoBlur} />
                        </div>
                        <div className="registration-input-box">
                            <label htmlFor="password">CONTRASEÑA</label>
                            <input type={showPassword ? 'text' : 'password'} id="password" name="password" required value={password} onChange={handlePasswordChange} />
                            {showPassword ? (
                                <FaEye className='registration-icon' onClick={togglePasswordVisibility} />
                            ) : (
                                <FaEyeSlash className='registration-icon' onClick={togglePasswordVisibility} />
                            )}
                        </div>
                        <div className="registration-input-box">
                            <label htmlFor="confirmPassword">REPETIR CONTRASEÑA</label>
                            <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" required value={confirmPassword} onChange={handleConfirmPasswordChange} />
                            {showConfirmPassword ? (
                                <FaEye className='registration-icon' onClick={toggleConfirmPasswordVisibility} />
                            ) : (
                                <FaEyeSlash className='registration-icon' onClick={toggleConfirmPasswordVisibility} />
                            )}
                        </div>
                        <button type='submit' className='registration-button'>REGISTRARSE</button>
                        <div className='registration-register-link'>
                            <p>
                                <RiVipCrownFill className='registration-icon1 ' />
                                FISEI <Link to="/" >| INICIAR SESION</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;