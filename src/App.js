import React, { useState } from 'react';
import './App.css';
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/Register/RegisterForm';

function App() {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div>
      {isRegistering ? (
        <RegistrationForm toggleForm={toggleForm} />
      ) : (
        <LoginForm toggleForm={toggleForm} />
      )}
    </div>
  );
}

export default App;
