import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminFeedbackComponent } from './admin-feedback.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminFeedbackComponent', () => {
  let component: AdminFeedbackComponent;
  let fixture: ComponentFixture<AdminFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdminFeedbackComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_admin_feedback_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_all_user_feedback_heading_in_the_admin_feedback_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('All User Feedback');
  });
});
