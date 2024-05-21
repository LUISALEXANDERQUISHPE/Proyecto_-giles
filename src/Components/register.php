<?php
// Incluir la conexión a la base de datos
include 'conexion.php';

// Manejar la solicitud POST del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recuperar los datos del formulario
    $nombre = $_POST['nombre'];
    $apellidos = $_POST['apellidos'];
    $email = $_POST['email'];
    $contrasena = $_POST['password']; // Asegúrate de que el nombre del campo coincida con el del formulario

    // Insertar los datos en la base de datos
    $sql = "INSERT INTO Usuarios (nombre, apellidos, correo_electronico, contrasena) 
            VALUES ('$nombre', '$apellidos', '$email', '$contrasena')";

    if (mysqli_query($conn, $sql)) {
        echo "Registro exitoso";
    } else {
        echo "Error al registrar usuario: " . mysqli_error($conn);
    }
}
?>
