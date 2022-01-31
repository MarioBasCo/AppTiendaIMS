import { OrderVerificationComponent } from './../../modals/order-verification/order-verification.component';
import { IPedido } from './../../interfaces/interfaces';
import { environment } from './../../../environments/environment.prod';
import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  listaCarrito: IPedido[] = [];
  url = environment.webService + 'imagenes';
  totalProductos: number = 0;
  envio: number = 1;
  totalPago: number = 0;
  botonValid: boolean = false;

  constructor(
    private serCart: CartService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController) {
  }

  validarEnvio() {
    if (Object.entries(this.listaCarrito).length === 0) {
      this.botonValid = true;
    } else {
      this.botonValid = false;
    }
  }

  ngOnInit() {
    this.listaCarrito = this.serCart.listCart; //mantine actualizada la referencia a la lista
    this.validarEnvio();
    this.calcularTotales();
  }

  /** Función para aumentar la cantidad de un producto del carrito **/
  up(i: number) { 
    this.serCart.aumentar(i);
    this.calcularTotales();
  }

  /** Función para disminuir la cantidad de un producto del carrito **/
  down(i: number) {
    this.serCart.disminuir(i);
    this.calcularTotales();
  }

  /** Función para eliminar un producto del carrito **/
  eliminar(item: IPedido) {
    this.alertCtrl.create({
      header: '!Confirmar Eliminación¡',
      message: `¿Esta seguro de <strong>eliminar</strong> el producto: ${item.producto.nombre_producto} de su pedido?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.serCart.eliminarProducto(item);
            this.listaCarrito = this.serCart.listCart; //Actualiza la referencia a la lista
            this.validarEnvio();
            this.calcularTotales();
          }
        }
      ]
    }).then(alertEl => alertEl.present());
  }

  /** Función que calcula los valores a pagar **/
  calcularTotales() {
    this.totalProductos = this.listaCarrito.map(d => d.total).reduce((a, b) => a + b, 0);
    this.totalPago = this.envio + this.totalProductos;
  }

  /** Función para la confirmación del pedido **/
  async openDetail() {
    let item = null;
    const modal = await this.modalCtrl.create({
      component: OrderVerificationComponent,
      componentProps: {
        producto: item,
      },
      cssClass: 'modal-pedido',
      backdropDismiss: true,
      showBackdrop: true
    });

    await modal.present();
  }

}
