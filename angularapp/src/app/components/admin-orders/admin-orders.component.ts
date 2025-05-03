import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  orders: Order[] = [];
  statuses = ['Pending', 'Shipped', 'Delivered'];
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private orderService: OrderService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: data => {
        this.orders = data;
        this.orders.forEach(order => {
          if (order.userId) {
            this.authService.getUserById(+order.userId).subscribe({
              next: user => order.user = user,
              error: err => console.error(`Failed to fetch user for order ${order.id}`, err)
            });
          }
        });
      },
      error: err => {
        this.message = 'Failed to load orders.';
        this.messageType = 'error';
        console.error(err);
      }
    });
  }

  updateStatus(order: Order, newStatus: string): void {
    const updatedOrder = { ...order, status: newStatus };
    this.orderService.updateOrder(updatedOrder.id, updatedOrder).subscribe({
      next: () => {
        order.status = newStatus;
        this.message = 'Order status updated successfully.';
        this.messageType = 'success';
      },
      error: () => {
        this.message = 'Failed to update order status.';
        this.messageType = 'error';
      }
    });
  }

}
