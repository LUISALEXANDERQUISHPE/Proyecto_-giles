import Swal from 'sweetalert2';

// En AlertActividad.js

export const alertaCrearActividad = async (idInforme) => {
    // El código de tu función alertaCrearActividad
  
      const { value: formValues } = await Swal.fire({
        title: 'Crear nueva actividad',
        html:
          '<p class="swal2-title">Fecha de actividad</p>' +
          '<input id="fecha-actividad" class="swal2-input" placeholder="Fecha de actividad" type="date">' +
          '<p class="swal2-title">Descripción</p>' +
          '<textarea id="detalle-actividad" class="swal2-textarea" placeholder="Descripción"></textarea>',
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
        try {
            const response = await fetch("/crearActividad", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formValues),
            });
            const data = await response.json();
            
            if (response.ok) {
                // Si la creación de la actividad fue exitosa, mostrar un mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Actividad creada',
                    text: 'La actividad se ha creado correctamente.',
                    confirmButtonColor: '#1a202c'
                });
            } else {
                // Si hubo un error al crear la actividad, mostrar un mensaje de error específico
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al crear la actividad. Por favor, inténtalo de nuevo más tarde.',
                    confirmButtonColor: '#1a202c'
                });
                console.error('Error al crear la actividad:', data.error);
            }
        } catch (error) {
            // Si hubo un error en la solicitud, mostrar un mensaje de error específico
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al crear la actividad. Por favor, inténtalo de nuevo más tarde.',
                confirmButtonColor: '#1a202c'
            });
            console.error('Error al crear la actividad:', error);
        }
    }
};
