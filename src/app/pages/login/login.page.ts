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

  ionViewDidEnter(){
    let user = this.serStorage.get('user');
    if (user){
      this.router.navigateByUrl('/home');
    }
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
    console.log(this.nombre, this.clave);
    this.serLogin.login(this.nombre, this.clave).subscribe(
      resp => {
        if(resp.id == 0){
          this.serUtil.showToast(resp.mensaje, "danger");
        } else {
          let objUser = resp.info.data;
          delete objUser.usr_clave
          this.serStorage.set('user', objUser);
          this.limpiarForm();
          this.router.navigate(['/home']);
        }
      }
    );
  }

  limpiarForm(){
    this.nombre = '';
    this.clave = '';
  }
}
