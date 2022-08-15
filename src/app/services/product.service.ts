import { UtilsService } from './utils.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private serUtil: UtilsService) { }

  getProducts(){
    return this.http.get('assets/data/productos.json');
  }

  getProductos(id: number){
    const URL = this.serUtil.URL_API + 'productos/' + id;
    return this.http.get<any>(URL);
  }

  addProducto(data: any){
    const URL = this.serUtil.URL_API + 'producto';
    return this.http.post<any>(URL, data);
  }

  getCategorias(){
    const URL = this.serUtil.URL_API + "procategorias";
    return  this.http.get<any>(URL);
  }

  buscarPorNombre(nombre: string){
    const URL = this.serUtil.URL_API + 'productosFil/' + nombre;
    return this.http.get<any>(URL);
  }
}
