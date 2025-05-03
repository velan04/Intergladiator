// brownie.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brownie } from '../models/brownie.model';
import { apiUrl } from 'src/apiconfig';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BrownieService {
  private baseUrl = `${apiUrl}/brownie`; // Your backend URL

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getBrownies(): Observable<Brownie[]> {
    return this.http.get<Brownie[]>(this.baseUrl);
  }

  getBrownieById(id: number): Observable<Brownie> {
    return this.http.get<Brownie>(`${this.baseUrl}/${id}`);
  }

  addBrownie(brownie: Brownie): Observable<Brownie> {
    return this.http.post<Brownie>(this.baseUrl, brownie, this.authService.getHeaders());
  }

  updateBrownie(id: number, brownie: Brownie): Observable<Brownie> {
    return this.http.put<Brownie>(`${this.baseUrl}/${id}`, brownie, this.authService.getHeaders());
  }

  deleteBrownie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.authService.getHeaders());
  }
}
