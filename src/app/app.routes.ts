import { Routes } from '@angular/router';
import {CatalogComponent} from './pages/catalog/catalog.component';
import {CartComponent} from './pages/cart/cart.component';
import {DetailComponent} from './pages/detail/detail.component';
import {AddressComponent} from './pages/profile/address/address.component';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {AddressEditComponent} from './pages/profile/address/edit/address-edit.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import {PrivacyPolicyComponent} from './pages/privacy-policy/privacy-policy.component';

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
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'profile/address',
    component: AddressComponent
  },
  {
    path: 'profile/address/add',
    component: AddressEditComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'admin/categories',
    component: CategoriesComponent
  }
];
