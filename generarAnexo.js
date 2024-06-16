
const { MiPDF } = require('./generadorPdf.js');
function generarInformePDF(actividades, datos, observaciones) {
    const topMargin = 25.4; // 1 pulgada en mm
    const bottomMargin = 25.4; // 1 pulgada en mm
    const leftMargin = 30; // 3 cm en mm
    const rightMargin = 30; // 3 cm en mm
    const doc = new MiPDF(topMargin, leftMargin, bottomMargin, rightMargin);
    ponerEncabezado(datos, doc);
    ponerActividades(actividades, doc);
    ponerObservaciones(observaciones, doc);
    ponerFirmaNota(doc, datos.tutor); 
    doc.save("Anexo_6.pdf")
  }
  function generarInformePDFFinal(actividades, datos) {
    const topMargin = 25.4; // 1 pulgada en mm
    const bottomMargin = 25.4; // 1 pulgada en mm
    const leftMargin = 30; // 3 cm en mm
    const rightMargin = 30; // 3 cm en mm
    const doc = new MiPDF(topMargin, leftMargin, bottomMargin, rightMargin);
    ponerEncabezado(datos, doc);
    ponerActividades(actividades, doc);
    ponerFirmaNotaFinal(doc, datos.tutor); 
    doc.save("Anexo_13.pdf")
  }

  function ponerEncabezado(datos, doc) {
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
  
    // Añadir los textos usando el método texto de MiPDF
    doc.centrarTexto('ANEXO 6');
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
    doc.texto('FECHA: ' + datos.fecha.toUpperCase());
    doc.espacio();
    doc.texto('NOMBRE DEL ESTUDIANTE: ' + datos.nombreEstudiante.toUpperCase());
    doc.espacio();
    doc.texto('MODALIDAD DE TITULACIÓN: TESIS');
    doc.espacio();
    doc.texto('TEMA DEL TRABAJO DE TITULACIÓN: ' + datos.tema.toUpperCase());
    doc.espacio();
    let texto = 'FECHA DE APROBACIÓN DE LA PROPUESTA DEL TRABAJO DE TITULACIÓN POR EL CONSEJO DIRECTIVO: ' 
    + datos.fechaAprobacion.toUpperCase();
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
    doc.centrarTexto('_________________________________________\n')
    doc.interlineado(1)
    doc.centrarTexto ( tutor.toUpperCase() )
    doc.interlineado(2)
    doc.centrarTexto('TUTOR TRABAJO TITULACIÓN');
    doc.interlineado(4);
    doc.espacio();
    doc.espacio();
    doc.interlineado(4);
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.texto('NOTA: los informes mensuales de los avances del trabajo de'+
        ' titulación emitidos por el docente tutor deberán ser enviados por Quipux a la secretaría de la Unidad de Titulación'+
        ' con copia al docente miembro de la Unidad de Titulación y por correo al estudiante, debidamente firmados.');

    
      }
  
  function ponerActividades(activities, doc) {
    if(activities.length==0)
        return

    doc.filaDosColumnas("Fecha", 20, "Actividad", 130);
    doc.setFont('times', 'normal');
    activities.forEach(item => {
        const nombre = cortarEnT(item.fecha_actividad.toString()); // Convertir a string por si acaso
        const valor = item.descripcion.toString(); // Convertir a string por si acaso
        doc.filaDosColumnas(nombre, 20, valor, 130);
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
    doc.centrarTexto('_________________________________________\n')
    doc.interlineado(1)
    doc.centrarTexto ( tutor.toUpperCase() )
    doc.interlineado(2)
    doc.centrarTexto('TUTOR TRABAJO TITULACIÓN');
    doc.interlineado(4);
    doc.espacio();
    doc.espacio();
    doc.interlineado(4);
   
    doc.setFontSize(16);
    doc.setX(doc.leftMargin+9);
    const ini=doc.yP;
    doc.setY(doc.yP-1)
    doc.setFont('times', 'bold');
    doc.texto('.')
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.setY(ini)
    doc.setX(doc.leftMargin+15)
    doc.texto('INFORMES MENSUALES DE LOS AVANCES DEL TRABAJO DE '+
        'TITULACIÓN EMITIDOS POR EL DOCENTE TUTOR (el Docente deberá'+
        ' enviarlos por Quipux a la secretaria de la Unidad de Titulación'+
        ' con copia al docente miembro de la Unidad de Titulación y por'+
        ' correo al estudiante, debidamente firmados).');

    doc.interlineado(4)
    doc.setX(doc.leftMargin)
    doc.texto('NOTA: Este informe deberá ser entregado por el docente tutor vía Quipux a la Ab. Daniela Montenegro, Secretaria de Consejo Directivo de Facultad, con copia al Docente responsable de la Unidad de Titulación de la Carrera y a la Ab. Elena Arcos, Secretaria de la Unidad de Titulación, y vía correo electrónico al estudiante.')
    doc.interlineado(4)
    doc.texto('En el informe de cumplimiento del 100% del tutor se deberán detallar las fechas de los avances mensuales, las cuales deberán corresponderse con las fechas insertas en cada informe mensual.')
    doc.interlineado(4)
    doc.texto('TODOS LOS INFORMES DEBERÁN CONTENER EL TEMA DE LA PROPUESTA APROBADO O MODIFICADO (SI ES EL CASO) CON RESOLUCIÓN DE CONSEJO DIRECTIVO DE FACULTAD, NO PODRÁN EXISTIR TEMAS DISTINTOS EN NINGUNA FASE NI DOCUMENTACIÓN DEL PROCESO.')
  }

  function cortarEnT(texto) {
    // Busca la posición de la primera 't' en el string
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

