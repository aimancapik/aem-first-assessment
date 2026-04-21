import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(5)]]
  });

  loading = false;
  errorMsg = '';

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  get showUsernameRequired() {
    return this.username?.errors?.['required'] && this.username?.touched;
  }

  get showUsernameMinlength() {
    return this.username?.errors?.['minlength'] && this.username?.touched;
  }

  get showPasswordRequired() {
    return this.password?.errors?.['required'] && this.password?.touched;
  }

  get showPasswordMinlength() {
    return this.password?.errors?.['minlength'] && this.password?.touched;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMsg = this.getErrorMsg(err);
        this.loading = false;
      }
    });
  }

  private getErrorMsg(err: any): string {
    const errors = err.error;
    if (errors && typeof errors === 'object' && Object.keys(errors).length) {
      const firstKey = Object.keys(errors)[0];
      return errors[firstKey]?.[0] || 'Something went wrong';
    }
    if (typeof errors === 'string' && errors.trim()) return errors;
    if (err.status === 401) return 'Invalid username or password';
    return 'Something went wrong';
  }
}
