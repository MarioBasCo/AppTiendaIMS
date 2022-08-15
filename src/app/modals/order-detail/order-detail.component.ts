import { UtilsService } from './../../services/utils.service';
import { OrderService } from './../../services/order.service';
import { ModalController, Platform } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Filesystem, Directory } from '@capacitor/filesystem';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
    public datepipe: DatePipe,
    private modalCtrl: ModalController,
    private serOrder: OrderService,
    private serUtil: UtilsService,
    private plt: Platform,
    private fileOpener: FileOpener
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

  downloadPdf() {
    const { codigo } = this.objPedido;
    const { nombre, telefono } = this.objPedido.datos_cliente;
    const { referencia } = this.objPedido.direccion;
    const { detalle } = this.objPedido;
    const { fecha_compra } = this.objPedido;

    const productos = detalle.map(item => {
      let rObj = {};
      rObj['cantidad'] = item.cantidad;
      rObj['detalle'] = item.nombre_producto;
      rObj['precio'] = item.precio;
      rObj['total'] = item.cantidad * item.precio;
      return rObj;
    });

    const docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [ 40, 60, 40, 60 ],
      content: [
        { text: 'MINI TIENDA “ISABEL”', style: 'header', alignment: 'center', color: '#00ADB5' },
        { text: `Pedido # ${codigo}`, style: 'subheader', alignment: 'center' },
        { text: `Fecha de Impresión: ${this.datepipe.transform(new Date(), 'dd/MM/yyyy')}`, style: 'subheader', alignment: 'right' },
        { text: `Hora de Impresión: ${this.datepipe.transform(new Date(), 'h:mm:ss a')}\n\n`, style: 'subheader', alignment: 'right' },
        {
          text: [
            { text: 'Cliente:\t', bold: true, color: '#00ADB5', fontSize: 13 },
            { text: `${nombre}`, fontSize: 13 },'\n',
            { text: 'Teléfono:\t', bold: true, color: '#00ADB5', fontSize: 13 },
            { text: `${telefono == null ? 'no registrado' : telefono}`, fontSize: 13 },'\n',
            { text: 'Dirección:\t', bold: true, color: '#00ADB5', fontSize: 13 },
            { text: `${referencia}`, fontSize: 13 },'\n',
            { text: 'Fecha de Entrega:\t', bold: true, color: '#00ADB5', fontSize: 13 },
            { text: `${this.datepipe.transform(new Date(fecha_compra), 'dd/MM/yyyy')}`, fontSize: 13 },
            '\n\n'
          ]
        },
        this.table(productos)
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'justify'
        },
        subheader: {
          fontSize: 14
        },
      }
    }
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    if (this.plt.is('cordova')) {
      pdfDocGenerator.getBase64(async (data) => {
        try {
          let path = `Pedido_${this.objPedido.codigo}_${Date.now()}.pdf`;
          const result = await Filesystem.writeFile({
            path,
            data,
            directory: Directory.Documents
          });
          this.fileOpener.open(`${result.uri}`, 'application/pdf')
        } catch (error) {
          console.error(error);
        }
      });
    } else {
      pdfDocGenerator.download();
    }
  }

  buildTableBody(data) {
    let body = [];
    body.push([
      { text: 'CANTIDAD', alignment: 'center', bold: true, color: '#fff', fillColor: '#00ADB5' },
      { text: 'DETALLE', alignment: 'center', bold: true, color: '#fff', fillColor: '#00ADB5' },
      { text: 'PRECIO', alignment: 'center', bold: true, color: '#fff', fillColor: '#00ADB5' },
      { text: 'TOTAL', alignment: 'center', bold: true, color: '#fff', fillColor: '#00ADB5' },
    ]);

    data.forEach(element => {
      let obj = [
        {
          text: element.cantidad,
          alignment: 'right'
        },
        {
          text: element.detalle,
          alignment: 'left'
        },
        {
          text: `$ ${Number(element.precio).toFixed(2)}`,
          alignment: 'right'
        },
        {
          text: `$ ${Number(element.total).toFixed(2)}`,
          alignment: 'right'
        }
      ];
      body.push(obj);
    });

    let t = data.map(d => Number(d.total)).reduce((a, b)=> a + b);
    let total = [
      {text: 'TOTAL PRODUCTOS', alignment: 'right', bold: true, colSpan: 3, color: '#222831'}, {}, {}, 
      {text: `$ ${Number(t).toFixed(2)}`, alignment: 'right', bold: true, color: '#222831'}
    ];
    let envio = [
      {text: 'TARIFA DE ENVÍO', alignment: 'right', bold: true, colSpan: 3, color: '#222831'}, {}, {}, 
      {text: '$ 1.00', alignment: 'right', bold: true, color: '#222831'}
    ];
    let tot = t + 1;
    let totgen = [
      {text: 'TOTAL A CANCELAR', alignment: 'right', bold: true, colSpan: 3, color: '#222831'}, {}, {}, 
      {text: `$ ${Number(tot).toFixed(2)}`, alignment: 'right', bold: true, color: '#222831'}
    ];
    body.push(total);
    body.push(envio);
    body.push(totgen);

    return body;
  }

  table(data) {
    return {
      table: {
        widths: ['auto', 'auto', '*', '*'],
        headerRows: 1,
        body: this.buildTableBody(data)
      }
    };
  }
}
