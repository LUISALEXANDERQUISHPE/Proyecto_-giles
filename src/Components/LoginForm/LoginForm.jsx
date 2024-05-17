import React from 'react';
import './LoginForm.css';
import { FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
    return (
        <div className='container'>
            <div className='login-wrapper'>
                <div className='wrapper'>
                    <form action="">
                        <h1>ADMINISTRACION DE TITULACION</h1>
                        <div className="input-box">
                            <label htmlFor="email">DIRECCION DE CORREO INSTITUCIONAL</label>
                            <input type='text' id="email" required/>
                        </div>
                        <div className="input-box">
                            <label htmlFor="password">CONTRASEÑA</label>
                            <input type='password' id="password" required/>
                            <FaEyeSlash className='icon' />
                        </div>
                        <div className="remember-forgot">
                            <label><input type='checkbox'/> Recuerdame</label>
                            <a href='#'>Forgot Password?</a>
                        </div>
                        <button type='submit'>INICIAR SESION</button>
                        <div className='register-link'>
                            <p>Don't have an account? <a href='#'>Register</a></p>
                        </div>
                    </form>
                </div>
            </div>
            <div className="image-wrapper">
                <img src="src\Components\LoginForm\width_194.png" alt="Descripción de la imagen" />
            </div>
        </div>
    );
};

export default LoginForm;
