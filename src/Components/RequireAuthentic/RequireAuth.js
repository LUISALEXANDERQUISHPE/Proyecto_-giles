
// src/Components/RequireAuth/RequireAuth.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');  // Aquí verificas si el usuario está autenticado

    if (!isAuthenticated) {
        // Redirige al login si no hay una sesión activa
        return <Navigate to="/" />;
    }

    return children;  // Si está autenticado, renderiza los componentes hijos
};

export default RequireAuth;
