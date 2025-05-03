import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPlaceOrderComponent } from './user-place-order.component';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserPlaceOrderComponent', () => {
  let component: UserPlaceOrderComponent;
  let fixture: ComponentFixture<UserPlaceOrderComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['createOrder']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserPlaceOrderComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    mockOrderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPlaceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should_create_the_component', () => {
    expect(component).toBeTruthy();
  });

});
