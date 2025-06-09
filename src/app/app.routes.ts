import { Routes } from '@angular/router';
import {CatalogComponent} from './pages/catalog/catalog.component';
import {CartComponent} from './pages/cart/cart.component';
import {DetailComponent} from './pages/detail/detail.component';
import {AddressComponent} from './pages/profile/address/address.component';
import {catalogResolver} from './pages/catalog/catalog.resolver';

export const routes: Routes = [
  {
    path: '',
    component: CatalogComponent,
    resolve: {
      catalog: catalogResolver
    }
  },
  {
    path: 'home',
    component: CatalogComponent
  },
  {
    path: 'category/:categoryId',
    component: CatalogComponent,
    resolve: {
      catalog: catalogResolver
    }
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
