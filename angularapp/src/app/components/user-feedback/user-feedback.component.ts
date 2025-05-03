import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { Feedback } from '../../models/feedback.model';

@Component({
  selector: 'app-user-feedback',
  templateUrl: './user-feedback.component.html',
  styleUrls: ['./user-feedback.component.css']
})
export class UserFeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];
  userId: number = Number(localStorage.getItem('userId'));
  selectedFeedbackId: number | null = null;
  showDeleteConfirm: boolean = false;

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.feedbackService.getUserFeedbacks(this.userId).subscribe(data => {
      this.feedbacks = data;
    });
  }

  openDeleteModal(id: number): void {
    this.selectedFeedbackId = id;
    this.showDeleteConfirm = true;
  }
  
  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.selectedFeedbackId = null;
  }
  
  confirmDelete(): void {
    if (this.selectedFeedbackId !== null) {
      this.feedbackService.deleteFeedback(this.selectedFeedbackId).subscribe(() => {
        this.feedbacks = this.feedbacks.filter(f => f.feedbackId !== this.selectedFeedbackId);
        this.showDeleteConfirm = false;
        this.selectedFeedbackId = null;
        this.loadFeedbacks();
      });
    }
  }

}
