import React, { useState, useEffect } from 'react';
import images from '../Assets/img/images';
import './Student.css';
import { successAlert, errorAlert } from '../Alerts/Alerts';
import { Link } from 'react-router-dom';
const RegStudents = () => {
  const [students, setStudents] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [estados, setEstados] = useState([]);
  const [filterNombre, setFilterNombre] = useState('');
  const [filterCarrera, setFilterCarrera] = useState('');
  const [filterPorcentaje, setFilterPorcentaje] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetch('/getestudiantes')
      .then(response => response.json())
      .then(data => {
        if (data.students) {
          setStudents(data.students);
        } else {
          console.error("No se recibieron datos de estudiantes");
        }
      })
      .catch(error => console.error('Error al cargar los estudiantes:', error));

    fetch('/getcarreras')
      .then(response => response.json())
      .then(data => {
        if (data.carreras) {
          setCarreras(data.carreras);
        } else {
          console.error("No se recibieron datos de carreras");
        }
      })
      .catch(error => console.error('Error al cargar las carreras:', error));

    fetch('/getestados')
      .then(response => response.json())
      .then(data => {
        if (data.estados) {
          setEstados(data.estados);
        } else {
          console.error("No se recibieron datos de estados");
        }
      })
      .catch(error => console.error('Error al cargar los estados:', error));
  }, []);

  const filteredStudents = students.filter(student => {
    return (
      student.nombres.toLowerCase().includes(filterNombre.toLowerCase()) &&
      (filterCarrera === '' || student.nombre_carrera === filterCarrera) &&
      (filterPorcentaje === '' || student.total_porcentaje_avance.toString().includes(filterPorcentaje)) &&
      (filterEstado === '' || student.nombre_estado === filterEstado)
    );
  });

  // Calculate the current students to display based on pagination
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Change page
  const nextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(filteredStudents.length / itemsPerPage)));
  };

  const prevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="profile-container">
      <div className='container-Header'>
        <div className='subtitle'>
          <h4>Registro de estudiante</h4>
        </div>
        <div className="profile-header">
          <img src={images.img1} alt="Logo UTA" className="profile-logo" />
        </div>
      </div>

      <div className="filter-section">
        <label>
          Nombre
          <input type="text" value={filterNombre} onChange={(e) => setFilterNombre(e.target.value)} />
        </label>
        <label>
          Carrera
          <select value={filterCarrera} onChange={(e) => setFilterCarrera(e.target.value)}>
            <option value="">Seleccionar carrera</option>
            {carreras.map(carrera => (
              <option key={carrera.id_Carreras} value={carrera.nombre_carrera}>{carrera.nombre_carrera}</option>
            ))}
          </select>
        </label>
        <label>
          Porcentaje
          <input type="number" value={filterPorcentaje} onChange={(e) => setFilterPorcentaje(e.target.value)} />
        </label>
        <label>
          Estado
          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
            <option value="">Seleccionar estado</option>
            {estados.map(estado => (
              <option key={estado.id_Estados_estudiantes} value={estado.nombre_estado}>{estado.nombre_estado}</option>
            ))}
          </select>
        </label>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Nombres</th>
            <th>Carrera</th>
            <th>Porcentaje de avance</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map(student => (
            <tr key={student.id_estudiante}>
              <td>{student.nombres} {student.apellidos}</td>
              <td>{student.nombre_carrera}</td>
              <td>{student.total_porcentaje_avance}%</td>
              <td>{student.nombre_estado}</td>
              <td><Link to="/Review">
            <span>Review</span>
          </Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
        <span>Página {currentPage} de {Math.ceil(filteredStudents.length / itemsPerPage)}</span>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredStudents.length / itemsPerPage)}>Siguiente</button>
      </div>
    </div>
  );
}

export default RegStudents;
