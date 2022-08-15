import { UtilsService } from './../../services/utils.service';
import { ProductService } from './../../services/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  form: FormGroup;
  categorias: any[] = [];
  uploadResponse;

  constructor(
    private formBuilder: FormBuilder,
    private serPro: ProductService,
    private serUtil: UtilsService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.cargarCategorias();
  }

  cargarCategorias(){
    this.serPro.getCategorias().subscribe(
      resp => {
        this.categorias = resp.info.items;
      }
    );
  }

  buildForm() {
    this.form = this.formBuilder.group({
      idCategoria: ['', [Validators.required]],
      cantidad: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      nombre_producto: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      foto_producto: ['', [Validators.required]]
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('foto_producto').setValue(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('idCategoria', this.form.get('idCategoria').value);
    formData.append('cantidad', this.form.get('cantidad').value);
    formData.append('descripcion', this.form.get('descripcion').value);
    formData.append('nombre_producto', this.form.get('nombre_producto').value);
    formData.append('precio', this.form.get('precio').value);
    formData.append('avatar', this.form.get('foto_producto').value);

    this.serPro.addProducto(formData).subscribe(
      resp => {
        console.log(resp);
        if (resp.status == true) {
          this.serUtil.showToast(resp.mensaje);
          this.resetMyForm();
        } else {
          this.serUtil.showToast(resp.mensaje, 'danger');
        }
      }
    );
  }

  resetMyForm(): void {
    this.buildForm(); //se reconstruye el formulario
    this.form.reset(this.form.value);
  }
}
