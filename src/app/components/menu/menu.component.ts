import { LstorageService } from './../../services/lstorage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { MenuService } from './../../services/menu.service';
import { IMenu } from 'src/app/interfaces/interfaces';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  optionsMenu: IMenu[] = [];
  mostrarOpciones: boolean = false;
  user: any;

  constructor(
    private menuService: MenuService,
    private serLogin : LoginService,
    private serStorage : LstorageService,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.serLogin.$getObjectSource.subscribe(
      data => {
        this.user = data;
        if (this.user.id_perfil == 2){
          this.mostrarOpciones = true;
        } else {
          this.mostrarOpciones = false;
        }
        this.cargarMenu();
      }
    );
    let admin = this.serStorage.get('user');
    if(admin.id_perfil == 2){
      this.mostrarOpciones = true;
    } else {
      this.mostrarOpciones = false;
    }
    
  }


  cargarMenu() {
    this.menuService.getMenu().subscribe(
      resp => {
        this.optionsMenu = resp;
      }
    );
  }

  cerrarSesion() {
    this.alertCtrl.create({
      header: "Cerrar Sesión",
      message: "¿Esta Seguro de Cerrar Sesión?",
      buttons: [
        {
          text: "Sí",
          handler: () => {
            localStorage.clear();            
            location.href = '/login';
            this.router.dispose();
          }
        },
        { text: "No" }
      ]
    }).then(alertEl => alertEl.present());
  }

}
