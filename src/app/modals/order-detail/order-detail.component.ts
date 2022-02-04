import { UtilsService } from './../../services/utils.service';
import { OrderService } from './../../services/order.service';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  @Input() objPedido: any;
  @Input() admin: boolean;
  mensajeBtn: string = '';
  estadoPedido: string = '';
  codigoEstado: number;
  listProductos: any[] = [];
  precioenvio: number = 1;
  totalpro: number = 0;
  total: number = 0;

  constructor(
    private modalCtrl: ModalController,
    private serOrder: OrderService,
    private serUtil: UtilsService
  ) { }

  ngOnInit() {    
    this.comprobarOpcAdmin();
    this.totalpro = this.calcularTotalPro();
    this.total = this.precioenvio + this.totalpro;
  }

  comprobarOpcAdmin(){
    if(this.admin){
      this.estadoPedido = this.objPedido.estado_pedido.toLowerCase();
      if(this.estadoPedido == 'pendiente'){
        this.mensajeBtn = "Marcar Como Atendido";
        this.codigoEstado = 2;
      } else if (this.estadoPedido == 'atendido'){
        this.mensajeBtn = "Marcar como entregado";
        this.codigoEstado = 3;
      }
    } 
  }
  

  closeModal(){
    this.modalCtrl.dismiss();
  }

  calcularTotalPro(): number{
    return this.objPedido.detalle.map(d => Number(d.cantidad * d.precio)).reduce((a, b) => a + b);
  }

  cambiarEstadoCarrito(){
    this.serOrder.cambiarEstado(this.objPedido.codigo, {id_estado: this.codigoEstado}).subscribe(
      resp => {
        this.serUtil.showToast(resp.mensaje);
        this.modalCtrl.dismiss({
          cambio: true,
          estado: this.estadoPedido
        });
      }
    );
  }
}
