import { OrderService } from './../../services/order.service';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  @Input() idCodigo: number;
  listProductos: any[] = [];
  precioEnvio: number = 1;
  totalPro: number = 0;
  total: number = 0;

  constructor(
    private modalCtrl: ModalController,
    private serOrder: OrderService
  ) { }

  ngOnInit() {    
    this.serOrder.getDetallePedido(this.idCodigo).subscribe(
      resp => {
        this.listProductos = resp.data;
        this.totalPro = this.calcularTotalGeneral();
        this.total = this.totalPro + this.precioEnvio;
      }
    );
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  calcularTotalGeneral(): number{
    return this.listProductos.map(d => Number(d.total)).reduce((a, b) => a + b);
  }
}
