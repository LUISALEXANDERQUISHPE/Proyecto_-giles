import Swal from 'sweetalert2';

export const alertaCrearActividad = async (handleCrearActividad) => {
    const { value: formValues } = await Swal.fire({
        title: 'Crear nueva actividad',
        html:
          '<input id="fecha-actividad" class="swal2-input" placeholder="Fecha de actividad" type="date">' +
          '<textarea id="detalle-actividad" class="swal2-textarea" placeholder="Descripcion"></textarea>',
        focusConfirm: false,
        preConfirm: () => {
            return {
                fechaActividad: document.getElementById('fecha-actividad').value,
                detalle: document.getElementById('detalle-actividad').value
            };
        },
        showCancelButton: true,
        confirmButtonText: 'Crear Actividad',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#7C121F',
        confirmButtonColor: '#1a202c',
        backdrop: true,
        allowOutsideClick: false,
        customClass: {
            popup: 'custom-swal-popup',
            input: 'custom-swal-input',
            confirmButton: 'custom-swal-button'
        }
    });

    if (formValues && formValues.fechaActividad && formValues.detalle) {
        console.log('Datos de la nueva actividad:', formValues);
        
        // Realizar la solicitud de creación de actividad
        handleCrearActividad(formValues); // Esta función debe ser proporcionada por el componente padre
    }
};
