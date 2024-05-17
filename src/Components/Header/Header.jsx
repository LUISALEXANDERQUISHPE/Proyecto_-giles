import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className='banner'>
            <div className='header-content'>
                <h1>Mi Aplicación</h1>
                <img src='src\Components\Header\header.png' alt='Logo de la aplicación' />
            </div>
        </header>
    );
};

export default Header;
