import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MenuFrom.css';
import { FaUser, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';
import { IoMdPeople } from 'react-icons/io';
import { RiVipCrownFill } from "react-icons/ri";
import images from '../Assets/img/images';

const MenuForm = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');
    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="header">
          <RiVipCrownFill className='icon1'/>
          <span>FISEI</span>
        </div>
        <div>
          <div className="menu-item">
            <FaUser />
            <span>Mi perfil</span>
          </div>
          <div className="menu-item">
            <MdSchool />
            <span>Registro de estudiante</span>
          </div>
          <div className="menu-item">
            <IoMdPeople />
            <span>Estudiantes</span>
          </div>
        </div>
        <div className="footer">
          <div className="menu-item">
            <Link to="/" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Cerrar sesión</span>
            </Link>
          </div>
          <div className="menu-item">
            <FaQuestionCircle />
            <span>Ayuda y soporte</span>
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="top-bar">
          <span>Mi Perfil</span>
          <div className="user-info">
            <img src={images.img1} alt="Logo UTA" />
            <span>{userName}</span>
          </div>
        </div>
        <div className="profile-section">
          <img src={images.img4} alt="Perfil" />
          <h1>Bienvenido tutor/a.</h1>
          <p>{userName}</p>
          <p>{userEmail}</p>
        </div>
      </div>
    </div>
  );
}

export default MenuForm;
