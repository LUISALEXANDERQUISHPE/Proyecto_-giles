import React, { useState, useEffect } from 'react';
import images from '../Assets/img/images';
import './Student.css';
import { successAlert, errorAlert } from '../Alerts/Alerts';

const RegStudents = () => {
  const [students, setStudents] = useState([]);
  const [filterNombre, setFilterNombre] = useState('');
  const [filterCarrera, setFilterCarrera] = useState('');
  const [filterFecha, setFilterFecha] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  useEffect(() => {
    fetch('/getestudiantes') // Suponiendo que hay un endpoint en tu servidor para obtener los datos de los estudiantes
      .then(response => response.json())
      .then(data => {
        if (data.students) {
          setStudents(data.students);
        } else {
          console.error("No se recibieron datos de estudiantes");
        }
      })
      .catch(error => console.error('Error al cargar los estudiantes:', error));
  }, []);

  const filteredStudents = students.filter(student => {
    return (
      student.nombres.toLowerCase().includes(filterNombre.toLowerCase()) &&
      (filterCarrera === '' || student.nombre_carrera === filterCarrera) &&
      (filterFecha === '' || student.fecha.includes(filterFecha)) &&
      (filterEstado === '' || student.estado === filterEstado)
    );
  });

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
            <option value="">Software</option>
            {/* Map over carreras if needed */}
          </select>
        </label>
        <label>
          Fecha
          <input type="date" value={filterFecha} onChange={(e) => setFilterFecha(e.target.value)} />
        </label>
        <label>
          Estado
          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
            <option value="">En proceso</option>
            {/* Add more states if needed */}
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
          {filteredStudents.map(student => (
            <tr key={student.id_estudiante}>
              <td>{student.nombres} {student.apellidos}</td>
              <td>{student.nombre_carrera}</td>
              <td>{student.porcentaje_avance}%</td>
              <td>{student.estado}</td>
              <td><a href="#">Revisar</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegStudents;
