import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
  listOptions: any [] = [
    { nombre: "Precios Ascendentes", detalle: "ascending" },
    { nombre: "Precios Descendentes", detalle: "descending" },
    /* { nombre: "Ofertas", detalle: "offer" } */
  ];
  valorSeleccionado: string = "";

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  salirConDatos() {
    this.modalCtrl.dismiss({
      seleccion: this.valorSeleccionado
    });
  }
}
