
const { MiPDF } = require('./generadorPdf.js');
function generarInformePDF(actividades, datos, observaciones) {
    const topMargin = 25.4; // 1 pulgada en mm
    const bottomMargin = 25.4; // 1 pulgada en mm
    const leftMargin = 30; // 3 cm en mm
    const rightMargin = 30; // 3 cm en mm
    const doc = new MiPDF(topMargin, leftMargin, bottomMargin, rightMargin);
    ponerEncabezado(datos, doc, 5);
    ponerActividades(actividades, doc);
    ponerObservaciones(observaciones, doc);
    ponerFirmaNota(doc, datos.tutor); 
    doc.save("Anexo_5.pdf")
  }
  function generarInformePDFFinal(actividades, datos) {
    const topMargin = 25.4; // 1 pulgada en mm
    const bottomMargin = 25.4; // 1 pulgada en mm
    const leftMargin = 30; // 3 cm en mm
    const rightMargin = 30; // 3 cm en mm
    const doc = new MiPDF(topMargin, leftMargin, bottomMargin, rightMargin);
    ponerEncabezado(datos, doc, 11);
    ponerActividadesFinal(actividades, doc);
    ponerFirmaNotaFinal(doc, datos.tutor); 
    doc.save("Anexo_11.pdf")
  }

  function ponerEncabezado(datos, doc, num) {
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
  
    // Añadir los textos usando el método texto de MiPDF
    doc.centrarTexto(`ANEXO ${num}`);
    doc.espacio();
    doc.centrarTexto('INFORME MENSUAL DEL AVANCE DEL TRABAJO DE TITULACIÓN');
    doc.interlineado(4);
    doc.espacio();
    doc.interlineado(4);
    doc.centrarTexto('UNIVERSIDAD TÉCNICA DE AMBATO');
    doc.interlineado(4);
    doc.centrarTexto('FACULTAD DE INGENIERÍA EN SISTEMAS, ELECTRÓNICA E INDUSTRIAL');
    doc.interlineado(4);
    doc.centrarTexto('CARRERA DE ' + datos.carrera.toUpperCase());
    doc.interlineado(4);
    doc.espacio();
    doc.interlineado(4);
    doc.setFontSize(10);
    doc.texto('FECHA: ' +cortarEnT(datos.fecha));
    doc.espacio();
    doc.texto('NOMBRE DEL ESTUDIANTE: ' + datos.nombreEstudiante.toUpperCase());
    doc.espacio();
    doc.texto('MODALIDAD DE TITULACIÓN: TESIS');
    doc.espacio();
    doc.texto('TEMA DEL TRABAJO DE TITULACIÓN: ' + datos.tema.toUpperCase());
    doc.espacio();
    let texto = 'FECHA DE APROBACIÓN DE LA PROPUESTA DEL TRABAJO DE TITULACIÓN POR EL CONSEJO DIRECTIVO: ' 
    + cortarEnT(datos.fechaAprobacion);
    doc.texto(texto);
    doc.espacio();
    doc.texto('PORCENTAJE DE AVANCE DE ACUERDO AL CRONOGRAMA: ' + datos.porcentaje + '%');
    doc.espacio();
}

  
  function ponerObservaciones(observaciones, doc) {
    if( observaciones.length==0)
        return
    doc.setFont('times', 'bold');
    doc.texto('OBSERVACIONES:');
  
    observacionesLi(observaciones, doc);
  };
  
  function observacionesLi(observaciones, doc) {
    const fontSize = 10;
    doc.setFontSize(fontSize);
    doc.setFont('times', 'normal');
    let y = 202;
    observaciones.forEach(line => {
      doc.texto(line)    
    });
  }
  
  function ponerFirmaNota(doc, tutor) {
    const textHeight = 64/0.36;
    const pageHeight = doc.pageHeight;
    const marginBottom = doc.marginBottom;
    let y = doc.yP; // Empieza desde donde terminan las observaciones
    const availableHeight = pageHeight - y - marginBottom; // Ajusta según el espacio que necesitas
    doc.setFont('times', 'bold');
    doc.espacio()
    doc.espacio()
    doc.espacio()
    doc.espacio()
    doc.espacio()
    doc.espacio()
    doc.espacio()
    doc.espacio()
    doc.centrarTexto('_________________________________________\n')
    doc.interlineado(1)
    doc.centrarTexto ( tutor.toUpperCase() )
    doc.interlineado(2)
    doc.centrarTexto('TUTOR TRABAJO TITULACIÓN')
      }
  
  function ponerActividades(activities, doc) {
    if(activities.length==0)
        return

    doc.filaDosColumnas("Fecha", 20, "Actividad", 128);
    doc.setFont('times', 'normal');
    activities.forEach(item => {
        const nombre = cortarEnT(item.fecha_actividad.toString()); // Convertir a string por si acaso
        const valor = item.descripcion.toString(); // Convertir a string por si acaso
        doc.filaDosColumnas(nombre, 20, valor, 128);
    });

  }

  function ponerActividadesFinal(activities, doc) {
    if(activities.length==0)
        return

    doc.filaDosColumnasFinal("Fecha", 55, [ "Actividad"], 95, false);
    doc.setFont('times', 'normal');
    activities.forEach(item => {
        const nombre = cortarEnT(item.fecha_actividad.toString());
        const valor = item.descripcion; 
        doc.filaDosColumnasFinal(nombre, 55, valor, 95);
    });

  }

  function ponerFirmaNotaFinal(doc, tutor){
    const textHeight = 125/0.36;
    const pageHeight = doc.pageHeight;
    const marginBottom = doc.marginBottom;
    let y = doc.yP; // Empieza desde donde terminan las observaciones
    const availableHeight = pageHeight - y - marginBottom; // Ajusta según el espacio que necesitas
 
   
    doc.setFont('times', 'bold');
    doc.espacio()
    doc.espacio()
    doc.espacio()
    doc.espacio()
    doc.espacio()
    doc.espacio()
    doc.espacio()
    doc.espacio()
    doc.centrarTexto('_________________________________________\n')
    doc.interlineado(1)
    doc.centrarTexto ( tutor.toUpperCase() )
    doc.interlineado(2)
    doc.centrarTexto('TUTOR TRABAJO TITULACIÓN');
  }

  function cortarEnT(texto) {
    texto=texto.toString();
    var posicionT = texto.indexOf('T');
    
    // Si encuentra 't', corta el string desde el inicio hasta la posición de 't'
    if (posicionT !== -1) {
        return texto.substring(0, posicionT);
    } else {
        // Si no encuentra 't', devuelve el string original
        return texto;
    }
}
  module.exports = {generarInformePDF, generarInformePDFFinal}