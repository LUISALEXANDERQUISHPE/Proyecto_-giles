const express = require("express");
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

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

app.get('/actividades', (req, res) => {
    const {informeId}= req.body;
    const activitiesQuery = `
        SELECT 
            a.fecha_actividad,
            a.descripcion
        FROM actividades a
        WHERE a.id_informe = ?
    `;// Descomenta las siguientes líneas para depurar la consulta y los parámetros
    // console.log("Ejecutando consulta:", activitiesQuery);
    // console.log("Con parámetros:", idInforme);
    db.query(activitiesQuery, [informeId], (err, results) => {
        if (err) {
            console.error("Error al obtener actividades:", err);
            return res.status(500).send({ error: "Problemas técnicos al recuperar actividades." });
        }
        res.status(200).send(results);
    });
});




app.listen(5000, () => {
    console.log("Server is running on port 5000");
});







