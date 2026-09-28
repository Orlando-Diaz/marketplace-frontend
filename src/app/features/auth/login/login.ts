import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cargando = signal(false);
  error = signal<string | null>(null);
  mostrarPassword = signal(false);

  readonly cuentasDemo = [
    { etiqueta: '🛍️ Comprador / vendedor', email: 'demo@marketplace.com', password: 'demo1234' },
    { etiqueta: '⚙️ Administrador', email: 'admin@marketplace.com', password: 'admin1234' },
  ];

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/productos';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.message ?? 'Email o contraseña incorrectos');
      },
    });
  }

  entrarComoDemo(cuenta: { email: string; password: string }): void {
    this.form.setValue({ email: cuenta.email, password: cuenta.password });
    this.enviar();
  }
}