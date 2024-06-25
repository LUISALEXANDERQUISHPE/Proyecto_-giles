const { jsPDF } = require("jspdf");

class MiPDF {
    constructor(topMargin , bottomMargin , leftMargin , rightMargin) {
        this.doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        this.topMargin = topMargin;
        this.bottomMargin = bottomMargin;
        this.leftMargin = leftMargin;
        this.rightMargin = rightMargin;
        this.yP = topMargin; // Inicializar la posición vertical con el margen superior
        this.xP = leftMargin;
        this.pageWidth = 210; // Ancho de la página A4 en mm
        this.pageHeight = 297;
    }

    // Método para añadir texto respetando los márgenes
    texto(texto, nuevaHoja=true) {
        const margins = {
            top: this.topMargin,
            bottom: this.bottomMargin,
            left: this.leftMargin,
            right: this.rightMargin
        };
        const lineHeight = this.getLineHeight();
        const availableSpace = this.pageWidth - this.xP - margins.right;

        // Dividir el texto en líneas según el espacio disponible
        let lines = this.doc.splitTextToSize(texto, availableSpace-5);

        if(nuevaHoja)
          if (this.yP + lines.length * lineHeight > this.pageHeight - this.bottomMargin) {
            // Si no hay suficiente espacio, añadir una nueva página
            this.nuevaPaguina();
         }

        // Añadir cada línea de texto a la posición calculada
        lines.forEach(line => {
            this.doc.text(line, this.xP, this.yP);
            this.interlineado(1)
            this.yP += lineHeight;
        });
    }
    setX(x){
      this.xP=x
    }
    setY(y){
      this.yP=y
    }
    textoP(line,x){
      const lineHeight = this.getLineHeight();
      this.doc.text(line, x, this.yP);
      this.yP += lineHeight;
    }
    nuevaPaguina() {
        this.doc.addPage();
        this.yP = this.topMargin;
    }

