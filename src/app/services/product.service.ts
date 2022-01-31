import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(){
    return this.http.get('assets/data/productos.json');
  }

  getProductos(id: number){
    return this.http.get<any>('http://localhost/apiisabel/productos/'+id);
  }

  getCategorias(){
    return  this.http.get<any>('http://localhost/apiisabel/categorias');
  }

  buscarPorNombre(nombre: string){
    return this.http.get<any>('http://localhost/apiisabel/productosFil/'+nombre);
  }
}
