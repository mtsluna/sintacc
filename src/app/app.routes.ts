import { Routes } from '@angular/router';
import {CatalogComponent} from './pages/catalog/catalog.component';
import {CartComponent} from './pages/cart/cart.component';
import {DetailComponent} from './pages/detail/detail.component';
import {AddressComponent} from './pages/profile/address/address.component';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {AddressEditComponent} from './pages/profile/address/edit/address-edit.component';
import {PrivacyPolicyComponent} from './pages/privacy-policy/privacy-policy.component';
import {ConfirmationComponent} from './pages/confirmation/confirmation.component';
import {OrdersComponent} from './pages/profile/orders/orders.component';
import { CategoryListComponent } from './shared/components/category-list/category-list.component';
import { AdminProductsComponent } from './pages/admin/products/admin-products.component';
import { AdminCategoriesComponent } from './pages/admin/categories/admin-categories.component';

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
    path: 'admin/products',
    component: AdminProductsComponent
  },
  {
    path: 'admin/categories',
    component: AdminCategoriesComponent
  },
  {
    path: 'confirmation',
    component: ConfirmationComponent
  },
  {
    path: 'profile/orders',
    component: OrdersComponent
  },
  {
    path: 'categories',
    component: CategoryListComponent
  }
];
