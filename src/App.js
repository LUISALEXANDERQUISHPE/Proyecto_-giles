import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/Register/RegisterForm';
import RequireAuth from './Components/RequireAuthentic/RequireAuth';
import Layout from './Components/Layaout/Layout';
import UserProfile from './Components/UserProfile/UserProfile';
import RegEstudent from './Components/RegEstudent/RegistroEstudent';
import Students from './Components/Students/Student';
import Review from './Components/Review/Review';
import CreateInforme from './Components/CreateInforme/CreateInforme'; // Importa el componente de CreateInforme

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
                <Route element={<RequireAuth><Layout /></RequireAuth>}>
                    <Route path="/menu" element={<UserProfile />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/register-student" element={<RegEstudent />} />
                    <Route path="/student" element={<Students />} />
                    <Route path="/review/:id" element={<Review />} />
                    <Route path="/create-informe/:id" element={<CreateInforme />} /> {/* Nueva ruta para CreateInforme */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;