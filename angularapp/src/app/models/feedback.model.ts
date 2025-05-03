export interface Feedback {
  feedbackId?: number;
  userId: number;
  feedbackText: string;
  date: string; // ISO string format for DateTime
}
