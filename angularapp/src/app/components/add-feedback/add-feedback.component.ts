import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedbackService } from '../../services/feedback.service';
import { Feedback } from '../../models/feedback.model'; // adjust if needed

@Component({
  selector: 'app-add-feedback',
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.css']
})
export class AddFeedbackComponent implements OnInit {
  addFeedbackForm = this.formBuilder.group({
    userId: [{ value: '', disabled: true }, Validators.required],
    feedbackText: ['', Validators.required]
  });

  submitted = false;
  successPopup = false;

  constructor(private formBuilder: FormBuilder, private feedbackService: FeedbackService, private router: Router) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.addFeedbackForm.get('userId')?.setValue(userId);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addFeedbackForm.valid) {
      const feedback: Feedback = {
        userId: Number(this.addFeedbackForm.get('userId')?.value),
        feedbackText: this.addFeedbackForm.get('feedbackText')?.value,
        date: new Date().toISOString()
      };

      this.feedbackService.addFeedback(feedback).subscribe(
        () => {
          this.successPopup = true;
          this.addFeedbackForm.reset({ userId: this.addFeedbackForm.get('userId')?.value });
          this.submitted = false;
        },
        (error) => {
          console.error('Error submitting feedback:', error);
        }
      );
    }
  }

  handleSuccessMessage(): void {
    this.successPopup = false;
    this.submitted = false;
    this.router.navigate(['/user-feedback']);
  }
}
