import { CartService } from './../../services/cart.service';
import { LstorageService } from './../../services/lstorage.service';
import { Router } from '@angular/router';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-order-verification',
  templateUrl: './order-verification.component.html',
  styleUrls: ['./order-verification.component.scss'],
})
export class OrderVerificationComponent implements OnInit {
  form: FormGroup;
  cart: any[] = [];
  productos: any[] = [];
  id_usuario: number = 0;
  precioEnvio: number = 1;
  values = [{ value: 1, label: 'Contado' }, { value: 2, label: 'Crédito' }]
  fechaMin: string = '';
  modifyDate: any;
  currentDate: any;

  //Objeto carrito con valores por defecto
  objCart = {
    id_usr: 0,
    idPago: 0,
    fecha_compra: '',
    direccion: '',
    longitud: 0,
    latitud: 0,
    total_carrito: 0,
    id_estado: 1,
    detalle: ''
  }

  constructor(
    private fb: FormBuilder,
    private serStorage: LstorageService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private serCart: CartService,
    private router: Router,
  ) {
    this.fechaMin = this.fechaSiguiente();
    this.buildForm();
  }

  ngOnInit() {
    this.cart = this.serStorage.get('mycart');
    this.id_usuario = this.serStorage.get('user').id_usuario;

    //Comprobamos que existan instancias y adjuntamos los valores al objeto
    if (this.cart && this.id_usuario != 0) {
      this.objCart.id_usr = this.id_usuario;
      this.objCart.total_carrito = this.cart.map(d => d.total).reduce((a, b) => a + b) + this.precioEnvio;

      //Separamos del array principal los datos del producto (id y cantidad);
      this.productos = this.cart.map((obj) => {
        const rObj = {};
        rObj['id_producto'] = obj.producto.id_producto;
        rObj['cantidad'] = obj.cantidad;
        return rObj;
      });
      this.objCart.detalle = JSON.stringify(this.productos);
    }
  }

  /** Función que inicializa el formulario **/
  buildForm() {
    this.form = this.fb.group({
      pago: ['', Validators.required],
      fecha: [this.fechaMin, Validators.required],
      referencia: ['', Validators.required]
    });
  }

  /* Función que detecta cambios en la fecha y los setea al campo fecha de formulario **/
  checkVal(event: any) {
    let fechaSeleccionada = event.detail.value.slice(0, 10).replace('T', ' ');
    this.form.get('fecha').patchValue(fechaSeleccionada);
  }

  /** Función que suma un día a la fecha actual y la devuelve en string**/
  fechaSiguiente() {
    let fechaSig = new Date();
    let diaActual = fechaSig.getDate();
    fechaSig.setDate(diaActual + 1);

    return new Date(fechaSig).toISOString().slice(0, 10).replace('T', ' ');
  }

  /** Función que cierra la ventana modal **/
  closeModal() {
    this.modalCtrl.dismiss();
  }

  get pagoField() {
    return this.form.get('pago').value;
  }

  get fechaField() {
    return this.form.get('fecha').value;
  }

  get referenciaField() {
    return this.form.get('referencia').value;
  }

  async confirmar() {
    //Capturamos la posición actual del usuario
    const position = await Geolocation.getCurrentPosition();

    //Seteamos el resto de campos del objeto carrito
    this.objCart.latitud = position.coords.latitude;
    this.objCart.longitud = position.coords.longitude;
    this.objCart.fecha_compra = this.fechaField;
    this.objCart.idPago = this.pagoField;
    this.objCart.direccion = this.referenciaField;

    let l = await this.loadingCtrl.create();
    l.present();
    this.serCart.crearCarrito(this.objCart).subscribe(
      resp => {
        if (resp.status == true) {
          l.dismiss();
          this.showAlertConfirm();
        } else {
          l.dismiss();
        }
      }
    );
  }

  showAlertConfirm() {
    this.alertCtrl.create({
      header: "Envio exitoso",
      message: "Su pedido fue enviado con exito. Para ver el estado de su pedido puede ir a Menu > Mis Pedidos.",
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.modalCtrl.dismiss();
            this.router.navigateByUrl('/home');
            //Limpiamos las referencias al carrito
            this.serStorage.remove('mycart');
            this.serCart.cargarProductos();
          }
        }
      ]
    }).then(alertEl => alertEl.present());
  }
}
