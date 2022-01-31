import { UtilsService } from './../../services/utils.service';
import { AssessmentService } from './../../services/assessment.service';
import { LstorageService } from './../../services/lstorage.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.page.html',
  styleUrls: ['./assessment.page.scss'],
})
export class AssessmentPage implements OnInit {
  form: FormGroup;
  objUser = {
    idUsr: 0,
    nombre: '',
  }

  constructor(
    private fb: FormBuilder,
    private serCal: AssessmentService,
    private serUtil: UtilsService,
    private serStorage: LstorageService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    let user = this.serStorage.get('user');
    if (user) {
      this.objUser.idUsr = user.id_usuario;
      this.objUser.nombre = user.nombre;
    }
    this.verificarCalificacion();
  }

  /** Función que construye el formulario **/
  buildForm(){
    this.form = this.fb.group({
      start: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  /** Verifica sí el usuario he realizado una calificaión **/
  verificarCalificacion() {
    this.serCal.calificacionUser(this.objUser.idUsr).subscribe(
      resp => {
        if (resp.status > 0) {
          const cal = resp.info.data[0];
      
          this.form.get('start').patchValue(cal.puntos);
          this.form.get('message').patchValue(cal.comentario);

          for (let i = 5; i > 0; i--) {
            const ele = document.getElementById("radio" + i) as HTMLInputElement;
            ele.checked = true;
            if (ele.value == this.startField) {
              break;
            }
          }
        }
      }
    );
  }

  /** Método Getter que obtiene el valor de las estrellas **/
  get startField() {
    return this.form.get('start').value;
  }

  /** Método Getter que obtiene el valor del comentario **/
  get messageField() {
    return this.form.get('message').value;
  }

  /** Guarda o actualiza la calificación del Usuario **/
  save() {
    const obj = {
      id_usr: this.objUser.idUsr,
      puntos: this.startField,
      comentario: this.messageField,
      estado: 'A'
    }
    
    this.serCal.calificar(obj).subscribe(
      resp => {
        this.serUtil.showToast(resp.mensaje);
      }
    )
  }
}
