import { OrderService } from './../../services/order.service';
import { LstorageService } from './../../services/lstorage.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  objCliente = {
    id: 1,
    nombre: '',
    correo: '',
    direccion: '',
    telefono: '',
    compras: 0,
    total: 0
  }


  constructor(
    private serStorage: LstorageService,
    private serPedidos: OrderService,
    private loading: LoadingController) { }

  ngOnInit() {
    this.cargarDatosUser();
  }

  cargarDatosUser() {
    let user = this.serStorage.get('user');
    if(user){ //existen datos del usuario
      this.objCliente.nombre = user.nombre + " " + user.apellido;
      this.objCliente.correo = user.usr_correo;
      this.objCliente.telefono = user.telefono;
      this.objCliente.direccion = user.direccion;
      this.serPedidos.getCompras(user.id_usuario).subscribe(
        resp => {
          if(resp.status == true){
            this.objCliente.compras = resp.data[0].compras;
            this.objCliente.total = resp.data[0].total;
          }
        }
      );
    }
  }

  ionViewWllEnter(){
  }

  async cargarCategorias(){
    let l=await this.loading.create();
    l.present();
    /* this.servC.getCategorias().subscribe(resp=>{
      l.dismiss();
      this.categorias=resp.info.data;
      console.log(this.categorias);
    }, (error:any)=>{
      l.dismiss();
    }); */
  }

  openEdit(){
    console.log("ok se esta editando la info");
  }
}
