import React, { useState, useEffect } from 'react';
import images from '../Assets/img/images';
import './CreateInforme.css';
import { Link, useLocation } from 'react-router-dom';
import { alertaCrearActividad } from './AlertActividad'; // Importar la función de alerta

const CreateInforme = () => {
  const [studentData, setStudentData] = useState(null);
  const [porcentajeAvance, setPorcentajeAvance] = useState('');
  const [tituloInforme, setTituloInforme] = useState('');
  const [fechaInforme, setFechaInforme] = useState('');

  const location = useLocation();
  const studentInfo = location.state ? location.state.studentInfo : null;

  useEffect(() => {
    if (studentInfo) {
      setStudentData(studentInfo);
    } else {
      fetchStudentData();
    }
  }, [studentInfo]);

  const fetchStudentData = async () => {
    try {
      const response = await fetch('/estudiante/1'); // Reemplaza '1' con el ID del estudiante correcto
      const data = await response.json();
      setStudentData(data);
    } catch (error) {
      console.error('Error al obtener los datos del estudiante:', error);
    }
  };

  const handleGuardar = () => {
    // Aquí puedes enviar el porcentaje de avance al servidor para guardarlo
    console.log('Porcentaje de avance guardado:', porcentajeAvance);
  };

  const handleCrearActividad = (actividadData) => {
    // Aquí puedes manejar la lógica para crear la actividad con los datos proporcionados
    console.log('Nueva actividad creada:', actividadData);
  };

  const handleCrearClick = () => {
    // Validar que todos los campos del informe estén llenos
    if (tituloInforme && fechaInforme && porcentajeAvance) {
      // Mostrar la alerta para crear una nueva actividad
      alertaCrearActividad(handleCrearActividad);
    } else {
      alert('Por favor complete todos los campos del informe antes de crear una actividad.');
    }
  };

  return (
    <div className="profile-container">
      <div className='container-Header'>
        <div className='subtitle'>
          <h4>Estudiantes Crear-Informe</h4>
        </div>
        <div className="profile-header">
          <img src={images.img1} alt="Logo UTA" className="profile-logo" />
        </div>
      </div>

      <div className="central-content">
        <div className="left-section">
          <div className="student-info">
            <p><strong>Estudiante:</strong> <span>{studentData ? `${studentData.nombres} ${studentData.apellidos}` : 'Cargando...'}</span></p>
            <p><strong>Carrera:</strong> <span>{studentData ? studentData.nombre_carrera : 'Cargando...'}</span></p>
            <p><strong>Fecha aprobada:</strong> <span>{studentData ? studentData.fecha_aprobacion : 'Cargando...'}</span></p>
            <p><strong>Título de informe:</strong> <input type="text" className="input-field" value={tituloInforme} onChange={(e) => setTituloInforme(e.target.value)} /></p>
            <p><strong>Fecha informe:</strong> <input type="date" className="input-field" value={fechaInforme} onChange={(e) => setFechaInforme(e.target.value)} /></p>
            <p><strong>Porcentaje avance:</strong> <input type="text" value={porcentajeAvance} className="input-field" onChange={(e) => setPorcentajeAvance(e.target.value)} /></p>
          </div>

          <div className="activities">
            <h4>Actividades</h4>
            <table>
              <thead>
                <tr>
                  <th>Fecha de actividad</th>
                  <th>Descripcion</th>
                </tr>
              </thead>
              <tbody>
                {/* Aquí puedes llenar las actividades del estudiante si las tienes */}
              </tbody>
            </table>
            <div className="buttons">
              <button onClick={handleCrearClick}>Crear</button>
              <button>Modificar</button>
              <button>Eliminar</button>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="report-preview">
            <h4>Ejemplo de Asunto Técnico</h4>
            <div className="report-content">
              <p>1. ANTECEDENTES...</p>
              <p>2. OBJETO DEL CONTRATO...</p>
            </div>
            <button>Descargar</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInforme;
