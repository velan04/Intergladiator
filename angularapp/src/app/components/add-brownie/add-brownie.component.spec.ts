import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddBrownieComponent } from './add-brownie.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrownieService } from '../../services/brownie.service';
import { Router } from '@angular/router';

describe('AddBrownieComponent', () => {
  let component: AddBrownieComponent;
  let fixture: ComponentFixture<AddBrownieComponent>;
  let brownieServiceSpy: jasmine.SpyObj<BrownieService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const brownieSpy = jasmine.createSpyObj('BrownieService', ['addBrownie']);
    const routeSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [AddBrownieComponent],
      providers: [
        { provide: BrownieService, useValue: brownieSpy },
        { provide: Router, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBrownieComponent);
    component = fixture.componentInstance;
    brownieServiceSpy = TestBed.inject(BrownieService) as jasmine.SpyObj<BrownieService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_addbrownie_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_add_new_brownie_heading_in_the_addbrownie_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Add New Brownie');
  });
});
