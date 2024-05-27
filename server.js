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

    const checkQuery = 'SELECT COUNT(*) AS count FROM tutores WHERE nombre = ? AND apellido = ?';
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
                return res.status(400).send({ error: "El correo electrónico ya está registrado" });
            }

            bcrypt.hash(contrasenia, 10, (errHash, hash) => {
                if (errHash) {
                    console.error('Error al hashear la contraseña:', errHash);
                    return res.status(500).send({ error: "Error al procesar la contraseña" });
                }

                const insertQuery = 'INSERT INTO tutores (nombre, apellido, correo_electronico, contrasenia) VALUES (?, ?, ?, ?)';
                db.query(insertQuery, [nombreUpper, apellidoUpper, correo_electronico, hash], (errorInsert, resultsInsert) => {
                    if (errorInsert) {
                        console.error('Error al insertar en la base de datos:', errorInsert);
                        return res.status(500).send({ error: "Error al registrar al tutor" });
                    }
                    res.status(201).send({ message: "Tutor registrado con éxito" });
                });
            });
        });
    });
});

app.post('/login', (req, res) => {
    const { correo_electronico, contrasenia } = req.body;

    const checkQuery = 'SELECT nombre, apellido, contrasenia FROM tutores WHERE correo_electronico = ?';
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
                nombre: user.nombre,
                apellido: user.apellido
            });
        });
    });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
