<?php
header("Content-Type: application/json");

// Verificar si la solicitud es de tipo POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(array("success" => false, "message" => "La solicitud debe ser de tipo POST"));
    exit;
}

// Datos de conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = ""; // Cambiar esto con tu contraseña
$dbname = "register";

try {
    // Establecer la conexión PDO
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Configurar el modo de error para lanzar excepciones
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recibir los datos del formulario
    $nombre = $_POST['nombre'] ?? '';
    $apellidos = $_POST['apellidos'] ?? '';
    $correo_electronico = $_POST['correo_electronico'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';

    // Verificar si se recibieron los datos necesarios
    if (empty($nombre) || empty($apellidos) || empty($correo_electronico) || empty($contrasena)) {
        echo json_encode(array("success" => false, "message" => "Faltan datos"));
        exit;
    }

    // Hashear la contraseña antes de almacenarla
    $hashed_password = password_hash($contrasena, PASSWORD_DEFAULT);

    // Preparar y ejecutar la consulta SQL para insertar los datos en la tabla de usuarios
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellidos, correo_electronico, contrasena) 
                            VALUES (:nombre, :apellidos, :correo_electronico, :contrasena)");
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':apellidos', $apellidos);
    $stmt->bindParam(':correo_electronico', $correo_electronico);
    $stmt->bindParam(':contrasena', $hashed_password);
    $stmt->execute();

    // Enviar respuesta de éxito con un mensaje
    echo json_encode(array("success" => true, "message" => "Usuario registrado exitosamente"));
} catch(PDOException $e) {
    // Enviar respuesta de error y registrar el error
    echo json_encode(array("success" => false, "message" => "Error al registrar usuario"));
    // Registra el error en un archivo de registro (opcional)
    error_log("Error al registrar usuario: " . $e->getMessage(), 0);
}

// Cerrar la conexión
$conn = null;
?>
