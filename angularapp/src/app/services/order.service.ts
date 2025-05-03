// services/order.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { Observable } from 'rxjs';
import { apiUrl } from 'src/apiconfig';
import { AuthService } from './auth.service'; // import AuthService

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${apiUrl}/order`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order, this.authService.getHeaders());
  }

  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`, this.authService.getHeaders());
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`, this.authService.getHeaders());
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl, this.authService.getHeaders());
  }

  updateOrder(id: number, order: Order): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, order, this.authService.getHeaders());
  }
  
  
}
