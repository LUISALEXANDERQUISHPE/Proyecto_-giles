import Swal from 'sweetalert2';
import './AlertEstado.css';

const estadoMap = {
    1: 'Abandono',
    2: 'En proceso',
    3: 'Graduado'
};

export const alertaCambioEstado = async (idEstudiante, updateStudentState) => {
    const { value: estado } = await Swal.fire({
        title: 'Cambiar el estado del estudiante',
        icon: 'warning',
        background: '#fff',
        showConfirmButton: true,
        confirmButtonColor: '#1a202c',
        backdrop: true,
        allowOutsideClick: false,
        input: 'select',
        inputPlaceholder: 'Estado del estudiante',
        confirmButtonText: 'Seleccionar',
        inputOptions: estadoMap,
        customClass: {
            popup: 'custom-swal-popup',
            input: 'custom-swal-input',
            confirmButton: 'custom-swal-button'
        },
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#7C121F',
    });

    if (estado) {
        console.log('Estado seleccionado:', estado);
        
        // Realizar la solicitud de actualización
        fetch(`/updateestado/${idEstudiante}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nuevoEstado: estado })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            updateStudentState(estado); // Actualizar el estado del estudiante en el frontend
            Swal.fire({
                icon: 'success',
                title: '¡Estado actualizado!',
                text: `El nuevo estado actual es: "${estadoMap[estado]}"`,
                showConfirmButton: false,
                timer: 2500
            });
        })
        .catch(error => {
            console.error("Error al actualizar el estado:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar el estado',
                text: 'Hubo un problema al actualizar el estado del estudiante.',
                showConfirmButton: true
            });
        });
    }
};
