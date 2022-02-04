import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private objectSource = new BehaviorSubject<{}>({});
  $getObjectSource = this.objectSource.asObservable();

  constructor(
    private serUtil: UtilsService,
    private http: HttpClient
  ) { }

  login(data: any) {
    const URL = this.serUtil.URL_API + "login";
    return this.http.post<any>(URL, this.serUtil.objectToFormData(data));
  }

  enviarObject(data:any){
    this.objectSource.next(data);
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
