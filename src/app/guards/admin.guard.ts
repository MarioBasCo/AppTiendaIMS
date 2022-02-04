import { LstorageService } from './../services/lstorage.service';
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {
  constructor (
    private serStorage: LstorageService,
    private router: Router
  ) { }
  
  canLoad(): boolean {
    let user = this.serStorage.get('user');
    const { id_perfil } = user;
    if(id_perfil == 2){
      return true;
    } else{
      this.router.navigateByUrl('/home');
      return false;
    }
  }
}
