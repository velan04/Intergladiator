import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBrownieListComponent } from './user-brownie-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrownieService } from '../../services/brownie.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';  // Ensure you import `of` for observable

describe('UserBrownieListComponent', () => {
  let component: UserBrownieListComponent;
  let fixture: ComponentFixture<UserBrownieListComponent>;
  let brownieService: jasmine.SpyObj<BrownieService>;

  beforeEach(async () => {
    const brownieServiceSpy = jasmine.createSpyObj('BrownieService', ['getBrownies']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [UserBrownieListComponent],
      providers: [{ provide: BrownieService, useValue: brownieServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // To ignore custom components like app-delete-confirm
    }).compileComponents();

    brownieService = TestBed.inject(BrownieService) as jasmine.SpyObj<BrownieService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBrownieListComponent);
    component = fixture.componentInstance;

    // Mock getBrownies() to return an observable with mock data
    const mockBrownies = [
      { id: 1, name: 'Chocolate Brownie', price: 100, stockCount: 10, description: 'Delicious chocolate brownie', imageUrl: '' },
      { id: 2, name: 'Vanilla Brownie', price: 150, stockCount: 5, description: 'Yummy vanilla brownie', imageUrl: '' }
    ];
    brownieService.getBrownies.and.returnValue(of(mockBrownies));

    fixture.detectChanges();  // Detect changes after setting up mocks
  });

  fit('Frontend_should_create_user_brownie_list_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_our_brownies_heading_in_the_user_brownie_list_component', () => {
    const compiled = fixture.debugElement.nativeElement.outerHTML;
    expect(compiled).toContain('Our Brownies');
  });
});
