import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrownieEditComponent } from './brownie-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrownieService } from '../../services/brownie.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Brownie } from '../../models/brownie.model';

describe('BrownieEditComponent', () => {
  let component: BrownieEditComponent;
  let fixture: ComponentFixture<BrownieEditComponent>;
  let mockBrownieService: jasmine.SpyObj<BrownieService>;

  beforeEach(async () => {
    const brownieServiceSpy = jasmine.createSpyObj('BrownieService', ['getBrownieById', 'updateBrownie']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [BrownieEditComponent],
      providers: [
        { provide: BrownieService, useValue: brownieServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123'
              }
            }
          }
        }
      ]
    }).compileComponents();

    mockBrownieService = TestBed.inject(BrownieService) as jasmine.SpyObj<BrownieService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrownieEditComponent);
    component = fixture.componentInstance;

    // Provide mock brownie
    const mockBrownie: Brownie = {
      id: 123,
      name: 'Classic Brownie',
      description: 'Rich chocolate brownie with fudge center.',
      price: 150,
      imageUrl: 'http://example.com/brownie.jpg',
      stockCount: 1
    };
    mockBrownieService.getBrownieById.and.returnValue(of(mockBrownie));

    fixture.detectChanges(); // triggers ngOnInit
  });

  fit('Frontend_should_create_brownie_edit_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_display_edit_brownie_heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Edit Brownie');
  });
});
