import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMenu } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private http: HttpClient) { }

  getMenu() {
    return this.http.get<IMenu[]>('../assets/data/menu.json');
  }
}
