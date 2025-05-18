import { Routes } from '@angular/router';
import {CatalogComponent} from './pages/catalog/catalog.component';
import {CartComponent} from './pages/cart/cart.component';
import {DetailComponent} from './pages/detail/detail.component';
import {AddressComponent} from './pages/profile/address/address.component';

export const routes: Routes = [
  {
    path: '',
    component: CatalogComponent
  },
  {
    path: 'home',
    component: CatalogComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'detail/:id',
    component: DetailComponent
  },
  {
    path: 'profile/address',
    component: AddressComponent
  }
];
