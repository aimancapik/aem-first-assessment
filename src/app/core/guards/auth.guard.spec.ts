import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

@Component({ template: '' })
class DummyComponent {}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [RouterTestingModule.withRoutes([
        { path: 'auth/login', component: DummyComponent },
        { path: '**', component: DummyComponent }
      ])],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when logged in', () => {
    authService.isLoggedIn.and.returnValue(true);
    expect(guard.canActivate()).toBeTrue();
  });

  it('should block access and redirect when not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });
});
