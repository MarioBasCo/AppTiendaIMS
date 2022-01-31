import { UtilsService } from './utils.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(private http: HttpClient, private serUtil: UtilsService) { }

  calificacionUser(id: number) {
    let URL = this.serUtil.URL_API + "valoracion/" + id;
    return this.http.get<any>(URL);
  }

  calificar(data: any) {
    let URL = this.serUtil.URL_API + "valoracion";
    return this.http.post<any>(URL, this.serUtil.objectToFormData(data));
  }
}
