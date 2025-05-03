import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-user-place-order',
  templateUrl: './user-place-order.component.html',
  styleUrls: ['./user-place-order.component.css']
})
export class UserPlaceOrderComponent {
  userId = localStorage.getItem('userId') || '';
  orderItems: any[] = [];
  totalAmount = 0;
  successMessage = '';

  constructor(private orderService: OrderService, private router: Router) {
    const storedItems = localStorage.getItem('orderItems');
    this.orderItems = storedItems ? JSON.parse(storedItems) : [];
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  increaseQuantity(index: number) {
    const item = this.orderItems[index];
    if (item.quantity < item.stockCount) {
      item.quantity++;
      this.calculateTotal();
      localStorage.setItem('orderItems', JSON.stringify(this.orderItems));
    }
  }

  decreaseQuantity(index: number) {
    if (this.orderItems[index].quantity > 1) {
      this.orderItems[index].quantity--;
      this.calculateTotal();
      localStorage.setItem('orderItems', JSON.stringify(this.orderItems));
    }
  }

  submitOrder() {
    const order: Order = {
      userId: this.userId,
      totalAmount: this.totalAmount,
      orderItems: this.orderItems.map(i => ({
        brownieId: i.brownieId,
        quantity: i.quantity
      }))
    };
  
    this.orderService.createOrder(order).subscribe(() => {
      this.successMessage = 'Order placed successfully!';
      localStorage.removeItem('orderItems');
  
      // Optional: Navigate after a short delay
      setTimeout(() => {
        this.router.navigate(['/orders']);
      }, 2000);
    });
  }

  cancelOrder() {
    localStorage.removeItem('orderItems');
    this.router.navigate(['/brownies']);
  }
  
  removeItem(index: number) {
    this.orderItems.splice(index, 1); // Remove the item from the array
    this.calculateTotal(); // Recalculate total
    localStorage.setItem('orderItems', JSON.stringify(this.orderItems)); // Update localStorage
  }
  

}
