import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavMenu.css'; // Asegúrate de que esta línea no esté comentada
import { FaUser, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';
import { IoMdPeople } from 'react-icons/io';
import { RiVipCrownFill } from "react-icons/ri";

const NavMenu = ({ handleLogout }) => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="header">
        <RiVipCrownFill className='icon2'/>
        <span>FISEI</span>
      </div>
      <div className="nav-menu">
        <div className={`menu-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <Link to="/profile">
            <FaUser className='icon1'/>
            <span>Mi perfil</span>
          </Link>
        </div>
        <div className={`menu-item ${location.pathname === '/register-student' ? 'active' : ''}`}>
          <Link to="/register-student">
            <MdSchool className='icon1'/>
            <span>Registro de estudiante</span>
          </Link>
        </div>
        <div className={`menu-item ${location.pathname === '/Student' ? 'active' : ''}`}>
          <Link to="/Student">
            <IoMdPeople className='icon1'/>
            <span>Estudiantes</span>
          </Link>
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
          <Link to="/help">
            <FaQuestionCircle />
            <span>Ayuda y soporte</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavMenu;
