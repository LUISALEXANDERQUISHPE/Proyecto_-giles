import Swal from 'sweetalert2';

export const alertaEditarActividad = async (actividad, fetchActividades) => {
    const { id_actividad, fecha_actividad, descripcion } = actividad;

    const { value: formValues } = await Swal.fire({
        title: 'Editar actividad',
        html: `
            <input id="fecha-actividad" class="swal2-input" type="date" value="${fecha_actividad}">
            <textarea id="detalle-actividad" class="swal2-textarea">${descripcion}</textarea>`,
        focusConfirm: false,
        preConfirm: () => ({
            fecha_actividad: document.getElementById('fecha-actividad').value,
            descripcion: document.getElementById('detalle-actividad').value
        }),
        showCancelButton: true,
        confirmButtonText: 'Actualizar Actividad',
        cancelButtonText: 'Cancelar',
    });

    if (formValues) {
        console.log('Datos actualizados de la actividad:', formValues);

        // Realizar la solicitud de actualización de actividad
        fetch(`/editarActividad/${id_actividad}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fecha_actividad: formValues.fecha_actividad, descripcion: formValues.descripcion })
        })
        .then(async (response) => {
            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Actividad actualizada',
                    text: 'La actividad se ha actualizado correctamente.',
                    showConfirmButton: false,
                    timer: 2500
                }).then(() => {
                    fetchActividades();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Ocurrió un error al actualizar la actividad: ${data.error || 'Desconocido'}.`,
                    showConfirmButton: true
                });
                console.error('Error al actualizar la actividad:', data.error);
            }
        })
        .catch(error => {
            console.error('Error al actualizar la actividad:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al actualizar la actividad.',
                showConfirmButton: true
            });
        });
    }
};




export default alertaEditarActividad;

