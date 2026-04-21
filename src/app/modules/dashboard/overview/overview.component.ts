import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  donutData: ChartData<'doughnut'> = { labels: [], datasets: [{ data: [] }] };
  donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: '65%'
  };

  barData: ChartData<'bar'> = { labels: [], datasets: [{ data: [] }] };
  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { display: false }, grid: { display: false } },
      x: { ticks: { display: false }, grid: { display: false } }
    }
  };

  users: any[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        this.donutData = {
          labels: res.chartDonut.map(d => d.name),
          datasets: [{
            data: res.chartDonut.map(d => d.value),
            backgroundColor: ['#adb5bd', '#868e96', '#ced4da', '#6c757d', '#dee2e6'],
            borderWidth: 0
          }]
        };

        this.barData = {
          labels: res.chartBar.map(d => d.name),
          datasets: [{
            label: 'Value',
            data: res.chartBar.map(d => d.value),
            backgroundColor: '#adb5bd',
            borderRadius: 0
          }]
        };

        this.users = res.tableUsers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('dashboard error:', err);
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
