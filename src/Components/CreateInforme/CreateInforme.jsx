import React, { useState, useEffect, useCallback } from 'react';
import images from '../Assets/img/images';
import './CreateInforme.css';
import { useParams, useLocation } from 'react-router-dom';
import { alertaCrearActividad } from './AlertActividad'; // Importar la función de alerta

const CreateInforme = () => {
  const { id } = useParams(); // Obtener el ID del estudiante desde la URL
  const [studentData, setStudentData] = useState(null);
  const [porcentajeAvance, setPorcentajeAvance] = useState('');
  const [tituloInforme, setTituloInforme] = useState('');
  const [fechaInforme, setFechaInforme] = useState('');
  const [inputsEnabled, setInputsEnabled] = useState(false); // Estado para habilitar/deshabilitar inputs
  const [idTesis, setIdTesis] = useState(''); // Estado para almacenar el id de la tesis
  const [informeId, setInformeId] = useState(null);

  const location = useLocation();
  const studentInfo = location.state ? location.state.studentInfo : null;

  const fetchStudentData = useCallback(async () => {
    try {
      const response = await fetch(`/estudiante/${id}`);
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
        setIdTesis(data.id_tesis); // Establecer el id de la tesis en el estado
      } else {
        throw new Error('Error al cargar los datos del estudiante');
      }
    } catch (error) {
      console.error('Error al obtener los datos del estudiante:', error);
    }
  }, [id]);

  useEffect(() => {
    if (studentInfo) {
      setStudentData(studentInfo);
      setIdTesis(studentInfo.id_tesis);
    } else {
      fetchStudentData();
    }
  }, [studentInfo, fetchStudentData]);

  useEffect(() => {
    const porcentajeTesis = async () => {
      if (idTesis) {
        try {
          const respuesta = await fetch(`/getPorcent/${idTesis}`);
          if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
          }
          const data = await respuesta.json();
          setPorcentajeAvance(data.totalPorcentaje);
        } catch (error) {
          console.error('Error al obtener el porcentaje de la tesis:', error);
        }
      }
    };

    porcentajeTesis();
  }, [idTesis]);

  const handleGuardar = async () => {
    try {
      const response = await fetch("/crearInforme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tituloInforme,
          fechaInforme,
          porcentajeAvance,
          idTesis,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setInformeId(data.idInforme); // Guarda el ID del informe en el estado
        alert(data.message);
        return data.idInforme; // Retorna el idInforme para uso inmediato si es necesario
      } else {
        alert("Error al guardar el informe: " + data.error);
      }
    } catch (error) {
      console.error('Error al guardar el informe:', error);
      alert("Error al guardar el informe en la base de datos");
    }
  };

  const handleCrearActividad = async (idInforme, descripcionActividad) => {
    try {
      const response = await fetch("/crearActividad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descripcion: descripcionActividad, // Descripción de la actividad
          fecha_actividad: new Date().toISOString().split('T')[0], // Fecha actual en formato ISO
          id_informe: idInforme, // ID del informe pasado como argumento
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la actividad');
      }

      const data = await response.json();
      console.log('Nueva actividad creada:', data); // Mostrar la respuesta en la consola para ver si se creó la actividad correctamente
      alert("Actividad creada correctamente");
    } catch (error) {
      console.error('Error al crear la actividad:', error);
      alert("Error al crear la actividad");
    }
  };

  const handleCrearClick = async () => {
    if (!inputsEnabled) {
      setInputsEnabled(true); // Habilita los inputs si están deshabilitados
    } else {
      if (tituloInforme && fechaInforme && porcentajeAvance) {
        const idInforme = await handleGuardar(); // Asegúrate de esperar aquí
        if (idInforme) {
          alertaCrearActividad(idInforme, handleCrearActividad); // Pasa el ID a la función de alerta
        }
      } else {
        alert('Por favor complete todos los campos del informe antes de continuar.');
      }
    }
  };

  const handlePorcentajeChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && value >= 0 && value <= 100)) {
      setPorcentajeAvance(value);
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
            <p><strong>Título de informe:</strong> 
              <input type="text" 
                     className="input-field" 
                     value={tituloInforme} 
                     onChange={(e) => setTituloInforme(e.target.value)} 
                     disabled={!inputsEnabled} 
              />
            </p>
            <p><strong>Fecha informe:</strong> 
              <input type="date" 
                     className="input-field input-field-fecha" 
                     value={fechaInforme} 
                     onChange={(e) => setFechaInforme(e.target.value)} 
                     disabled={!inputsEnabled} 
              />
            </p>
            <p><strong>Porcentaje avance:</strong> 
              <input type="number" 
                     className="input-field input-field-porcentaje" 
                     value={porcentajeAvance} 
                     onChange={handlePorcentajeChange} 
                     min="0" max="100" 
                     disabled={!inputsEnabled} 
              />
            </p>
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
              <button onClick={handleCrearClick}>
                {inputsEnabled ? 'Guardar y Continuar' : 'Crear'}
              </button>
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
