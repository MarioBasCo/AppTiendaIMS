import { LstorageService } from './../../services/lstorage.service';
import { UtilsService } from './../../services/utils.service';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  nombre: string = '';
  clave: string = '';
  showPassword: boolean = false;
  passwordToggleIcon: string = 'eye-off-outline';

  constructor(
    private router: Router, 
    private serLogin: LoginService,
    private serUtil: UtilsService,
    private serStorage: LstorageService
  ) { }

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

  ingresar(){
    if(this.nombre == '' || this.clave == ''){
      return;
    }
    
    const objCredenciales = {
      correo: this.nombre,
      clave: this.clave
    }
    
    this.serLogin.login(objCredenciales).subscribe(
      resp => {
        if(resp.id == 0){
          this.serUtil.showToast(resp.mensaje, "danger");
        } else {
          let objUser = resp.info.data;
          delete objUser.usr_clave
          this.serStorage.set('user', objUser);
          this.serLogin.enviarObject(objUser);
          this.limpiarForm();
          if( parseInt(objUser?.id_perfil) == 1){
            this.router.navigateByUrl('/home', { replaceUrl: true });
          } else if( parseInt(objUser?.id_perfil) == 2){
            this.router.navigateByUrl('/manage-orders', { replaceUrl: true });
          }
        }
      }
    );
  }

  limpiarForm(){
    this.nombre = '';
    this.clave = '';
  }
}
