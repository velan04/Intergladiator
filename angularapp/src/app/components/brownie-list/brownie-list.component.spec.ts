import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrownieListComponent } from './brownie-list.component'; // Update to BrownieListComponent
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BrownieListComponent', () => {
  let component: BrownieListComponent;
  let fixture: ComponentFixture<BrownieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [BrownieListComponent], // Update to BrownieListComponent
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // To ignore custom components like app-delete-confirm
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrownieListComponent); // Update to BrownieListComponent
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_brownie_list_component', () => { // Update test name
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_manage_brownies_heading_in_the_brownie_list_component', () => { // Update test name
    const compiled = fixture.debugElement.nativeElement.outerHTML;
    expect(compiled).toContain('Manage Brownies');
  });
});
