import React from 'react';
import './perfilStyles.css';

const PerfilForm = () => {
  return (
    <div className="wrapper">
            <div className="top-bar">
                <div className="top-bar-item">Mi perfil</div>
                <img className="top-bar-image" src='.\Components\Assets\img\sello_uta.png'  />
                <div className="top-bar-item"></div>
            </div>
            <div className="container">
                <div className="header">Bienvenido/a tutor/a</div>
                <div className="profile">
                    <img src={"https://via.placeholder.com/100"} alt="Foto del tutor" />
                    <div className="profile-info">
                        <div>Nombre: </div>
                        <div>Apellido: </div>
                        <div>Correo: </div>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default PerfilForm;
