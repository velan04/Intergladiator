import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrownieService } from '../../services/brownie.service';
import { Brownie } from '../../models/brownie.model';

@Component({
  selector: 'app-edit-brownie',
  templateUrl: './brownie-edit.component.html',
  styleUrls: ['./brownie-edit.component.css']
})
export class BrownieEditComponent implements OnInit {
  brownieId!: number;
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

  constructor(
    private brownieService: BrownieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.brownieId = +this.route.snapshot.paramMap.get('id')!;
    this.loadBrownie();
  }

  loadBrownie(): void {
    this.brownieService.getBrownieById(this.brownieId).subscribe({
      next: (data) => {
        this.brownie = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load brownie data.';
      }
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.brownie.name || this.brownie.name.trim().length < 3) {
      this.errorMessage = 'Name must be at least 3 characters long.';
      return;
    }

    if (!this.brownie.description || this.brownie.description.trim().length < 10) {
      this.errorMessage = 'Description must be at least 10 characters long.';
      return;
    }

    if (!this.brownie.price || this.brownie.price <= 0) {
      this.errorMessage = 'Price must be greater than 0.';
      return;
    }

    this.brownieService.updateBrownie(this.brownieId, this.brownie).subscribe({
      next: () => {
        this.successMessage = 'Brownie updated successfully!';
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/admin/brownies']);
        }, 2000);
      },
      error: () => {
        this.errorMessage = 'Failed to update brownie. Please try again.';
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.brownie.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/brownies']);
  }
}
