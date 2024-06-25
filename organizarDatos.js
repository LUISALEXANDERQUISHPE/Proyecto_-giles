function obtenerNombreMes(mesNumero) {
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return meses[mesNumero - 1]; // Restamos 1 porque los meses en el array comienzan en 0
}

function obtenerUltimoDiaMes(fecha) {
    // Obtenemos el año y el mes de la fecha
    let [anno, mes] = fecha.split('-');
    // Creamos una nueva fecha con el mes siguiente (y día 0)
    let fechaSiguienteMes = new Date(anno, mes, 0);
    // Retornamos el último día del mes en formato "dd"
    return fechaSiguienteMes.getDate();
}

function ordenarPorMes(array) {
    const monthOrder = {
        enero: 1,
        febrero: 2,
        marzo: 3,
        abril: 4,
        mayo: 5,
        junio: 6,
        julio: 7,
        agosto: 8,
        septiembre: 9,
        octubre: 10,
        noviembre: 11,
        diciembre: 12,
    };

    function obtenerNumeroMes(cadena) {
        const partes = cadena.split(" ");
        const nombreMes = partes[5];
        return monthOrder[nombreMes];
    }

    array.sort((a, b) => {
        const mesA = obtenerNumeroMes(a.fecha_actividad);
        const mesB = obtenerNumeroMes(b.fecha_actividad);
        return mesA - mesB;
    });

    return array;
}

function agruparPorMes(actividades) {
    // Objeto para almacenar las agrupaciones por mes
    let actividadesPorMes = {};

    // Recorremos cada actividad del array
    actividades.forEach(actividad => {
        // Obtenemos la fecha de la actividad
        let fecha = actividad.fecha_actividad.toISOString().split("T")[0];
        let ultimoDiaMes = obtenerUltimoDiaMes(fecha);
        // Extraemos el mes y el año de la fecha
        let [anno, mes] = fecha.split('-');
        // Convertimos el número de mes a su nombre correspondiente
        let nombreMes = obtenerNombreMes(parseInt(mes));

        // Creamos la clave para el mes en formato deseado
        let claveMes = `Del 01 al ${ultimoDiaMes} de ${nombreMes} de ${anno}`;

        // Si la clave del mes no existe en el objeto, la creamos
        if (!actividadesPorMes[claveMes]) {
            actividadesPorMes[claveMes] = {
                fecha_actividad: claveMes,
                descripcion: []
            };
        }

        // Agregamos la descripción a la lista correspondiente al mes
        actividadesPorMes[claveMes].descripcion.push(actividad.descripcion);
    });

    // Convertimos el objeto a un array de valores (si se desea el formato exacto del ejemplo)
    let resultado = Object.values(actividadesPorMes);
    
    return ordenarPorMes(resultado);
}
module.exports=agruparPorMes