import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { ErrorComponent } from './components/error/error.component';
import { BrownieListComponent } from './components/brownie-list/brownie-list.component';
import { AddBrownieComponent } from './components/add-brownie/add-brownie.component';
import { BrownieEditComponent } from './components/brownie-edit/brownie-edit.component';
import { UserBrownieListComponent } from './components/user-brownie-list/user-brownie-list.component';
import { UserPlaceOrderComponent } from './components/user-place-order/user-place-order.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { UserFeedbackComponent } from './components/user-feedback/user-feedback.component';
import { AddFeedbackComponent } from './components/add-feedback/add-feedback.component';
import { AdminFeedbackComponent } from './components/admin-feedback/admin-feedback.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    RegisterComponent,
    NavbarComponent,
    AdminnavComponent,
    UsernavComponent,
    BrownieListComponent,
    AddBrownieComponent,
    BrownieEditComponent,
    UserBrownieListComponent,
    UserPlaceOrderComponent,
    UserOrdersComponent,
    AdminOrdersComponent,
    UserFeedbackComponent,
    AddFeedbackComponent,
    AdminFeedbackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
