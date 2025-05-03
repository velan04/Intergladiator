import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFeedbackComponent } from './user-feedback.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FeedbackService } from 'src/app/services/feedback.service';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserFeedbackComponent', () => {
  let component: UserFeedbackComponent;
  let fixture: ComponentFixture<UserFeedbackComponent>;
  let mockFeedbackService: jasmine.SpyObj<FeedbackService>;

  beforeEach(async () => {
    const feedbackServiceSpy = jasmine.createSpyObj('FeedbackService', ['getUserFeedbacks']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [UserFeedbackComponent],
      providers: [{ provide: FeedbackService, useValue: feedbackServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFeedbackComponent);
    component = fixture.componentInstance;
    mockFeedbackService = TestBed.inject(FeedbackService) as jasmine.SpyObj<FeedbackService>;
  });

  fit('Frontend_should_create_userfeedback_component', () => {
    mockFeedbackService.getUserFeedbacks.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_your_feedback_heading_in_the_userfeedback_component', () => {
    mockFeedbackService.getUserFeedbacks.and.returnValue(of([]));
    fixture.detectChanges();
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('My Feedback');
  });
});
