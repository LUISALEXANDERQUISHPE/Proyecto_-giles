import React, { useState, useEffect } from 'react';
import images from '../Assets/img/images';
import './UserProfile.css';

const UserProfile = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');
    const storedUserId = localStorage.getItem('userId');

    console.log('Stored User ID:', storedUserId);

    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    }
    if (storedUserId && !isNaN(parseInt(storedUserId, 10))) {
      setUserId(parseInt(storedUserId, 10));
    }
  }, []);
  console.log('User ID in State:', userId);

  return (
    <div className="profile-container">
      <div className='container-Header'>
        <div className='subtitle'>
          <h4>Mi perfil</h4>
        </div>
        <div className="profile-header">
          <img src={images.img1} alt="Logo UTA" className="profile-logo" />
        </div>
      </div>

      <div className="profile-content">
        <h1>Bienvenido<br />tutor/a.</h1>
        <div className="profile-info">
          <img src={images.img4} alt="Perfil" className="profile-picture" />
          <div className="user-details">
            <h2>{userName}</h2>
            <br />
            <h4>{userEmail}</h4>
            <br />
             {/* Muestra el ID del tutor//<h4>ID Tutor: {userId}</h4>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
