  import React, { useState, useEffect, useCallback } from 'react';
  import images from '../Assets/img/images';
  import './CreateInforme.css';
  import { useParams, useLocation } from 'react-router-dom';
  import { alertaCrearActividad } from './AlertActividad';
  import {exitoGuardarInforme } from './AlertActividad'; // Importar la función de alerta
  import { FaBook, FaEdit, FaTrash } from 'react-icons/fa'; 
  import { Link } from 'react-router-dom';
  import {alertaEditarActividad} from './AlertEditarActividad'; // Ajusta la ruta según sea necesario
  import { errorActualizarPorcentaje } from './AlertActividad';
  import {confirmarEliminarActividad} from './AlertEditarActividad';
  import Swal from 'sweetalert2';
  let url;



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
    const [showIframe, setShowIframe] = useState(false);
    const [URLPDF, setURLPDF] = useState(null);
    const [porcentajeInicial, setPorcentajeInicial] = useState('');
    const [actividadEnEdicion, setActividadEnEdicion] = useState(null);


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
            setPorcentajeInicial(data.totalPorcentaje);
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
        errorActualizarPorcentaje('Error: Falta ingresar algunos campos requeridos.');
        return;
      }
    
      if (porcentajeAvance === porcentajeInicial) {
        errorActualizarPorcentaje('Debe actualizar el porcentaje de avance');
        return;
      }
      if (actividades.length === 0) {
        errorActualizarPorcentaje('Debe agregar al menos una actividad antes de guardar el informe.');
        return;
      }
       // Verifica que el porcentaje de avance haya sido actualizado y sea mayor que el inicial
      if (parseInt(porcentajeAvance) <= parseInt(porcentajeInicial)) {
        errorActualizarPorcentaje(`El porcentaje de avance debe ser mayor al valor inicial.  Anterior:${porcentajeInicial}`);
        return;
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

    const handleVisualizarInformeClick= async()=> {
      setShowIframe(true);
      let observaciones=[ ];
      const response = await fetch(`/nombre_tesis/${id}`);
      const data = await response.json();
      const  nombre_Tesis = data.tema_tesis;
      const responseTu = await fetch(`/tutor/${id}`);
      const dataTu = await responseTu.json();
      const  tutor  = dataTu.nombres_tutor +" "+ dataTu.apellidos_tutor;
      let datos = {
        carrera: studentData ? studentData.nombre_carrera : '', // Ejemplo de cómo obtener la carrera del estudiante, asegúrate de ajustar según la estructura de tu objeto studentData
        fecha:fechaInforme, // Utilizando el estado de fechaInforme
        nombreEstudiante: studentData.nombres+" "+studentData.apellidos, // Ejemplo de cómo obtener el nombre del estudiante, ajusta según tu objeto studentData
        tema:nombre_Tesis, // Utilizando el estado de tituloInforme
        fechaAprobacion: studentData.fecha_aprobacion , // Aquí deberías obtener la fecha de aprobación, según tu lógica de negocio
        porcentaje: porcentajeAvance,
        tutor:tutor // Utilizando el estado de porcentajeAvance
      };
      let actividadesS=actividades;
      fetch('/informePDF', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ datos, actividadesS, observaciones })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.blob();
            })
            .then(blob => {
              url=URL.createObjectURL(blob)
              console.log("-------------")
              console.log(url)
              setURLPDF(url);
            })
            .catch(error => {
                console.error('Error al generar el informe PDF:', error);
            });
            
    }  
    const handleCerrarInformeClick= async()=> {
      setShowIframe(false);
    }  

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


    const handlePorcentajeChange = (e) => {
      const value = e.target.value;
      if (value === '' || (/^\d+$/.test(value) && value >= 0 && value <= 100)) {
        setPorcentajeAvance(value);
      }
    };
    const handleInformeFinal= (e) => {
      setShowIframe(true);
      fetch(`/informeFinal/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.blob();
    })
    .then(blob => {
      url=URL.createObjectURL(blob)
    })
    .catch(error => {
        console.error('Error al generar el informe PDF:', error);
    });
    };

    const handleEditarActividad = async (id_actividad) => {
      console.log("Editando actividad con ID:", id_actividad);
  
      // Supongamos que actividades es un array con todas las actividades
      const actividadEditar = actividades.find(act => act.id_actividad === id_actividad);
  
      if (!actividadEditar) {
          alert('Actividad no encontrada');
          return;
      }
  
      // Mostrar el popup alertaEditarActividad con los datos de la actividad a editar
      alertaEditarActividad({
          id_actividad: actividadEditar.id_actividad,
          descripcion: actividadEditar.descripcion,
          fecha_actividad: actividadEditar.fecha_actividad,
      }, fetchActividades);
  
      // Establecer el estado de actividadEnEdicion con la actividad actual
      setActividadEnEdicion(actividadEditar);
  };
  
  
  
    
    
  
  
  const handleEliminarActividad = async (actividadId) => {
    Swal.fire({
      title: "¿Estás seguro de que quieres eliminar esta actividad?",
      text: "Esta acción no se puede deshacer. ¿Estás seguro de proceder?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/eliminarActividad/${actividadId}`, {
            method: 'DELETE',
          });
  
          if (!response.ok) {
            throw new Error('Failed to delete activity');
          }
  
          console.log('Actividad eliminada exitosamente');
          fetchActividades(); // Actualiza la lista de actividades después de la eliminación
  
          // Mostrar mensaje de éxito
          Swal.fire({
            title: "¡Actividad eliminada!",
            text: "La actividad ha sido eliminada exitosamente.",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar"
          });
  
        } catch (error) {
          console.error('Error al eliminar la actividad:', error);
          // Mostrar mensaje de error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al eliminar la actividad. Por favor, inténtalo de nuevo más tarde.',
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar"
          });
        }
      }
    });
  };




    return (
      <div className="profile-container"  >
        <div className='container-Header'>
          <div className='subtitle'>
            <h4>Estudiantes Crear-Informe</h4>
          </div>
          <div className="profile-header">
            <img src={images.img1} alt="Logo UTA" className="profile-logo" />
          </div>
        </div>
        <div id ="contenido" style={{display: showIframe ? 'flex' : 'block'}}>
        <div id="left" className="centra-content" style={{ width: showIframe ? '55%' : '100%' }}>
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
              <div id ="con" className="cr">
              <div className=" column  left-column">
              <p><strong>Fecha informe:</strong> 
                <input 
                  type="date" 
                  className="input-field input-field-fecha" 
                  value={fechaInforme} 
                  onChange={(e) => setFechaInforme(e.target.value)} 
                />
              </p>
              
              
              <p><strong>Porcentaje avance:</strong> 
                <input 
                  type="number" 
                  className="input-field input-field-porcentaje" 
                  value={porcentajeAvance} 
                  onChange={handlePorcentajeChange} 
                  min="0" 
                  max="100" 
                />
              </p>
              </div>
             </div>
            </div>
            <div className="activities">
              <div>
                <h3 className='title-informes'>Actividades</h3>
                <button className="Btn espaciado-btn2" onClick={handleCrearActividad}>Añadir
                    <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                    </svg>
                </button>
            </div>
              <table>
                <thead>
                    <tr>
                        <th>Fecha de actividad</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                  {currentActividades.length > 0 ? currentActividades.map((actividad) => (
                      <tr key={actividad.id_actividad}>  {/* Cambiado de index a actividad.id */}
                          <td>{new Date(actividad.fecha_actividad).toISOString().split('T')[0]}</td>
                          <td>{actividad.descripcion}</td>
                          <td>
                          <div className="contenedor-acciones">
                            <span className="action-icon-edit" onClick={() => handleEditarActividad(actividad.id_actividad)}>
                              <FaEdit />
                            </span>
                            <span className="action-icon-eliminar" onClick={() => handleEliminarActividad(actividad.id_actividad)}>
                              <FaTrash />
                            </span>
                          </div>
                          </td>
                      </tr>
                  )) : (
                      <tr>
                          <td colSpan="3">No hay actividades registradas</td>
                      </tr>
                  )}
                </tbody>

            </table>

            <div className="pagination">
                <button id="an" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Anterior</button>
                <span>Página {currentPage} de {Math.ceil(actividades.length / itemsPerPage)}</span>
                <button id ="sig" onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(actividades.length / itemsPerPage)))} disabled={currentPage === Math.ceil(actividades.length / itemsPerPage)}>Siguiente</button>
            </div>

            <br />
              <div className="buttons">
              {porcentajeAvance === 100 || parseInt(porcentajeInicial) === 100 ? (
                <button onClick={handleInformeFinal}>
                  Generar informe final
                </button>
              ) : null}
                <button onClick={handleGuardarInformeClick} >
                Guardar Informe
                </button>
                <button id="botonPDF"  onClick={handleVisualizarInformeClick}>
                Generar PDF
                </button>
              </div>
            </div>
          </div>

        </div>
      
          <div className='pdf'>
            <div id="pdfC" className={showIframe? "pdf-container":"hiden"}>
              <iframe
                id="pdf"
                className="pdf-iframe"
                src={url}
              ></iframe>
              <button className="close-button"  onClick={handleCerrarInformeClick}>X</button>
              </div>
          </div>
        </div>
      </div>
    );
  };

  export default CreateInforme;
