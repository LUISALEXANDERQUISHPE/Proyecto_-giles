const express = require("express");
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const {generarInformePDF,generarInformePDFFinal} = require('./generarAnexo.js');
const agruparPorMes= require('./organizarDatos.js');
const path = require('path');
const app = express();              
app.use(cors()); 
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "titulacion",
    port: 3306,
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

app.post("/create", (req, res) => {
    const { nombre, apellido, correo_electronico, contrasenia } = req.body;
    const nombreUpper = nombre.toUpperCase();
    const apellidoUpper = apellido.toUpperCase();

    const checkQuery = 'SELECT  COUNT(*) AS count FROM tutores WHERE nombres = ? AND apellidos = ?';
    db.query(checkQuery, [nombreUpper, apellidoUpper], (err, results) => {
        if (err) {
            console.error('Error al verificar el usuario:', err);
            return res.status(500).send({ error: "Error al verificar el usuario" });
        }

        if (results[0].count > 0) {
            return res.status(400).send({ error: "El usuario ya está registrado" });
        }

        const checkCorreoQuery = 'SELECT COUNT(*) AS count FROM tutores WHERE correo_electronico = ?';
        db.query(checkCorreoQuery, [correo_electronico], (errCorreo, resultsCorreo) => {
            if (errCorreo) {
                console.error('Error al verificar el correo electrónico:', errCorreo);
                return res.status(500).send({ error: "Error al verificar el correo electrónico" });
            }

            if (resultsCorreo[0].count > 0) {

                // El correo electrónico ya está registrado
                return res.status(400).send({ error: "Ya se encuentra un usuario registrado con ese correo" });

            }

            bcrypt.hash(contrasenia, 10, (errHash, hash) => {
                if (errHash) {
                    console.error('Error al hashear la contraseña:', errHash);
                    return res.status(500).send({ error: "Error al procesar la contraseña" });
                }

                const insertQuery = 'INSERT INTO tutores (nombres, apellidos, correo_electronico, contrasenia) VALUES (?, ?, ?, ?)';
                db.query(insertQuery, [nombreUpper, apellidoUpper, correo_electronico, hash], (errorInsert, resultsInsert) => {
                    if (errorInsert) {
                        console.error('Error al insertar en la base de datos:', errorInsert);
                        return res.status(500).send({ error: "Error al registrar al tutor" });
                    }

                   // res.status(200).send({ error: "Usuario registrado con exito", id: resultsInsert.insertId });

                });
            });
        });
    });
});

app.post('/login', (req, res) => {
    const { correo_electronico, contrasenia } = req.body;

    const checkQuery = 'SELECT id_tutores, nombres, apellidos, contrasenia FROM tutores WHERE correo_electronico = ?';
    db.query(checkQuery, [correo_electronico], (err, results) => {
        if (err) {
            console.error("Error al verificar el correo electrónico:", err);
            return res.status(500).send({ error: "Problemas técnicos al verificar el usuario." });
        }

        if (results.length === 0) {
            return res.status(400).send({ error: "Usuario no encontrado. Verifica tu correo electrónico." });
        }
        const user = results[0];
        bcrypt.compare(contrasenia, user.contrasenia, (bcryptErr, bcryptResult) => {
            if (bcryptErr) {
                console.error("Error al comparar contraseñas:", bcryptErr);
                return res.status(500).send({ error: "Problemas técnicos al verificar la contraseña." });
            }

            if (!bcryptResult) {
                return res.status(400).send({ error: "Contraseña incorrecta." });
            }

            res.status(200).send({
                message: "Inicio de sesión exitoso",
                nombre: user.nombres,
                apellido: user.apellidos,
                id_tutor: user.id_tutores
            });
            
        });
    });
});
app.get('/carreras', (req, res) => {
    const query = 'SELECT * FROM carreras';  // Asume que tienes una tabla 'carreras' con los datos que necesitas
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener las carreras:", err);
            return res.status(500).send({ error: "Problemas técnicos al recuperar las carreras." });
        }
        res.status(200).send({
            message: "Carreras recuperadas exitosamente",
            carreras: results  // Envía todos los resultados para ser usados en tu JSX
        });
    });
});



