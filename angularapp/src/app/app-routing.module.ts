// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './components/authguard/auth.guard';
import { ErrorComponent } from './components/error/error.component';
import { BrownieListComponent } from './components/brownie-list/brownie-list.component';
import { AddBrownieComponent } from './components/add-brownie/add-brownie.component';
import { BrownieEditComponent } from './components/brownie-edit/brownie-edit.component';
import { UserBrownieListComponent } from './components/user-brownie-list/user-brownie-list.component';
import { UserPlaceOrderComponent } from './components/user-place-order/user-place-order.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { UserFeedbackComponent } from './components/user-feedback/user-feedback.component';
import { AdminFeedbackComponent } from './components/admin-feedback/admin-feedback.component';
import { AddFeedbackComponent } from './components/add-feedback/add-feedback.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'error', component: ErrorComponent },
  { path: '', component: HomeComponent },
  { path: 'admin/brownies', component: BrownieListComponent },
  { path: 'admin/edit/brownie/:id', component: BrownieEditComponent },
  { path: 'admin/add/brownie', component: AddBrownieComponent },
  { path: 'brownies', component: UserBrownieListComponent },
  { path: 'place-order', component: UserPlaceOrderComponent },
  { path: 'orders', component: UserOrdersComponent },
  {path: 'admin/orders', component: AdminOrdersComponent },
  { path: 'feedbacks', component: UserFeedbackComponent, canActivate: [AuthGuard] },
  { path: 'admin-feedback', component: AdminFeedbackComponent, canActivate: [AuthGuard] },
  { path: 'add-feedback', component: AddFeedbackComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/error' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] // ✅ This is important
})
export class AppRoutingModule { }
