import { Observable } from 'rxjs';
import { LstorageService } from './../../services/lstorage.service';
import { FilterPage } from './../../modals/filter/filter.page';
import { ProductDetailPage } from '../../modals/product-detail/product-detail.page';
import { ProductService } from './../../services/product.service';
import { CartService } from './../../services/cart.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController, LoadingController } from '@ionic/angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  listPro: any;
  listCat: any[]=[];
  textBuscar: string = '';
  mostrar: boolean = false;
  typeSelected: number = 0; // Captura el código de la categoría
  url = environment.webService + 'imagenes';
  mensajePro: string = '';

  constructor(
    private serPro: ProductService,
    private serCart: CartService,
    private serStorage: LstorageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.cargarCategorias();
  }

  ionViewDidEnter(){
    //window.location.reload();
    let id = this.serStorage.get('id_cat');
    if(id) {
      this.desplazarScroll(id);
    }
  }


  /** Función que llama a las categorias **/
  cargarCategorias() {
    this.serPro.getCategorias().subscribe(
      data => {
        this.listCat = data.info.items;

        // Verificamos si existe una categoría seleccionada por el usuario
        let id = this.serStorage.get('id_cat');
        if(!id) {
          this.typeSelected = this.listCat[0].idCategoria;
          this.serStorage.set('id_cat', this.typeSelected);
        } else {
          this.typeSelected = this.serStorage.get('id_cat');
          this.desplazarScroll(id);
        }
        this.cargarProductosXCat(this.typeSelected);
      }
    );
  }

  /** Función que llama a los productos por categoría **/
  cargarProductosXCat(id_categoria: number) {
    this.mensajePro = '';
    this.serPro.getProductos(id_categoria).subscribe(
      data => {
        this.listPro = data.info.items;
        if(this.listPro.length == 0){
          this.mensajePro = "No hay productos disponibles para esta categoría";
        }
      }
    );
  }

  /** Función que calcula la cantidad de productos en el carrito **/
  numProducts() {
    return this.serCart.listCart.map(d => d.cantidad).reduce((a, b) => a + b, 0);
  }

  /** Función que detecta el cambio de un segmento **/
  segmentChanged(ev: any) {
    this.textBuscar = '';
    let valor = ev.detail.value;
    this.serStorage.set('id_cat', valor);

    this.desplazarScroll(valor);
    this.cargarProductosXCat(valor);

    this.openSearch(); //regresa al encabezado
  }

  /** Función que desplaza el scroll al segmento seleccionado **/
  desplazarScroll(value: number){
    document.getElementById("segment-" + value)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }
  /** Función que muestra la barra de búsqueda **/
  openSearch() {
    this.content.scrollToTop(500);
  }

  /* Función que detecta el cambio del valor del párametro de búsqueda **/
  cambiartext(event) {
    this.textBuscar = event.target.value;
    if (this.textBuscar == '') {
      this.mensajePro = '';
      this.mostrar = false;
      this.cargarProductosXCat(this.typeSelected);
    }
  }

  /** Función que busca en la base de datos según el párametro nombre**/
  async buscar() {
    this.mostrar = true;
    const loading = await this.loadingCtrl.create({
      message: 'Espere Por Favor...',
      duration: 1800
    });

    await loading.present();

    this.serPro.buscarPorNombre(this.textBuscar).subscribe(
      data => {
        loading.dismiss();
        if (data.total > 0) {
          this.listPro = data.info.items;
        } else {
          this.mensajePro = data.mensaje;
        }
      }
    );
  }

  /** Función que abre el modal del filtro de productos **/
  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterPage,
      cssClass: 'my-modal-class',
      backdropDismiss: true,
      showBackdrop: true
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) { //Ordena los elementos por el precio
      if (data.seleccion == 'offer') {

      } else if (data.seleccion == "ascending") {
        this.listPro = this.listPro.sort((a, b) => (a.precio < b.precio ? -1 : 1));
        console.log(this.listPro);
      } else if (data.seleccion == "descending") {
        this.listPro = this.listPro.sort((a, b) => (a.precio > b.precio ? -1 : 1));
      } else {
        return;
      }
    }
  }

  /** Función que agrega un producto al carrito que esta en la lista del servicio **/
  agregarProCarrito(item: any) {
    this.serCart.addProCart(item, 1);
  }

  /** Función que abre el detalle de un producto **/
  async openDetail(item: any) {
    const modal = await this.modalCtrl.create({
      component: ProductDetailPage,
      componentProps: {
        producto: item
      },
      cssClass: 'small-modal',
      backdropDismiss: true,
      showBackdrop: true
    });

    await modal.present();
  }

}