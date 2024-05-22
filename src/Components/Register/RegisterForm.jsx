import React, { useState } from 'react';
import '../Register/registerForm.css'; // Ajusta la ruta según la ubicación real
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";
import images from '../Assets/img/images';

const RegistrationForm = ({ toggleForm }) => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            alert('El nombre solo puede contener letras y espacios');
        }
    };

    const handleApellidosChange = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z\s]*$/; // Solo permite letras y espacios en blanco
        if (regex.test(value)) {
            setApellidos(value);
        } else {
            alert('Los apellidos solo pueden contener letras y espacios');
        }
    };

    const handleCorreoElectronicoChange = (e) => {
        const value = e.target.value;
        setCorreoElectronico(value);
    };

    const handleCorreoElectronicoBlur = () => {
        if (!correoElectronico.endsWith('@uta.edu.ec')) {
            alert('El correo debe terminar en @uta.edu.ec');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evitar que el formulario se envíe automáticamente

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Enviar el formulario
        try {
            const response = await fetch("http://localhost:80/Agiles/mi-app/src/Components/Register/register.php", {
                method: "POST",
                body: new FormData(e.target) // Envía los datos del formulario
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('¡Registro exitoso!');
                    // Restablecer el estado del formulario
                    setNombre('');
                    setApellidos('');
                    setCorreoElectronico('');
                    setPassword('');
                    setConfirmPassword('');
                } else {
                    alert(data.message || 'Hubo un problema al registrar usuario');
                }
            } else {
                throw new Error('Hubo un problema al comunicarse con el servidor');
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            alert("Hubo un problema al enviar el formulario");
        }
    };

    return (
        <div className='registration-container'>
            <div className="registration-image-wrapper">
                <img src={images.img1} alt="Descripción de la imagen" />
            </div>

            <div className='registration-wrapper'>
                <div className='registration-form-wrapper'>
                    <form onSubmit={handleSubmit}>
                        <div className='registration-image-wrapper1'>
                            <img src={images.img3} alt="Descripción de la imagen" />
                        </div>

                        <h1>Registrarse</h1>
                        <div className="registration-input-box">
                            <label htmlFor="firstName">NOMBRE</label>
                            <input type='text' id="firstName" name="nombre" required value={nombre} onChange={handleNombreChange} />
                        </div>
                        <div className="registration-input-box">
                            <label htmlFor="lastName">APELLIDOS</label>
                            <input type='text' id="lastName" name="apellidos" required value={apellidos} onChange={handleApellidosChange} />
                        </div>
                        <div className="registration-input-box">
                            <label htmlFor="email">DIRECCION DE CORREO INSTITUCIONAL</label>
                            <input type='email' id="email" name="correo_electronico" required value={correoElectronico} onChange={handleCorreoElectronicoChange} onBlur={handleCorreoElectronicoBlur} />
                        </div>
                        <div className="registration-input-box">
                            <label htmlFor="password">CONTRASEÑA</label>
                            <input type={showPassword ? 'text' : 'password'} id="password" name="contrasena" required value={password} onChange={handlePasswordChange} />
                            {showPassword ? (
                                <FaEye className='registration-icon' onClick={togglePasswordVisibility} />
                            ) : (
                                <FaEyeSlash className='registration-icon' onClick={togglePasswordVisibility} />
                            )}
                        </div>
                        <div className="registration-input-box">
                            <label htmlFor="confirmPassword">REPETIR CONTRASEÑA</label>
                            <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" required value={confirmPassword} onChange={handleConfirmPasswordChange} />
                            {showConfirmPassword ? (
                                <FaEye className='registration-icon' onClick={toggleConfirmPasswordVisibility} />
                            ) : (
                                <FaEyeSlash className='registration-icon' onClick={toggleConfirmPasswordVisibility} />
                            )}
                        </div>
                        <button type='submit' className='registration-button'>REGISTRARSE</button>
                        <div className='registration-register-link'>
                            <p>
                                <RiVipCrownFill className='registration-icon1' />
                                FISEI <a href='#' onClick={toggleForm}>   |    INICIAR SESION</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
