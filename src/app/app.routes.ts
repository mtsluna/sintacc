import { Routes } from '@angular/router';
import {CatalogComponent} from './pages/catalog/catalog.component';
import {CartComponent} from './pages/cart/cart.component';
import {DetailComponent} from './pages/detail/detail.component';
import {AddressComponent} from './pages/profile/address/address.component';
import {catalogResolver} from './pages/catalog/catalog.resolver';
import {detailResolver} from './pages/detail/detail.resolver';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {checkoutResolver} from './pages/checkout/checkout.resolver';
import {addressResolver} from './pages/profile/address/address.resolver';
import {selectedAddressResolver} from './shared/resolvers/selected-address.resolver';
import {AddressEditComponent} from './pages/profile/address/edit/address-edit.component';

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
    path: 'category/:categoryId',
    component: CatalogComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'detail/:id',
    component: DetailComponent,
    resolve: {
      detail: detailResolver
    }
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'profile/address',
    component: AddressComponent,
    resolve: {
      addresses: addressResolver
    }
  },
  {
    path: 'profile/address/add',
    component: AddressEditComponent
  }
];
