import { Component, OnInit } from '@angular/core';
import { BrownieService } from '../../services/brownie.service';
import { Brownie } from '../../models/brownie.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-brownie-list',
  templateUrl: './user-brownie-list.component.html',
  styleUrls: ['./user-brownie-list.component.css']
})
export class UserBrownieListComponent implements OnInit {
  brownies: Brownie[] = [];
  searchTerm: string = '';
  sortOption: string = 'name';
  loading: boolean = true;

  constructor(
    private brownieService: BrownieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.brownieService.getBrownies().subscribe(data => {
      // Show only available brownies
      this.brownies = data;
      this.loading = false;
    });
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

  addToOrder(brownie: Brownie) {
    const storedItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
  
    const existing = storedItems.find((item: any) => item.brownieId === brownie.id);
  
    if (existing) {
      if (existing.quantity < brownie.stockCount) {
        existing.quantity++;
      } else {
        alert('Maximum stock limit reached!');
        return;
      }
    } else {
      storedItems.push({
        brownieId: brownie.id,
        name: brownie.name,
        quantity: 1,
        price: brownie.price,
        stockCount: brownie.stockCount
      });
    }
  
    localStorage.setItem('orderItems', JSON.stringify(storedItems));
    this.router.navigate(['/place-order']);
  }
  
}
