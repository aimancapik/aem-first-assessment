import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService, DashboardResponse } from './dashboard.service';
import { environment } from '../../../environments/environment';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getDashboard should call correct endpoint with GET', () => {
    const mockResponse: DashboardResponse = {
      success: true,
      chartDonut: [{ name: 'A', value: 10 }],
      chartBar: [{ name: 'B', value: 20 }],
      tableUsers: [{ firstName: 'John', lastName: 'Doe', username: 'john_doe' }]
    };

    service.getDashboard().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/dashboard`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getDashboard should return chartDonut array', () => {
    const mockResponse: DashboardResponse = {
      success: true,
      chartDonut: [{ name: 'Donut 1', value: 25 }, { name: 'Donut 2', value: 75 }],
      chartBar: [],
      tableUsers: []
    };

    service.getDashboard().subscribe(res => {
      expect(res.chartDonut.length).toBe(2);
      expect(res.chartDonut[0].name).toBe('Donut 1');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/dashboard`);
    req.flush(mockResponse);
  });

  it('getDashboard should return tableUsers array', () => {
    const mockResponse: DashboardResponse = {
      success: true,
      chartDonut: [],
      chartBar: [],
      tableUsers: [{ firstName: 'John', lastName: 'Doe', username: 'john_doe' }]
    };

    service.getDashboard().subscribe(res => {
      expect(res.tableUsers[0].username).toBe('john_doe');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/dashboard`);
    req.flush(mockResponse);
  });
});
