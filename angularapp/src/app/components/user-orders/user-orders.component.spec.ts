import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserOrdersComponent } from './user-orders.component';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UserOrdersComponent', () => {
  let component: UserOrdersComponent;
  let fixture: ComponentFixture<UserOrdersComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['getOrdersByUser']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserOrdersComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // To ignore custom components like app-delete-confirm
    }).compileComponents();

    mockOrderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrdersComponent);
    component = fixture.componentInstance;

    // Set mock user ID and mock order response
    mockAuthService.getUserId.and.returnValue('user123');
  });

  fit('should create the component', () => {
    expect(component).toBeTruthy();
  });

  fit('should display "No orders found" when there are no orders', () => {
    mockOrderService.getOrdersByUser.and.returnValue(of([])); // Mock empty order list

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check for the "No orders found" message
    expect(compiled.querySelector('.no-orders')?.textContent).toContain('No orders found.');
  });
  
});
