import React from 'react';
import './LoginForm.css';
import { FaEyeSlash } from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";
import images from '../Assets/img/images';

const LoginForm = ({ toggleForm }) => {
    return (
        <div className='container'>
            <div className='login-wrapper'>
                <div className='wrapper'>
                    <form action="">
                        <h1>Universidad Técnica<br />de Ambato</h1>
                        <h2>ADMINISTRACION DE TITULACION</h2>
                        <div className="input-box">
                            <label htmlFor="email">DIRECCION DE CORREO INSTITUCIONAL</label>
                            <input type='text' id="email" required />
                        </div>
                        <div className="input-box">
                            <label htmlFor="password">CONTRASEÑA</label>
                            <input type='password' id="password" required />
                            <FaEyeSlash className='icon' />
                        </div>
                        <div className="remember-forgot">
                            <label><input type='checkbox' /> RECUERDAME</label>
                        </div>
                        <button type='submit'>INICIAR SESION</button>
                        <div className='register-link'>
                            <p>
                                <RiVipCrownFill className='icon1' />
                                FISEI <a href='#' onClick={toggleForm}>   |    REGISTRARSE</a>
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
