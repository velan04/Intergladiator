import { Component, OnInit } from '@angular/core';
import { BrownieService } from '../../services/brownie.service';
import { Brownie } from '../../models/brownie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-brownie',
  templateUrl: './add-brownie.component.html',
  styleUrls: ['./add-brownie.component.css']
})
export class AddBrownieComponent implements OnInit {
  brownie: Brownie = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    stockCount: 0
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private brownieService: BrownieService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.brownie.name || this.brownie.name.trim().length < 3) {
      return;
    }
  
    if (!this.brownie.description || this.brownie.description.trim().length < 10) {
      return;
    }
  
    if (!this.brownie.price || this.brownie.price <= 0) {
      this.errorMessage = 'Price must be greater than 0.';
      return;
    }
  
    this.brownieService.addBrownie(this.brownie).subscribe(() => {
      this.successMessage = 'Brownie added successfully!';
    this.errorMessage = ''; // Clear error if any

    // Wait for 2 seconds, then navigate
    setTimeout(() => {
      this.router.navigate(['/admin/brownies']);
    }, 2000);
  }, (error) => {
    this.errorMessage = 'Failed to add brownie. Please try again.';
  });
  }
  

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Base64 Image String
        this.brownie.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
