import { OrderDetailComponent } from './../../modals/order-detail/order-detail.component';
import { ModalController } from '@ionic/angular';
import { LstorageService } from './../../services/lstorage.service';
import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  selectId: string = 'pendiente';
  listaPedidos: any[] = [];
  pedidos: any[] = [];
  mensaje: string;
  
  constructor(  
    private serPed: OrderService,
    private modalCtrl: ModalController,
    private serStorage: LstorageService
  ) { }

  ngOnInit() {
    this.listarPedidos();
  }

  /** Función que consulta a la base de datos los pedidos **/
  listarPedidos() {
    let usr = this.serStorage.get('user');
    if(usr){
      this.serPed.getPedidos(usr.id_usuario).subscribe(
        resp => {
          this.pedidos = [];
          if (resp.status == false) {
            this.mensaje = resp.mensaje;
          } else {
            this.listaPedidos = resp.data;
            this.pedidos = this.setFilterPed(this.listaPedidos);
          } 
      });
    }
  }

  /** Función que detecta cambios en el segmento **/
  onChange(event) {
    this.selectId = event.target.value;
    document.getElementById(this.selectId).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
    this.pedidos = this.setFilterPed(this.listaPedidos);

    if(this.pedidos.length == 0){
      this.mensaje = "No tienes pedidos "+this.selectId+"s";   
    }
  }

  /** Función para recargar las listas de los pedidos **/
  doRefresh(event) {
    this.listaPedidos = [];
    setTimeout(() => {
      this.listarPedidos();
      event.target.complete();
    }, 500);
  }

  /** Función que clasifica los pedidos según su estado **/
  setFilterPed(data : any) {
    let pedidos = [];
    if (this.selectId == 'pendiente') {
      pedidos = data.filter((item) => { return item.estado_pedido.toLowerCase() == 'pendiente' });
    } else if (this.selectId == 'atendido'){
      pedidos = data.filter((item) => { return item.estado_pedido.toLowerCase() == 'atendido' });
    } else {
      pedidos = data.filter((item) => { return item.estado_pedido.toLowerCase() == 'entregado' });
    }
    return pedidos;
  }

  /** Función que abre el Modal con los detalles del Pedido **/
  async openModalDetail(item: any){
    const modal = await this.modalCtrl.create({
      component: OrderDetailComponent,
      componentProps: {
        idCodigo: item.codigo
      },
      backdropDismiss: true,
      showBackdrop: true
    });

    await modal.present();
  }
}