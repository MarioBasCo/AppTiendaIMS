import { LstorageService } from './../services/lstorage.service';
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor (
    private serStorage: LstorageService,
    private router: Router
  ) { }

  canLoad(): boolean {
    let user = this.serStorage.get('user');
    if (user){
      if(user.id_perfil == 1){
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        this.router.navigateByUrl('/manage-orders', { replaceUrl: true });
      }
      return false;
    } else {
      return true;
    }
  }
}
