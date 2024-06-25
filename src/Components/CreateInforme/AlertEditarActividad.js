import Swal from 'sweetalert2';

const alertaEditarActividad = async (actividad, fetchActividades) => {
    const { id_actividad, fecha_actividad, descripcion } = actividad;

    const { value: formValues } = await Swal.fire({
        title: 'Editar actividad',
        html:
            `<style>
                .custom-date-input { width: 100%; height: 40px; font-size: 16px; }
            </style>
            <p class="swal2-title">Fecha de actividad</p>
            <input id="fecha-actividad" class="swal2-input custom-date-input" placeholder="Fecha de actividad" type="date" value="${fecha_actividad}">
            <p class="swal2-title">Descripción</p>
            <textarea id="detalle-actividad" class="swal2-textarea">${descripcion}</textarea>`,
        focusConfirm: false,
        preConfirm: () => {
            return {
                fechaActividad: document.getElementById('fecha-actividad').value,
                detalle: document.getElementById('detalle-actividad').value,
                idActividad: id_actividad
            };
        },
        showCancelButton: true,
        confirmButtonText: 'Actualizar Actividad',
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
        console.log('Datos actualizados de la actividad:', formValues);

        // Realizar la solicitud de actualización de actividad
        try {
            const response = await fetch("/actualizarActividad", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formValues),
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                // Si la actualización fue exitosa, mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Actividad actualizada',
                    text: 'La actividad se ha actualizado correctamente.',
                    confirmButtonColor: '#1a202c'
                }).then(() => {
                    fetchActividades(); // Recargar actividades después de la actualización exitosa
                });

            } else {
                // Mostrar mensaje de error si hubo un problema en la actualización
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Ocurrió un error al actualizar la actividad: ${data.error || 'Desconocido'}. Por favor, inténtalo de nuevo más tarde.`,
                    confirmButtonColor: '#1a202c'
                });
                console.error('Error al actualizar la actividad:', data.error);
            }

        } catch (error) {
            // Mostrar mensaje de error si hubo un problema en la solicitud
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al actualizar la actividad. Por favor, inténtalo de nuevo más tarde.',
                confirmButtonColor: '#1a202c'
            });
            console.error('Error al actualizar la actividad:', error);
        }
    }
};

export default alertaEditarActividad;
