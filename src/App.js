import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/Register/RegisterForm';
import MenuForm from './Components/MenuForm/MenuForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/menu" element={<MenuForm />} />
      </Routes>
    </Router>
  );
}

export default App;
