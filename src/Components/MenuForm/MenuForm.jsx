import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importar Link
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
    // Recuperar datos del usuario del almacenamiento local
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');
    // Actualizar el estado con los datos del usuario
    if (storedUserName && storedUserEmail) {
      setUserName(storedUserName);
      setUserEmail(storedUserEmail);
    } else {
      // Si no hay datos en el almacenamiento local, obtenerlos del servidor
      fetchUserInfo();
    }
  }, []);

  // Función para obtener información del usuario del servidor
  const fetchUserInfo = async () => {
    try {
      // Realizar la solicitud al servidor para obtener los datos del usuario
      const response = await fetch('http://localhost:5000/getUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo_electronico: userEmail }),
      });
      const data = await response.json();
      // Establecer el nombre del usuario en el estado
      setUserName(data.nombre);
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
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
            <span>{userName}</span> {/* Mostrar el nombre del usuario */}
          </div>
        </div>
        <div className="profile-section">
          <img src={images.img4} alt="Perfil" />
          <h1>Bienvenido tutor/a.</h1>
          <p>{userName}</p> {/* Mostrar el nombre del usuario */}
          <p>{userEmail}</p> {/* Mostrar el correo electrónico del usuario */}
        </div>
      </div>
    </div>
  );
}

export default MenuForm;
