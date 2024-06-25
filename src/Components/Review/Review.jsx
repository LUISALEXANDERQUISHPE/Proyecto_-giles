import React, { useState, useEffect } from 'react';
import images from '../Assets/img/images';
import './Review.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { alertaCambioEstado } from './AlertEstado';

const Review = () => {
    const { id } = useParams(); // Aquí 'id' debe coincidir con el nombre del parámetro en la ruta
    const [studentInfo, setStudentInfo] = useState(null); // Estado para los detalles del estudiante
    const [reports, setReports] = useState([]); // Estado para los informes
    const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación
    const [itemsPerPage, setItemsPerPage] = useState(6); // Estado para el número de elementos por página
    const navigate = useNavigate(); // Hook para la navegación

    useEffect(() => {
        // Fetch para obtener los detalles del estudiante
        fetch(`/estudiante/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log("Datos recibidos del estudiante en el front:", data);
                setStudentInfo(data); // Guardar los detalles del estudiante en el estado

                // Luego de obtener los detalles del estudiante, obtener los informes
                if (data.id_tesis) {
                    fetch(`/informes/${data.id_tesis}`)
                        .then(response => response.json())
                        .then(data => {
                            console.log("Datos recibidos de los informes en el front:", data);
                            setReports(data); // Guardar los informes en el estado
                        })
                        .catch(error => console.error('Error al cargar los informes:', error));
                }
            })
            .catch(error => console.error('Error al cargar los detalles del estudiante:', error));
    }, [id]); // El array vacío asegura que el efecto solo se ejecute una vez

    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = reports.slice(firstItemIndex, lastItemIndex);

    const nextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const prevPage = () => {
        setCurrentPage(prev => prev - 1);
    };

    const updateStudentState = (newState) => {
        setStudentInfo((prevState) => ({
            ...prevState,
            id_estado_estudiante: newState
        }));
    };

    const handleNewButtonClick = () => {
        navigate(`/create-informe/${id}`, { state: { studentInfo } });
    };

    return (
        <div className="profile-container">
            <div className='container-Header'>
                <div className='subtitle'>
                    <h4>Estudiantes - Revisión</h4>
                </div>
                <div className="profile-header">
                    <img src={images.img1} alt="Logo UTA" className="profile-logo" />
                </div>
            </div>
            {studentInfo ? (
                <div className='flexi espaciado'>
                    <div className="info-item position-Review">
                        <label>Estudiante:</label>
                        <strong className='Nombre'>{studentInfo.nombres} {studentInfo.apellidos}</strong>
                    </div>
                    <div className="info-item position-Review">
                        <label>Carrera:</label>
                        <strong className='Carrera'>{studentInfo.nombre_carrera}</strong>
                    </div>
                    <div className="info-item position-Review">
                        <label>Tema:</label>
                        <strong className='tema'>{studentInfo.tema}</strong>
                    </div>
                    <div className="info-item position-Review">
                        <label>Fecha de aprobación:</label>
                        <strong className='largos'>{studentInfo.fecha_aprobacion}</strong>
                    </div>
                    <div className="info-item position-Review">
                        <label>Estado actual:</label>
                        <strong className='largos2'>{studentInfo.nombre_estado}</strong>
                        <div>
                            <button className="Btn" onClick={() => alertaCambioEstado(id, updateStudentState)}>Editar
                                <svg className="svg" viewBox="0 0 512 512">
                                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Cargando detalles del estudiante...</p>
            )}
            <div>
                <h3 className='title-informes'>Listado de Informes</h3>
                <button className="Btn espaciado-btn" onClick={handleNewButtonClick}>Nuevo
                    <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                    </svg>
                </button>
            </div>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Informe</th>
                        <th>Fecha</th>
                        <th>Avance</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((report) => (
                        <tr key={report.id}>
                            <td>{report.nombre_informe}</td>
                            <td>{report.fecha_informe}</td>
                            <td>{report.porcentaje_avance}%</td>
                            <td>
                                <Link to={`/edit-informe/${report.id}`} className='menu-item-btn' style={{ color: '#a52a2a'}}>
                                    <span className='menu-item'>Editar</span>
                                </Link>
                            </td>
                        </tr>
                    ))}
                             </tbody>
            </table>

            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
                <span>Página {currentPage} de {Math.ceil(reports.length / itemsPerPage)}</span>
                <button onClick={nextPage} disabled={currentPage === Math.ceil(reports.length / itemsPerPage)}>Siguiente</button>
            </div>
        </div>
    );
}

export default Review;
