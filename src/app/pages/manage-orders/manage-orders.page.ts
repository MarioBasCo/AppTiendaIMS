import { OrderDetailComponent } from './../../modals/order-detail/order-detail.component';
import { ModalController } from '@ionic/angular';
import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.page.html',
  styleUrls: ['./manage-orders.page.scss'],
})
export class ManageOrdersPage implements OnInit {
  selectId: number;
  listaPedidos: any[] = [];
  mensaje: string = '';
  
  constructor(  
    private serPed: OrderService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  /** Función que consulta a la base de datos los pedidos **/
  cambiarConsulta(event){
    let id = parseInt(event.detail.value);
    this.cargarPedidos(id);
  }

  cargarPedidos(id: number){
    this.mensaje = '';
    this.listaPedidos = [];
    this.serPed.getPedidosPorEstado(id).subscribe(resp => {
      if(resp.status == true){
        this.listaPedidos = resp.data;
        console.log(this.listaPedidos);
      }else{
        if(id !=3 ){
          this.mensaje = "Felicidades no tienes pedidos " + this.verificarPedido(id);
        }
      }
    });
  }

  verificarPedido(id: number){
    if(id == 1){
      return 'pendientes por atender';
    } else if(id == 2){
      return 'pendientes por entregar'
    }
  }
  /** Función que abre el Modal con los detalles del Pedido **/
  async openModalDetail(item: any){
    const modal = await this.modalCtrl.create({
      component: OrderDetailComponent,
      componentProps: {
        idCodigo: item.idCarritoCompra,
        admin: true,
        objPedido: item
      },
      backdropDismiss: true,
      showBackdrop: true
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if(data){
      if(data.estado == 'pendiente'){
        this.cargarPedidos(1);       
      } else if (data.estado == 'atendido'){
        this.cargarPedidos(2);
      } else{
        this.cargarPedidos(3);
      }
    }
  }
}