import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { UtilsService } from './../../services/utils.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.page.html',
  styleUrls: ['./sign.page.scss'],
})
export class SignPage implements OnInit {
  showPassword: boolean = false;
  passwordToggleIcon: string = 'eye-off-outline';

  objUser = {
    id_perfil: 1,
    nombre: '',
    apellido: '',
    correo: '',
    clave: '',
    telefono: '',
    direccion: ''
  }

  constructor(private serUtil: UtilsService, private serLogin: LoginService, private router: Router) { }

  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.passwordToggleIcon === 'eye-off-outline') {
      this.passwordToggleIcon = 'eye-outline';
    } else {
      this.passwordToggleIcon = 'eye-off-outline';
    }
  }

  registrarse(){
    this.serLogin.registro(this.objUser).subscribe(
      resp => {
        if(resp.id == 0){
          this.serUtil.showToast(resp.mensaje, "danger");
        } else {
          this.serUtil.showToast(resp.mensaje);
          this.limpiarForm();
          this.router.navigate(['/login']);
        }
      }
    )   
  }

  limpiarForm(){
    this.objUser.id_perfil = 1;
    this.objUser.nombre = '';
    this.objUser.apellido = '';
    this.objUser.correo = '';
    this.objUser.clave = '';
    this.objUser.telefono = '';
    this.objUser.direccion = '';
  }
}
