import { OrderItem } from './order-item.model';
import { User } from './user.model';

export interface Order {
  id?: number;
  userId: string;
  user?: User;
  orderDate?: string;
  totalAmount?: number;
  status?: string;
  orderItems?: OrderItem[];
}
