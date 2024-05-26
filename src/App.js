import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/Register/RegisterForm';
import MenuForm from './Components/MenuForm/MenuForm';
import RequireAuth from './Components/RequireAuthentic/RequireAuth';  // Asegúrate de importar RequireAuth correctamente

function App() {
    useEffect(() => {
        // Esta función anula el comportamiento del botón de retroceso del navegador.
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = () => {
            window.history.go(1);
        };
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/menu" element={<RequireAuth><MenuForm /></RequireAuth>} />
            </Routes>
        </Router>
    );
}

export default App;
