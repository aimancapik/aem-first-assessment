import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Component({ template: '' })
class DummyComponent {}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([{ path: '**', component: DummyComponent }])
      ],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should store token in localStorage', () => {
    const mockToken = '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test"';

    service.login({ username: 'user@aemenersol.com', password: 'Test@123' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/account/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockToken);

    expect(localStorage.getItem('token')).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test');
  });

  it('login should strip surrounding quotes from token', () => {
    service.login({ username: 'user@aemenersol.com', password: 'Test@123' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/account/login`);
    req.flush('"token-with-quotes"');

    expect(localStorage.getItem('token')).toBe('token-with-quotes');
  });

  it('logout should remove token and redirect', () => {
    localStorage.setItem('token', 'sometoken');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('isLoggedIn should return true when token exists', () => {
    localStorage.setItem('token', 'sometoken');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('isLoggedIn should return false when no token', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('getToken should return stored token', () => {
    localStorage.setItem('token', 'mytoken');
    expect(service.getToken()).toBe('mytoken');
  });
});
