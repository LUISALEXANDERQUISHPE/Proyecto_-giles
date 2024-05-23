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
    console.log("Datos recibidos:", req.body);
    const { nombre, apellido, correo_electronico, contrasenia } = req.body;

    bcrypt.hash(contrasenia, 10, (err, hash) => {
        if (err) {
            console.error('Error al hashear la contraseña:', err);
            return res.status(500).send({ error: "Error al procesar la contraseña" });
        }
        db.query(
            'INSERT INTO tutores (nombre, apellido, correo_electronico, contrasenia) VALUES (?, ?, ?, ?)',
            [nombre, apellido, correo_electronico, hash],
            (error, results) => {
                if (error) {
                    console.error('Error al insertar en la base de datos:', error);
                    return res.status(500).send({ error: "Error al registrar al tutor" });
                }
                res.status(201).send({ message: "Tutor registrado con éxito", id: results.insertId });
            }
        );
    });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
