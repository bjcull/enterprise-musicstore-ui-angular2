import { Component } from '@angular/core';
import { HomeComponent } from './home';
import { Routes, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';
import * as md from './angular-material/index';
import { GenresComponent } from './genres';
import { LoginComponent } from './login';
import { CartComponent } from './cart';
import { CheckoutComponent } from './checkout';
import { OrdersComponent } from './orders';

import {GenreService} from './services/genre/genre.service';
import {Genre, User} from './models';

import { AlbumComponent } from './album';
import { AlbumService } from './services/album/album.service';
import { CartService } from './services/cart/cart.service';
import { OrderService } from './services/order/order.service';
import { CheckoutService } from './services/checkout/checkout.service'

@Component({
  moduleId: module.id,
  selector: 'music-store-app',
  templateUrl: 'music-store.component.html',
  styleUrls: ['music-store.component.css'],
  directives: [
    ROUTER_DIRECTIVES,
    md.MD_SIDENAV_DIRECTIVES,
    md.MD_LIST_DIRECTIVES,
    md.MdToolbar,
    md.MdButton,
    md.MdIcon,
    md.MdListItem,
    md.MdList
  ],
  providers: [ROUTER_PROVIDERS, md.MdIconRegistry, md.MdRadioDispatcher, AlbumService, CartService, GenreService, OrderService, CheckoutService],

})
@Routes([
  { path: '/', component: HomeComponent },
  { path: '/album/:id', component: AlbumComponent },
  {path: '/genres/...', component: GenresComponent},
  {path: '/login', component: LoginComponent},
  {path: '/cart', component: CartComponent},
  {path: '/checkout', component: CheckoutComponent},
  {path: '/orders', component: OrdersComponent},
  {path: '/genres', component: GenresComponent}
])
export class MusicStoreAppComponent {

  title = 'SSW Angular 2 Music Store';
  routes = Routes;
  genres: Genre[] = [];
  user: User;

  constructor(private genreService: GenreService, public router: Router) {
    this.setUser();
    toastr.options.positionClass = 'toast-bottom-right';
  }

  setUser() {
    let savedUser = JSON.parse(localStorage.getItem('profile'));
    if (savedUser) {
      this.user = savedUser;
    };
  }

  goToGenre(genre: Genre) {
    this.router.navigate([`/genres/${genre.name}`]);
  }
}
