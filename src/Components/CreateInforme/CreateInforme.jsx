  import React, { useState, useEffect, useCallback } from 'react';
  import images from '../Assets/img/images';
  import './CreateInforme.css';
  import { useParams, useLocation } from 'react-router-dom';
  import { alertaCrearActividad } from './AlertActividad';
  import {exitoGuardarInforme } from './AlertActividad'; // Importar la función de alerta

  const CreateInforme = () => {
    const { id } = useParams(); // Obtener el ID del estudiante desde la URL
    const [studentData, setStudentData] = useState(null);
    const [porcentajeAvance, setPorcentajeAvance] = useState('');
    const [tituloInforme, setTituloInforme] = useState('');
    const [fechaInforme, setFechaInforme] = useState('');
    const [inputsEnabled, setInputsEnabled] = useState(false); // Estado para habilitar/deshabilitar inputs
    const [idTesis, setIdTesis] = useState(''); // Estado para almacenar el id de la tesis
    const [informeId, setInformeId] = useState(null);
    const [actividades, setActividades] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4); // Ajusta según tus necesidades
    
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentActividades = actividades.slice(firstIndex, lastIndex);
    



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
    
    const handleGuardarInformeClick = async () => {
      // Verifica que los campos requeridos estén llenos
      if (!tituloInforme || !fechaInforme) {
        alert('Error: Falta ingresar algunos campos requeridos. Por favor, asegúrate de llenar el título del informe y la fecha del informe antes de guardar.');
        return; // Sale de la función si la validación falla
      }
    
      try {
        const respuesta = await fetch("/updateInforme", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            informeId: informeId,
            tituloInforme: tituloInforme,
            fechaInforme: fechaInforme,
            porcentajeAvance: porcentajeAvance,
            idTesis: idTesis
          }),
        });
    
        if (!respuesta.ok) {
          throw new Error('Failed to update the report');
        }
    
        const data = await respuesta.json();
        console.log('Success:', data.message);
        exitoGuardarInforme('Anexo guardado');
        //alert('Informe guardado correctamente!');
      } catch (error) {
        console.error('Error:', error);
        alert("Error al guardar el informe en la base de datos");
      }
    };
    
    const handleConsultarId_informeFicticio = async (callback) => {
      try {
        const response = await fetch("/crearInforme_ficticio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idTesis }),
        });
    
        const data = await response.json();
        if (response.ok) {
          setInformeId(data.idInforme);  // También actualiza el estado por si se necesita en otro lugar
          console.log("Informe ficticio creado con ID:", data.idInforme);
          callback(data.idInforme);  // Ejecutar callback con el nuevo ID
        } else {
          console.error("Error al crear el informe ficticio:", data.error);
        }
      } catch (error) {
        console.error('Error al guardar el informe:', error);
      }
      
    };

    const handleCrearActividad = async () => {
      if (!informeId) {
          // Si no hay `informeId`, primero crea un informe ficticio
          handleConsultarId_informeFicticio((newInformeId) => {
              // Una vez que tenemos el nuevo informeId, llamamos a alertaCrearActividad
              alertaCrearActividad(newInformeId, fetchActividades); // Pasa directamente fetchActividades
          });
      } else {
          // Si ya tenemos un informeId, directamente creamos la actividad
          alertaCrearActividad(informeId, fetchActividades); // Pasa directamente fetchActividades
      }
  };
  
  
  

    
  const fetchActividades = () => {
    if (!informeId) return; // Si no hay informeId, no hacer nada

    fetch(`/actividades/${informeId}`) // Asegúrate de que el endpoint sea correcto
    .then(response => response.json())
    .then(data => {
        console.log("Datos recibidos para actividades:", data); // Mostrar los datos recibidos en la consola
        setActividades(data); // Actualizar el estado con los nuevos datos
    })
    .catch(error => {
        console.error('Error al cargar actividades:', error); // Capturar y mostrar errores si los hay
    });
};




  // Llamada inicial para cargar actividades
  useEffect(() => {
    if (informeId) {
        fetchActividades();
    }
}, [informeId]); // Reactivará la carga de actividades cada vez que informeId cambie


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
                      
                />
              </p>
              <p><strong>Fecha informe:</strong> 
                <input type="date" 
                      className="input-field input-field-fecha" 
                      value={fechaInforme} 
                      onChange={(e) => setFechaInforme(e.target.value)} 
                    
                />
              </p>
              <p><strong>Porcentaje avance:</strong> 
                <input type="number" 
                      className="input-field input-field-porcentaje" 
                      value={porcentajeAvance} 
                      onChange={handlePorcentajeChange} 
                      min="0" max="100" 
                      
                />
              </p>
            </div>

            <div className="activities">
              <h4>Actividades</h4>
              <table>
                <thead>
                    <tr>
                        <th>Fecha de actividad</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {currentActividades.length > 0 ? currentActividades.map((actividad, index) => (
                        <tr key={index}>
                            <td>{new Date(actividad.fecha_actividad).toISOString().split('T')[0]}</td>
                            <td>{actividad.descripcion}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="2">No hay actividades registradas</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Anterior</button>
                <span>Página {currentPage} de {Math.ceil(actividades.length / itemsPerPage)}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(actividades.length / itemsPerPage)))} disabled={currentPage === Math.ceil(actividades.length / itemsPerPage)}>Siguiente</button>
            </div>

            <br />
              <div className="buttons">
                <button onClick={handleCrearActividad}>
                  Agregar actividades
                </button>
                <button>Modificar</button>
                <button>Eliminar</button>
                <button onClick={handleGuardarInformeClick} disabled={!tituloInforme || !fechaInforme}>
                Guardar Anexo
            </button>
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
