import { UtilsService } from './utils.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private serUtil: UtilsService) { }

  /** Función que recupera los pedidos del usuario **/
  getPedidos(id: number) {
    const URL = this.serUtil.URL_API + 'pedidos/' + id;
    return this.http.get<any>(URL);
  }

  /** Función que recupera los productos de un pedido **/
  getDetallePedido(id: number) {
    const URL = this.serUtil.URL_API + 'detallepedido/' + id;
    return this.http.get<any>(URL);
  }

  /** Función que recupera las compras entregadas del usuario **/
  getCompras(id: number) {
    const URL = this.serUtil.URL_API + 'compras/' + id;
    return this.http.get<any>(URL);
  }
}
