import { LstorageService } from './../../services/lstorage.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() titulo: string;
  retorno: string = '/home';
  
  constructor(private serStorage: LstorageService) { }

  ngOnInit() {
    let user = this.serStorage.get('user');
    if(user?.id_perfil == 1){
      this.retorno = '/home';
    } else if (user?.id_perfil == 2){
      this.retorno = '/manage-orders';
    }
    //console.log(this.retorno);
  }

}
