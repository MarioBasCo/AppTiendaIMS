import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categorias: any []=[];

  constructor(private serCat: ProductService) { }

  ngOnInit() {
    this.serCat.getCategorias().subscribe(
      resp => {
        this.categorias = resp.info.items;
      }
    );
  }

  editar(item: any){

  }

  eliminar(item: any){

  }

}