app.post("/insertStudent", (req, res) => {
    const { cedula, nombres, apellidos, id_Carreras, tutorId, tema_proyecto, fecha } = req.body;

    const cedulaInt = parseInt(cedula, 10); // Asegúrate de que la cédula sea un número entero si es necesario
    const nombreLower = nombres.toLowerCase();
    const apellidoLower = apellidos.toLowerCase();
    const tema_proyectoLower = tema_proyecto.toLowerCase();
    const id_carrera = parseInt(id_Carreras, 10);
    const id_tutor = parseInt(tutorId, 10);

    // Comenzar transacción
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error al iniciar transacción:', err);
            return res.status(500).send({ error: "Error técnico al iniciar la transacción" });
        }

        const insertQuery = `
            INSERT INTO estudiantes (cedula, nombres, apellidos, id_carrera, id_estado_estudiante, id_tutor)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertQuery, [cedulaInt, nombreLower, apellidoLower, id_carrera, 2, id_tutor], (errorInsert, resultsInsert) => {
            if (errorInsert) {
                console.error('Error al insertar estudiante:', errorInsert);
                return db.rollback(() => {
                    res.status(500).send({ error: "Error al registrar al estudiante" });
                });
            }

            const id_estudiante = resultsInsert.insertId;
            const insertQuery2 = `
                INSERT INTO tesis (tema, fecha_aprobacion, total_porcentaje_avance, id_estudiante)
                VALUES (?, ?, ?, ?)
            `;
            db.query(insertQuery2, [tema_proyectoLower, fecha, 0, id_estudiante], (errorInsert2, resultsInsert2) => {
                if (errorInsert2) {
                    console.error('Error al insertar tesis:', errorInsert2);
                    return db.rollback(() => {
                        res.status(500).send({ error: "Error al registrar la tesis" });
                    });
                }

                db.commit((errCommit) => {
                    if (errCommit) {
                        console.error('Error al confirmar transacción:', errCommit);
                        return db.rollback(() => {
                            res.status(500).send({ error: "Error técnico al confirmar la transacción" });
                        });
                    }

                    res.status(200).send({ message: "Estudiante y tesis registrados con éxito" });
                });
            });
        });
    });
});


app.get('/getestudiantes', (req, res) => {
    const tutorId = req.query.tutorId;

    if (!tutorId) {
        return res.status(400).send({ error: "ID de tutor no proporcionado" });
    }

    const query = `
        SELECT 
            e.id_estudiante, 
            e.nombres, 
            e.apellidos, 
            c.nombre_carrera, 
            ee.nombre_estado, 
            t.total_porcentaje_avance 
        FROM estudiantes e
        JOIN carreras c ON e.id_carrera = c.id_Carreras
        JOIN estados_estudiantes ee ON e.id_estado_estudiante = ee.id_Estados_estudiantes
        LEFT JOIN tesis t ON e.id_estudiante = t.id_estudiante
        WHERE e.id_tutor = ?
    `;

    db.query(query, [tutorId], (err, results) => {
        if (err) {
            console.error("Error al obtener los estudiantes:", err);
            return res.status(500).send({ error: "Problemas técnicos al recuperar los estudiantes." });
        }
        res.status(200).send({
            message: "Estudiantes recuperados exitosamente",
            students: results
        });
    });
    
});




app.get('/getcarreras', (req, res) => {
    const query = 'SELECT * FROM carreras';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener las carreras:", err);
            return res.status(500).send({ error: "Problemas técnicos al recuperar las carreras." });
        }
        res.status(200).send({
            message: "Carreras recuperadas exitosamente",
            carreras: results
        });
    });
});

app.get('/getestados', (req, res) => {
    const query = 'SELECT * FROM estados_estudiantes';
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener los estados:", err);
            return res.status(500).send({ error: "Problemas técnicos al recuperar los estados." });
        }
        res.status(200).send({
            message: "Estados recuperados exitosamente",
            estados: results
        });
    });
});

const capitalizeFirstLetter = (string) => {
    return string.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const capitalizeFirstLetterOnly = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

app.get('/estudiante/:id', (req, res) => {
    const estudianteId = req.params.id;
    const studentQuery = `
        SELECT 
            e.id_estudiante,
            e.nombres,
            e.apellidos,
            c.nombre_carrera,
            ee.nombre_estado,
            t.tema,
            t.fecha_aprobacion,
            t.id_tesis
        FROM estudiantes e
        INNER JOIN carreras c ON e.id_carrera = c.id_Carreras
        INNER JOIN estados_estudiantes ee ON e.id_estado_estudiante = ee.id_estados_estudiantes
        LEFT JOIN tesis t ON e.id_estudiante = t.id_estudiante
        WHERE e.id_estudiante = ?
    `;

    db.query(studentQuery, [estudianteId], (err, results) => {
        if (err) {
            console.error("Error al obtener los detalles del estudiante:", err);
            return res.status(500).send({ error: "Problemas técnicos al recuperar los detalles del estudiante." });
        }
        if (results.length > 0) {
            const result = results[0];
            if (result.fecha_aprobacion) {
                // Formatear la fecha en JavaScript
                const formattedDate = new Date(result.fecha_aprobacion).toISOString().slice(0, 10).split('-').reverse().join('-');
                result.fecha_aprobacion = formattedDate;
            }
            // Capitalizar nombres y apellidos
            result.nombres = capitalizeFirstLetter(result.nombres);
            result.apellidos = capitalizeFirstLetter(result.apellidos);
            result.tema = capitalizeFirstLetterOnly(result.tema);

            res.status(200).send(result);
        } else {
            res.status(404).send({ message: "Estudiante no encontrado." });
        }
    });
});

app.get('/informes/:idTesis', (req, res) => {
    const idTesis = req.params.idTesis;
    const reportsQuery = `
        SELECT 
            i.nombre_informe,
            DATE_FORMAT(i.fecha_informe, '%d-%m-%Y') AS fecha_informe,
            i.porcentaje_avance
        FROM informes i
        WHERE i.id_tesis = ?
    `;
   // console.log("Ejecutando consulta:", reportsQuery);
    //console.log("Con parámetros:", idTesis);

    db.query(reportsQuery, [idTesis], (err, results) => {
        if (err) {
            console.error("Error al obtener informes:", err);
            return res.status(500).send({ error: "Problemas técnicos al recuperar informes." });
        }
        res.status(200).send(results);
    });
});

app.put('/updateestado/:id', (req, res) => {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    const query = 'UPDATE estudiantes SET id_estado_estudiante = ? WHERE id_estudiante = ?';
    db.query(query, [nuevoEstado, id], (err, results) => {
        if (err) {
            console.error("Error al actualizar el estado:", err);
            return res.status(500).send({ error: "Problemas técnicos al actualizar el estado." });
        }
        res.status(200).send({ message: "Estado actualizado exitosamente" });
    });
});

app.post("/crearInforme_ficticio", (req, res) => {
    const { idTesis } = req.body;
    const tituloInforme ='Informe prueba';
    const fechaInforme= '2024-01-01';
    const porcentajeAvance=0;

    // Verificar si idTesis es un valor válido
    if (!idTesis || isNaN(idTesis)) {
        return res.status(400).send({ error: "El ID de la tesis proporcionado no es válido" });
    }

    const insertQuery = 'INSERT INTO informes (nombre_informe, fecha_informe, porcentaje_avance, id_tesis) VALUES (?, ?, ?, ?)';

    // Ejecutar la consulta de inserción
    db.query(insertQuery, [tituloInforme, fechaInforme, porcentajeAvance, idTesis], (error, results) => {
        if (error) {
            console.error('Error al insertar informe de prueba:', error);
            return res.status(500).send({ error: "Error al guardar el informe de prueba en la base de datos" });
        }
        // Recuperar el ID del último registro insertado
        const idInforme = results.insertId;
            // Enviar respuesta incluyendo el idInforme
            res.status(200).send({ message: "Informe de prueba guardado ", idInforme: idInforme });
    });
});


app.post("/crearActividad", (req, res) => {
    console.log(req.body);
    const { fechaActividad, detalle, idInforme } = req.body;
    const insertQuery = 'INSERT INTO actividades (fecha_actividad, descripcion, id_informe) VALUES (?, ?, ?)';
    db.query(insertQuery, [fechaActividad, detalle, idInforme], (error, results) => {
        if (error) {
            console.error('Error al insertar actividad:', error);
            return res.status(500).send({ error: "Error al guardar la actividad en la base de datos" });
        }

        res.status(200).send({ message: "Actividad creada exitosamente" });
    });
});

app.get('/getPorcent/:idTesis', (req, res) => {
    const idTesis = req.params.idTesis; // Corrección en la obtención del parámetro
    const query = 'SELECT total_porcentaje_avance FROM tesis WHERE id_Tesis=?';
    db.query(query, [idTesis], (err, results) => {
        if (err) {
            console.error("Error al obtener el porcentaje de tesis:", err);
            return res.status(500).send({ error: "Problemas técnicos al recuperar los porcentajes." });
        }
        if (results.length === 0) {
            return res.status(404).send({ error: "El informe no fue encontrado." });
        }
        const totalPorcentaje = results[0].total_porcentaje_avance;
        res.status(200).send({
            message: "Porcentaje recuperado exitosamente",
            totalPorcentaje: totalPorcentaje
        });
    });
});

app.put('/updateInforme', (req, res) => {
    console.log(req.body);
    const { informeId, tituloInforme, fechaInforme, porcentajeAvance, idTesis } = req.body;

    // Verificar si idInforme y idTesis son valores válidos
    if (!informeId || isNaN(informeId) || !idTesis || isNaN(idTesis)) {
        return res.status(400).send({ error: "El ID del informe o el ID de la tesis proporcionado no es válido" });
      }
      

    // Consulta de actualización del informe
    const updateInformeQuery = 'UPDATE informes SET nombre_informe = ?, fecha_informe = ?, porcentaje_avance = ? WHERE id_informe = ?';

    // Ejecutar la consulta de actualización del informe
    db.query(updateInformeQuery, [tituloInforme, fechaInforme, porcentajeAvance, informeId], (updateError, updateResults) => {
        if (updateError) {
            console.error('Error al actualizar el informe:', updateError);
            return res.status(500).send({ error: "Error al actualizar el informe en la base de datos" });
        }

        console.log(`Informe con idInforme ${informeId} actualizado correctamente`);

        // Actualizar el porcentaje de avance en la tabla tesis
        const nuevoPorcentajeAvance = porcentajeAvance;
        const updateTesisQuery = 'UPDATE tesis SET total_porcentaje_avance = ? WHERE id_tesis = ?';

        db.query(updateTesisQuery, [nuevoPorcentajeAvance, idTesis], (updateTesisError, updateTesisResults) => {
            if (updateTesisError) {
                console.error('Error al actualizar el porcentaje de avance en tesis:', updateTesisError);
                return res.status(500).send({ error: "Error al actualizar el porcentaje de avance en la base de datos" });
            }

            console.log(`Porcentaje de avance actualizado a ${nuevoPorcentajeAvance} para idTesis ${idTesis}`);
            res.status(200).send({ message: "Informe y porcentaje de avance actualizados exitosamente" });
        });
    });
});

app.get('/actividades/:idInforme', (req, res) => {
    const idInforme = req.params.idInforme;
    const activitiesQuery = `
        SELECT 
            a.fecha_actividad,
            a.descripcion,
            a.id_actividad
        FROM actividades a
        WHERE a.id_informe = ?
    `;

    // Descomenta las siguientes líneas para depurar la consulta y los parámetros
    console.log("Ejecutando consulta:", activitiesQuery);
    console.log("Con parámetros:", idInforme);

    db.query(activitiesQuery, [idInforme], (err, results) => {
        if (err) {
            console.error("Error al obtener actividades:", err);
            return res.status(500).send({ error: "Problemas técnicos al recuperar actividades." });
        }
        if (results.length === 0) {
            console.log("No se encontraron actividades para el informe con ID:", idInforme);
            return res.status(404).send({ error: "No se encontraron actividades." });
        }
        console.log("Actividades recuperadas desde la base de datos:", results);
        res.status(200).send(results);
    });
});



app.get('/tutor/:idEstudiante', (req, res) => {
    const idEstudiante = req.params.idEstudiante;
    const query = `
      SELECT t.nombres AS nombres_tutor, t.apellidos AS apellidos_tutor
      FROM estudiantes e
      JOIN tutores t ON e.id_tutor = t.id_tutores
      WHERE e.id_estudiante = ?
    `;
  
    // Ejecuta la consulta en la base de datos
    db.query(query, [idEstudiante], (err, results) => {
      if (err) {
        console.error('Error al obtener el nombre del tutor:', err);
        return res.status(500).send({ error: 'Problemas técnicos al recuperar el nombre del tutor.' });
      }
  
      if (results.length > 0) {
        const { nombres_tutor, apellidos_tutor } = results[0];
        res.status(200).send({ nombres_tutor, apellidos_tutor });
      } else {
        res.status(404).send({ error: 'No se encontró el tutor asociado al estudiante con el ID proporcionado.' });
      }
    });
  });
  
  // Endpoint para obtener el nombre de la tesis por ID de estudiante
  app.get('/nombre_tesis/:idEstudiante', (req, res) => {
    const idEstudiante = req.params.idEstudiante;
    const query = `
      SELECT te.tema AS tema_tesis
      FROM estudiantes e
      JOIN tesis te ON e.id_estudiante = te.id_estudiante
      WHERE e.id_estudiante = ?
    `;
  
    // Ejecuta la consulta en la base de datos
    db.query(query, [idEstudiante], (err, results) => {
      if (err) {
        console.error('Error al obtener el nombre de la tesis:', err);
        return res.status(500).send({ error: 'Problemas técnicos al recuperar el nombre de la tesis.' });
      }
  
      if (results.length > 0) {
        const { tema_tesis } = results[0];
        res.status(200).send({ tema_tesis });
      } else {
        res.status(404).send({ error: 'No se encontró la tesis asociada al estudiante con el ID proporcionado.' });
      }
    });
  });
app.post('/informePDF', (req, res) => {
    const datos= req.body.datos;
    const actividades=req.body.actividadesS
    const observaciones= req.body.observaciones
    generarInformePDF(actividades,datos,observaciones);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="example.pdf"');
    const filePath = './Anexo_5.pdf'; // Ruta absoluta o relativa al archivo PDF
    const absolutePath = path.resolve(filePath);
    res.sendFile(absolutePath);

  });

  

app.get('/informeFinal/:id_estudiante', async (req, res) => {
    const idEstudiante = req.params.id_estudiante;
    const sqlQuery1 = `
    SELECT 
    CONCAT(e.nombres, ' ', e.apellidos) AS nombre_estudiante,
    t.tema AS tema_trabajo,
    t.fecha_aprobacion,
    c.nombre_carrera,
    CONCAT(tu.nombres, ' ', tu.apellidos) AS nombre_tutor
        FROM 
    tesis t
    JOIN 
        estudiantes e ON t.id_estudiante = e.id_estudiante
    JOIN 
        carreras c ON e.id_carrera = c.id_Carreras
    JOIN 
        tutores tu ON e.id_tutor = tu.id_tutores;
    `;

    db.query(sqlQuery1, [idEstudiante], (err, results1) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        return;
      }
      let studentInfo=results1[0]
      const datos = {
        fecha: new Date().toISOString(),
        nombreEstudiante: studentInfo.nombre_estudiante,
        tema: studentInfo.tema_trabajo,
        fechaAprobacion: studentInfo.fecha_aprobacion.toISOString(),
        carrera: studentInfo.nombre_carrera,
        tutor: studentInfo.nombre_tutor, 
        porcentaje: "100"
    };
    const sqlQuery2 = `
       SELECT a.fecha_actividad, a.descripcion
        FROM actividades a, informes i, tesis t, estudiantes e
        WHERE a.id_informe = i.id_informe
        AND i.id_tesis = t.id_tesis
        AND t.id_estudiante = e.id_estudiante
        AND e.id_estudiante = ?;
    `;
    db.query(sqlQuery2, [idEstudiante], (err, results2) =>{

        let respuesta = agruparPorMes(results2)
        generarInformePDFFinal(respuesta,datos);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="example.pdf"');
        const filePath = './Anexo_11.pdf'; // Ruta absoluta o relativa al archivo PDF
        const absolutePath = path.resolve(filePath);
        res.sendFile(absolutePath);
        });
    });

});
/**--------nuevo aqui- */


app.put('/editarActividad/:id', (req, res) => {
    const idActividad = req.params.id;  // Este es el id_actividad
    const { descripcion, fecha_actividad } = req.body;

    // Imprimir los valores recibidos para depuración
    console.log('ID de la actividad:', idActividad);
    console.log('Descripción:', descripcion);
    console.log('Fecha de actividad:', fecha_actividad);

    // Validar que todos los campos requeridos están presentes
    if (!descripcion || !fecha_actividad || !idActividad) {
        return res.status(400).send({ error: "Todos los campos son obligatorios" });
    }

    const updateQuery = `
        UPDATE actividades
        SET descripcion = ?,
            fecha_actividad = ?
        WHERE id_actividad = ?
    `;

    db.query(updateQuery, [descripcion, fecha_actividad, idActividad], (err, results) => {
        if (err) {
            console.error("Error al actualizar la actividad:", err);
            return res.status(500).send({ error: "Error al actualizar la actividad" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send({ error: "Actividad no encontrada" });
        }
        res.status(200).send({ message: "Actividad actualizada correctamente" });
    });
});








app.delete('/eliminarActividad/:id', (req, res) => {
    const idActividad = req.params.id;

    // Validar que el ID de la actividad es un número válido
    if (isNaN(parseInt(idActividad, 10))) {
        return res.status(400).send({ error: "El ID de la actividad debe ser un número válido" });
    }

    const deleteQuery = `
        DELETE FROM actividades
        WHERE id_actividad = ?
    `;

    db.query(deleteQuery, [idActividad], (err, results) => {
        if (err) {
            console.error("Error al eliminar actividad:", err);
            return res.status(500).send({ error: "Error al eliminar actividad" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send({ error: "Actividad no encontrada" });
        }
        res.status(200).send({ message: "Actividad eliminada correctamente" });
    });
});








app.get('/datosGenerales/:idEstudiante', (req, res) => {
    const idEstudiante = req.params.idEstudiante;

    if (!idEstudiante || isNaN(idEstudiante)) {
        return res.status(400).send({ error: "ID de estudiante no válido" });
    }

    const query = `
        SELECT 
            CONCAT(e.nombres, ' ', e.apellidos) AS nombre_estudiante,
            e.cedula,
            e.fecha_nacimiento,
            e.lugar_nacimiento,
            e.direccion,
            e.telefono,
            e.correo_electronico,
            c.nombre_carrera,
            ee.nombre_estado,
            t.tema AS tema_tesis,
            t.fecha_aprobacion,
            CONCAT(tu.nombres, ' ', tu.apellidos) AS nombre_tutor,
            te.nombre_tesis AS nombre_informe,
            te.fecha_informe,
            te.porcentaje_avance
        FROM estudiantes e
        JOIN carreras c ON e.id_carrera = c.id_Carreras
        JOIN estados_estudiantes ee ON e.id_estado_estudiante = ee.id_estados_estudiantes
        JOIN tesis t ON e.id_estudiante = t.id_estudiante
        JOIN tutores tu ON e.id_tutor = tu.id_tutores
        JOIN informes te ON t.id_tesis = te.id_tesis
        WHERE e.id_estudiante = ?
    `;

    db.query(query, [idEstudiante], (err, results) => {
        if (err) {
            console.error("Error al obtener los datos generales:", err);
            return res.status(500).send({ error: "Error al recuperar los datos generales del estudiante" });
        }

        if (results.length === 0) {
            return res.status(404).send({ error: "No se encontraron datos para el estudiante con el ID proporcionado" });
        }

        // Formatear la fecha de nacimiento y fecha de aprobación en formato DD-MM-YYYY
        results.forEach(result => {
            if (result.fecha_nacimiento) {
                result.fecha_nacimiento = new Date(result.fecha_nacimiento).toLocaleDateString('es-ES');
            }
            if (result.fecha_aprobacion) {
                result.fecha_aprobacion = new Date(result.fecha_aprobacion).toLocaleDateString('es-ES');
            }
            if (result.fecha_informe) {
                result.fecha_informe = new Date(result.fecha_informe).toLocaleDateString('es-ES');
            }
        });

        const data = results[0]; // Tomamos el primer resultado porque debería ser único por ID de estudiante

        // Capitalizar nombres y apellidos
        data.nombre_estudiante = capitalizeFirstLetter(data.nombre_estudiante);
        data.nombre_tutor = capitalizeFirstLetter(data.nombre_tutor);
        data.tema_tesis = capitalizeFirstLetter(data.tema_tesis);
        data.nombre_informe = capitalizeFirstLetter(data.nombre_informe);

        res.status(200).send(data);
    });
});

    
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});


