import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);

  cargando = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => this.cargando.set(false),
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.message ?? 'Email o contraseña incorrectos');
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}