import Swal from 'sweetalert2';
import './Alerts.css';

// Función para alerta de éxito
export const successAlert = (message) => {
    Swal.fire({
        title: message,
        icon: 'success',
        background: '#fff',
        showConfirmButton: false,
        backdrop: true,
        timer: 2500,
        timerProgressBar:true,
        allowOutsideClick: false,
        position: "top-end",
    });
}

// Función para alerta de error
export const errorAlert = (message) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}
