import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/Register/RegisterForm';
import RequireAuth from './Components/RequireAuthentic/RequireAuth';
import Layout from './Components/Layaout/Layout'; // Asegúrate que la ruta y el nombre del archivo sean correctos.
import UserProfile from './Components/UserProfile/UserProfile';
import RegEstudent from './Components/RegEstudent/RegistroEstudent';
import Students from './Components/Students/Student';
import Review from './Components/Review/Review';
import CreateInforme from './Components/CreateInforme/CreateInforme';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginBlock />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route element={<RequireAuth><Layout /></RequireAuth>}>
                    <Route path="/menu" element={<UserProfile />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/register-student" element={<RegEstudent />} />
                    <Route path="/student" element={<Students />} />
                    <Route path="/review/:id" element={<Review />} />
                    <Route path="/create-informe/:id" element={<CreateInforme />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;

function LoginBlock() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Función para interceptar intentos de navegación
        const handleRouteChange = (event) => {
            // Aquí podrías verificar si el usuario está intentando salir de la página de login
            // y cancelar la navegación dependiendo de ciertas condiciones
            if (location.pathname === '/' && window.history.state && window.history.state.idx > 0) {
                window.history.pushState(null, null, location.pathname);
                alert("No puedes volver atrás después de cerrar sesión. Por favor, inicia sesión de nuevo.");
                event.preventDefault();  // Previene que el evento de navegación continúe
            }
        };

        // Agrega el listener al cargar el componente
        window.addEventListener('popstate', handleRouteChange);

        return () => {
            // Elimina el listener al desmontar el componente
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, [navigate, location]);

    return <LoginForm />;
}
