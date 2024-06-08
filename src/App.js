import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/Register/RegisterForm';
import RequireAuth from './Components/RequireAuthentic/RequireAuth';
import Layout from './Components/Layaout/Layout'; // Importa el layout
import UserProfile from './Components/UserProfile/UserProfile'; // Importa el perfil de usuario
import RegEstudent from './Components/RegEstudent/RegistroEstudent'; // Importa el registro de estudiantes
import Students from './Components/Students/Student';
import Review from './Components/Review/Review'

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
                    <Route path="/register-student" element={<RegEstudent />} /> {/* Agrega esta línea */}
                    <Route path="/student" element={<Students />} /> {/* Agrega esta línea */}
                    <Route path="/review/:id" element={<Review />} /> 
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
