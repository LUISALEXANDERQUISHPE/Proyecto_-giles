import React, { useState } from 'react';
import '../Register/registerForm.css'; // Ajusta la ruta según la ubicación real
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";
import images from '../Assets/img/images';

const RegistrationForm = ({ toggleForm }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Nuevo estado para controlar la visibilidad de la contraseña
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Nuevo estado para controlar la visibilidad de la contraseña de confirmación

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (confirmPassword && e.target.value !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (password && e.target.value !== password) {
            setPasswordError('Las contraseñas no coinciden');
        } else {
            setPasswordError('');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Cambiar el estado para alternar la visibilidad de la contraseña
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword); // Cambiar el estado para alternar la visibilidad de la contraseña de confirmación
    };

    return (
        <div className='registration-container'>
            <div className="registration-image-wrapper">
                <img src={images.img1} alt="Descripción de la imagen" />
            </div>

            <div className='registration-wrapper'>

                <div className='registration-form-wrapper'>

                    <form action="http://localhost/register.php" method="POST">

                        <div className='registration-image-wrapper1'>
                            <img src={images.img3} alt="Descripción de la imagen" />
                        </div>

                        <h1>Registrarse</h1>
                        <div className="registration-input-box">
                            <label htmlFor="firstName">NOMBRE</label>
                            <input type='text' id="firstName" required />
                        </div>
                        <div className="registration-input-box">
                            <label htmlFor="lastName">APELLIDOS</label>
                            <input type='text' id="lastName" required />
                        </div>
                        <div className="registration-input-box">
                            <label htmlFor="email">DIRECCION DE CORREO INSTITUCIONAL</label>
                            <input type='email' id="email" required />
                        </div>
                        <div className="registration-input-box">
                            <label htmlFor="password">CONTRASEÑA</label>
                            <input type={showPassword ? 'text' : 'password'} id="password" required onChange={handlePasswordChange} />
                            {showPassword ? (
                                <FaEye className='registration-icon' onClick={togglePasswordVisibility} />
                            ) : (
                                <FaEyeSlash className='registration-icon' onClick={togglePasswordVisibility} />
                            )}
                        </div>
                        <div className="registration-input-box">
                            <label htmlFor="confirmPassword">REPETIR CONTRASEÑA</label>
                            <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" required onChange={handleConfirmPasswordChange} />
                            {showConfirmPassword ? (
                                <FaEye className='registration-icon' onClick={toggleConfirmPasswordVisibility} />
                            ) : (
                                <FaEyeSlash className='registration-icon' onClick={toggleConfirmPasswordVisibility} />
                            )}
                        </div>
                        {passwordError && <p className='registration-error'>{passwordError}</p>}
                        <button type='submit' className='registration-button' disabled={passwordError}>REGISTRARSE</button>
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
