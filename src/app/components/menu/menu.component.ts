import { Router } from '@angular/router';
import { MenuService } from './../../services/menu.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IMenu } from 'src/app/interfaces/interfaces';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  optionsMenu: Observable<IMenu[]>

  constructor(
    private menuService: MenuService, 
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarMenu();
  }

  cargarMenu() {
    this.optionsMenu = this.menuService.getMenu();
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
            this.router.navigate(['/login']);
            window.location.reload(); //forzamos la recarga para evitar problemas de cache
          }
        },
        { text: "No" }
      ]
    }).then(alertEl => alertEl.present());
  }

}
