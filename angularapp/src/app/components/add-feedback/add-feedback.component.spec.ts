import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddFeedbackComponent } from './add-feedback.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AddFeedbackComponent', () => {
  let component: AddFeedbackComponent;
  let fixture: ComponentFixture<AddFeedbackComponent>;
  let feedbackServiceSpy: jasmine.SpyObj<FeedbackService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const feedbackSpy = jasmine.createSpyObj('FeedbackService', ['addFeedback']);
    const navSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [AddFeedbackComponent],
      providers: [
        { provide: FeedbackService, useValue: feedbackSpy },
        { provide: Router, useValue: navSpy }
      ]
    }).compileComponents();

    feedbackServiceSpy = TestBed.inject(FeedbackService) as jasmine.SpyObj<FeedbackService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeedbackComponent);
    component = fixture.componentInstance;
    localStorage.setItem('userId', '1'); // mock user ID
    fixture.detectChanges();
  });

  fit('Frontend_should_create_add_feedback_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_add_feedback_heading_in_the_add_feedback_component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Add Feedback');
  });


});