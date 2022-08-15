import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient, private serUtil: UtilsService) { }

  getCategorias(){
    const URL = this.serUtil.URL_API + 'categorias';
    return this.http.get<any>(URL);
  }
}
