import React, { useState, useEffect } from 'react';
import images from '../Assets/img/images';
import './RegistroEstudent.css';
import { successAlert, errorAlert } from '../Alerts/Alerts'; 


const RegStudents = () => {
  const [carreras, setCarreras] = useState([]);
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [tema, setTema] = useState('');
  const [fechaTema, setFechaTema] = useState('');
  const [id_Carreras, setIdCarrera] = useState('');

  useEffect(() => {
    fetch('/carreras')
      .then(response => response.json())
      .then(data => {
        if (data.carreras) {
          setCarreras(data.carreras);
        } else {
          console.error("No se recibieron datos");
        }
      })
      .catch(error => console.error('Error al cargar las carreras:', error));
  }, []);

  const handleNombreChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z\s]*$/; // Solo permite letras y espacios en blanco
    if (regex.test(value)) {
        setNombres(value);
    } else {
        console.error('El nombre solo puede contener letras y espacios');
    }
  };

  const handleApellidosChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z\s]*$/; // Solo permite letras y espacios en blanco
    if (regex.test(value)) {
        setApellidos(value);
    } else {
        console.error('El apellido solo puede contener letras y espacios');
    }
  };

  const handleTemaChange = (e) => {
    setTema(e.target.value);
  };

  const handleFechaTemaChange = (e) => {
    setFechaTema(e.target.value);
  };

  const handleCarreraChange = (e) => {
    setIdCarrera(e.target.value);
    console.log("Carrera seleccionada:", e.target.value);
  };
  const tutorId = localStorage.getItem('userId');

  const handleSubmit = (e) => {
    e.preventDefault();
    const studentData = {
      nombres,
      apellidos,
      id_Carreras,
      tutorId,
      tema_proyecto: tema,
      fecha: fechaTema
    };

    console.log("Datos a enviar:", studentData);

    fetch('/insertStudent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error('Error al registrar al estudiante:', data.error);
        errorAlert('No se pudo registrar al estudiante!');
      } else {
        console.log('Registro exitoso:', data); 
        successAlert('¡El estudiante ha sido registrado exitosamente!');
        setNombres('');
        setApellidos('');
        setTema('');
        setFechaTema('');
        setIdCarrera('');
      }
    })
    .catch(error => console.error('Error al registrar al estudiante:', error));
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
      
      <form onSubmit={handleSubmit}>
        <div className='flex'>
          <div className="form_input"> 
            <h3 className='label-reg ' htmlFor="nombre">NOMBRES</h3>
            <input type="text" placeholder="Adeline Sahra" id="nombre" name='nombre' required value={nombres} onChange={handleNombreChange} />
          </div>
          <div className="form_input"> 
            <h3 className='label-reg ' htmlFor="apellido">APELLIDOS</h3>
            <input type="text" placeholder="Perez Santillan" id="apellido" name='apellido' required value={apellidos} onChange={handleApellidosChange}/>
          </div>
        </div>
        <div className='flex'>
          <div className="form_input"> 
            <h3 className='label-reg ' htmlFor="Carrera">CARRERA</h3>
            <select id="id_Carreras" required value={id_Carreras} onChange={handleCarreraChange}>
              <option value="" disabled>Seleccione una carrera</option>
              {carreras.map((carrera) => (
                <option key={carrera.id_Carreras} required value={carrera.id_Carreras}>
                  {carrera.nombre_carrera}
                </option>
              ))}
            </select>
          </div>
          <div className="form_input"> 
            <h3 className='label-reg '  htmlFor="tema">TEMA DE PROYECTO</h3>
            <input type="text" placeholder=" Margen de tema" id="tema" value={tema} onChange={handleTemaChange} required/>
          </div>
        </div>
        <div className="form_input"> 
          <h3 className='label-reg ' htmlFor="fecha_tema">FECHA DE APROBACIÓN DE TEMA</h3>
          <input type="date" id="fecha_tema" value={fechaTema} onChange={handleFechaTemaChange} required />
        </div>
        <div className='position-btn'>
          <button type="submit">
            <span className="transition"></span>
            <span className="gradient"></span>
            <span className="label">REGISTRAR</span>
          </button>
        </div>
      </form>
      
    </div>
  );
}

export default RegStudents;
