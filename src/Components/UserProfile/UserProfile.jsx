import React, { useState, useEffect } from 'react';
import images from '../Assets/img/images';
import './UserProfile.css';

const UserProfile = () => {
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

  return (
    <div className="profile-container">
      <div className='container-Header'>
        <div  className='subtitle' >
          <h4 >Mi perfil</h4>
        </div>
        <div className="profile-header">
          <img   src={images.img1} alt="Logo UTA" class="profile-logo" />
        </div>
      </div>

      <div className="profile-content">
        <h1>Bienvenido<br />tutor/a.</h1>
        <div className="profile-info">
          <img src={images.img4} alt="Perfil" className="profile-picture" />
          <div className="user-details">
            <h2>{userName}</h2>
            <br></br>
            <h4>{userEmail}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
