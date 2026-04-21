import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ChartItem { name: string; value: number; }
export interface UserItem { firstName: string; lastName: string; username: string; }

export interface DashboardResponse {
  success: boolean;
  chartDonut: ChartItem[];
  chartBar: ChartItem[];
  tableUsers: UserItem[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get<DashboardResponse>(`${environment.apiUrl}/dashboard`);
  }
}
