import React from 'react';
import './MenuFrom.css';
import { Link } from 'react-router-dom';
import { RiVipCrownFill } from "react-icons/ri";

const MenuForm = () => {
    return (
        <div className='container'>
            <h1>Hola mundo como estas</h1>
            <div className='register-link'>
                <p>
                    <RiVipCrownFill className='icon1' />
                    FISEI <Link to="/">REGISTRARSE</Link> {/* Usar Link para la navegación */}
                </p>
            </div>
        </div>
    );
};

export default MenuForm;
