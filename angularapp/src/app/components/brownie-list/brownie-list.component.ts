import { Component, OnInit } from '@angular/core';
import { BrownieService } from '../../services/brownie.service';
import { Brownie } from '../../models/brownie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brownie-list',
  templateUrl: './brownie-list.component.html',
  styleUrls: ['./brownie-list.component.css']
})
export class BrownieListComponent implements OnInit {
  brownies: Brownie[] = [];
  selectedBrownieId: number | null = null;
  showModal: boolean = false;
  searchTerm: string = '';
  sortOption: string = 'name';

  constructor(private brownieService: BrownieService, private router: Router) {}

  ngOnInit() {
    this.loadBrownies();
  }

  loadBrownies() {
    this.brownieService.getBrownies().subscribe(data => {
      this.brownies = data;
    });
  }

  promptDelete(id: number) {
    this.selectedBrownieId = id;
    this.showModal = true;
  }

  cancelDelete() {
    this.showModal = false;
    this.selectedBrownieId = null;
  }

  confirmDelete() {
    if (this.selectedBrownieId !== null) {
      this.brownieService.deleteBrownie(this.selectedBrownieId).subscribe(() => {
        this.loadBrownies();
        this.cancelDelete();
      });
    }
  }

  editBrownie(id: number) {
    this.router.navigate(['/admin/edit/brownie', id]);
  }

  get filteredAndSortedBrownies(): Brownie[] {
    let filtered = this.brownies.filter(b => 
      b.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  
    switch (this.sortOption) {
      case 'priceLowHigh':
        return filtered.sort((a, b) => a.price - b.price);
      case 'priceHighLow':
        return filtered.sort((a, b) => b.price - a.price);
      case 'stockLowHigh':
        return filtered.sort((a, b) => a.stockCount - b.stockCount);
      case 'stockHighLow':
        return filtered.sort((a, b) => b.stockCount - a.stockCount);
      default:
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

}