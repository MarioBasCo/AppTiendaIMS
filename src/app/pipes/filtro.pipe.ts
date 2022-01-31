import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(arreglo: any[], texto: string, nomCol: string): any[] {
    if (texto === '') {
      return arreglo;
    }
    
    texto = texto.toLowerCase();
    return arreglo.filter(columna => {
      return columna[nomCol].toLowerCase().includes(texto);
    })
  }
}