    filaDosColumnas( texto1, anchoColumna1, texto2, anchoColumna2) {
      const lineHeight = this.getLineHeight();
      const totalWidth = anchoColumna1 + anchoColumna2;
      let lines1 = this.doc.splitTextToSize(texto1, anchoColumna1);
      let lines2 = this.doc.splitTextToSize(texto2, anchoColumna2);
      const maxHeight = Math.max(lines1.length * lineHeight, lines2.length * lineHeight+4);

        const availableHeight = this.pageHeight - this.bottomMargin - this.yP;
        if (maxHeight+10 > availableHeight) {
            this.nuevaPaguina();
        }
        const initialYP = this.yP;
        // Dibujar línea vertical izquierda de la primera columna
        this.doc.line(this.xP, this.yP, this.xP, this.yP + maxHeight+4);

        // Dibujar línea vertical derecha de la primera columna
        this.doc.line(this.xP + anchoColumna1, this.yP, this.xP + anchoColumna1,
           this.yP + maxHeight+4);

        // Dibujar línea vertical derecha de la segunda columna
        this.doc.line(this.xP + totalWidth, this.yP, this.xP + totalWidth, 
          this.yP + maxHeight+4);

        // Dibujar línea horizontal superior
        this.doc.line(this.xP, this.yP, this.xP + totalWidth, this.yP);

        this.yP =initialYP+5;
        lines1.forEach(line => {
          this.doc.text(this.xP +2, this.yP, line);
            this.yP += lineHeight; // Moverse a la siguiente línea
        });

        // Restaurar la posición vertical inicial
        this.yP = initialYP +5; // Restaurar posición vertical inicial

        // Añadir texto en la segunda columna
        lines2.forEach(line => {
          this.doc.text(this.xP + anchoColumna1 + 2, this.yP, line);
            this.yP += lineHeight; // Moverse a la siguiente línea
        });

        // Restaurar la posición vertical al final
        this.yP = initialYP + maxHeight+4;
        this.doc.line(this.xP, this.yP, this.xP + totalWidth, this.yP);
    }
    filaDosColumnasFinal( texto1, anchoColumna1, texto2, anchoColumna2, lista=true) {
        const totalWidth = anchoColumna1 + anchoColumna2;
        texto2 = texto2.map(str => str.replace(/\n/g, " "));
        
        let maxHeight = 0;

        const availableHeight = this.pageHeight - this.bottomMargin - this.yP;
        let contadorLines=0;
        while(true){
          let lineas=this.doc.splitTextToSize((texto2[contadorLines], anchoColumna2-7)).length;
          let largoTexto=lineas*(this.getLineHeight()+4)
          maxHeight+=largoTexto;
          if( maxHeight+10>availableHeight){
            break
            }
          contadorLines++;
          if(contadorLines==texto2.length)
            break;
        }
        let lines2= texto2.slice(0, contadorLines)     
        if(lines2.length === 0) {
          this.nuevaPaguina()
          this. filaDosColumnasFinal( texto1, anchoColumna1, texto2, anchoColumna2)
          return
        }
        const initialYP = this.yP;

        this.doc.line(this.xP, this.yP, this.xP + totalWidth, this.yP);
        
        this.doc.text(this.xP +2, this.yP+5, texto1);
        this.yP =initialYP+5;
        if(lista){
          this.hacerLista(lines2,this.xP + anchoColumna1)
        }else{
          this.doc.text(this.xP + anchoColumna1+2, this.yP, lines2);
        }
        this.setX(this.leftMargin)
        this.doc.line(this.xP,  initialYP, this.xP, this.yP +5);

        // Dibujar línea vertical derecha de la primera columna
        this.doc.line(this.xP + anchoColumna1, initialYP, this.xP + anchoColumna1,
           this.yP +5);

        // Dibujar línea vertical derecha de la segunda columna
        this.doc.line(this.xP + totalWidth, initialYP, this.xP + totalWidth, 
          this.yP +5);
        
        this.setY(this.yP+5);
        this.doc.line(this.xP, this.yP, this.xP + totalWidth, this.yP);
        this.setX(this.leftMargin)
        if(contadorLines<texto2.length){
          this.nuevaPaguina()
          this.filaDosColumnasFinal("",anchoColumna1, texto2.slice(contadorLines,texto2.length),anchoColumna2)
        }
    }
    hacerLista(items,x){
      this.setX(x)

      items.forEach(item => {
        this.setFont('times', 'bold');
        this.setX(this.xP+4)
        let Y=this.yP
        this.setFontSize(20);
        this.setY(Y-1)
        this.texto('.')
        this.setY(Y)
        this.setFontSize(10);
        this.setFont('times', 'normal');
        this.setX(this.xP+3)
        this.texto(item, false);
        this.setX(this.xP-7)
      });
    }
    interlineado(l){
      this.yP +=l;
    }
    espacio(){
      this.yP += this.getLineHeight();
    }
    getLineHeight() {
        const fontSize = this.doc.getFontSize();
        const lineHeight = fontSize *  0.3527777778;
        return lineHeight;
    }
    centrarTexto(texto) {
      var textLines = this.doc.splitTextToSize(texto,
         this.pageWidth-this.leftMargin-this.rightMargin);
      textLines.forEach(texto => {
        this.centranLinea(texto)
        
      });
    }
    centranLinea(texto){
      var width = this.pageWidth;
      var textoWidth = this.doc.getStringUnitWidth(texto) * this.doc.internal.getFontSize();
      var textoWidthMM = textoWidth * 0.3528;
      var x = (width - textoWidthMM) / 2;
      this.textoP(texto, x);
    }
    setFontSize(numero){
      this.doc.setFontSize(numero)
    }
    setFont(fuente,tipo){
      this.doc.setFont(fuente,tipo)
    }
    save( filename) {
        this.doc.save(filename);
    }
}
module.exports={MiPDF}