import { TestBed } from '@angular/core/testing';
import { BrownieService } from './brownie.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('BrownieService', () => {
  let service: BrownieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(BrownieService);
  });

  fit('Frontend_should_create_brownie_service', () => {
    expect(service).toBeTruthy();
  });
});
