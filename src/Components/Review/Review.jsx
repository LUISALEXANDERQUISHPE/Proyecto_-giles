// Components/Profile/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import images from '../Assets/img/images';
import './Review.css';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';

const Review = () => {


return (
    <div className="profile-container">
        <div className='container-Header'>
            <div className='subtitle'>
                <h4>Estudiantes - Revisión</h4>
            </div>
            <div className="profile-header">
                <img src={images.img1} alt="Logo UTA" className="profile-logo" />
            </div>
        </div>
        
           <div className='flexi' >
                <div class="info-item position-Review">
                        <label>Estudiante:</label>
                        <strong className='Nombre'>Luis Quishpe</strong>
                </div>
                 <div class="info-item position-Review">
                        <label>Carrera:</label>
                        <strong className='Carrera'>Matematicas</strong>
                </div>
                <div class="info-item position-Review">
                        <label>Tema:</label>
                        <strong className='tema'>Métodos Ágiles</strong>
                </div>
                <div className='table' >
                   <h1>Hola mundo </h1>
                </div>

           </div>
        
    </div>

  );
}

export default Review;
