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

    const checkQuery = 'SELECT COUNT(*) AS count FROM tutores WHERE nombres = ? AND apellidos = ?';
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
    const { nombres, apellidos, id_Carreras, tutorId, tema_proyecto, fecha } = req.body;

    const nombreUpper = nombres.toUpperCase();
    const apellidoUpper = apellidos.toUpperCase();
    const id_carrera = parseInt(id_Carreras, 10);
    const id_tutor = parseInt(tutorId, 10);

    // Comenzar transacción
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error al iniciar transacción:', err);
            return res.status(500).send({ error: "Error técnico al iniciar la transacción" });
        }

        const insertQuery = `
            INSERT INTO estudiantes (nombres, apellidos, id_carrera, id_estado_estudiante, id_tutor)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(insertQuery, [nombreUpper, apellidoUpper, id_carrera, 2, id_tutor], (errorInsert, resultsInsert) => {
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
            db.query(insertQuery2, [tema_proyecto, fecha, 0, id_estudiante], (errorInsert2, resultsInsert2) => {
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
    `;

    db.query(query, (err, results) => {
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



app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
