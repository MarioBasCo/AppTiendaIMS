import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private serUtil: UtilsService,
    private http: HttpClient
  ) { }

  login(p_usuario: string, p_clave: string) {
    const URL = this.serUtil.URL_API + "login";
    return this.http.post<any>(URL, this.serUtil.objectToFormData({
      correo: p_usuario,
      clave: p_clave
    }));
  }

  registro(data: any){
    const URL = this.serUtil.URL_API + "singup";
    return this.http.post<any>(URL, this.serUtil.objectToFormData(data));
  }

  getMenuOpts() {
    const URL = this.serUtil.URL_API + "menu";
    let p_perfil: number = parseInt(localStorage.getItem('usr_perfil'));
    console.log(p_perfil);
    // return this.http.get<ComponenteMenu[]>('/assets/Data/menu.json');
    return this.http.post<any[]>(URL, this.serUtil.objectToFormData({
      perfil: p_perfil
    }));
  }
}
