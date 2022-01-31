import { UtilsService } from './utils.service';
import { HttpClient } from '@angular/common/http';
import { LstorageService } from './lstorage.service';
import { IPedido, IProducto } from './../interfaces/interfaces';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private myCart: IPedido[]; //array que contiene los productos del pedido

  constructor(private serStorage: LstorageService, private http: HttpClient, private serUtil: UtilsService) {
    this.cargarProductos();
  }

  /** Función para listar los productos desde otras clases **/
  get listCart() {
    return this.myCart;
  }

  /** Función para validar si el usuario mantiene productos en el carrito **/
  cargarProductos() {
    this.myCart = [];
    if (this.serStorage.get('mycart')) {
      this.myCart = this.serStorage.get('mycart');
    }
  }

  /** Función para añadir y agrupar los elementos del carrito **/
  addProCart(pro: IProducto, cant: number) {
    let encontrado: boolean = false;

    //Recorre el arreglo agrupado y modifica sus valores 
    this.myCart.forEach(e => {
      if (e.producto.id_producto == pro.id_producto) {
        e.cantidad = Number(e.cantidad) + Number(cant);
        e.total = Number(e.cantidad) * Number(pro.precio);
        encontrado = true;
      }
    });

    //Comprueba sí el objeto no se encuentra en el arreglo agrupado
    if (encontrado == false) {
      /* Comprobación cuando se reliza una búsqueda 
      y aparece una etiqueta con categoría */
      if (pro.hasOwnProperty("nombreCat")) {
        const { nombreCat, ...temp } = pro; //Quitamos la propiedad nombreCat
        this.myCart.push({ cantidad: cant, producto: temp, total: pro.precio * cant });  
      } else {
        this.myCart.push({ cantidad: cant, producto: pro, total: pro.precio * cant });
      }
    }

    this.serStorage.set('mycart', this.myCart); //cada que haya cambios se setea el valor en el Storage
  }

  /** Función para aumentar la cantidad un mismo producto **/
  aumentar(i: number) {
    this.myCart[i].cantidad = this.myCart[i].cantidad + 1;
    this.myCart[i].total = this.myCart[i].cantidad * this.myCart[i].producto.precio;
    this.serStorage.set('mycart', this.myCart); //cada que haya cambios se setea el valor en el Storage
  }

  /** Función para disminuir la cantidad un mismo producto **/
  disminuir(i: number) {
    if (this.myCart[i].cantidad > 1) {
      this.myCart[i].cantidad = this.myCart[i].cantidad - 1;
      this.myCart[i].total = this.myCart[i].cantidad * this.myCart[i].producto.precio;
      this.serStorage.set('mycart', this.myCart); //cada que haya cambios se setea el valor en el Storage
    }
  }

  /** Función para eliminar un producto del carrito **/
  eliminarProducto(item: any) {
    this.myCart = this.myCart.filter(std => std.producto.id_producto != item.producto.id_producto);
    this.serStorage.set('mycart', this.myCart); //cada que haya cambios se setea el valor en el Storage
  }

  /** Función Rest que crea un carrito en la BD**/
  crearCarrito(data: any){
    const URL = this.serUtil.URL_API + "carrito";
    return this.http.post<any>(URL, this.serUtil.objectToFormData(data));
  }
}
