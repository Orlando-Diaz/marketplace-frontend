import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  cargando = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    telefono: ['']
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.authService.registrar(this.form.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(this.extraerMensaje(err));
      }
    });
  }

  private extraerMensaje(err: any): string {
    // 409 (email duplicado) -> viene en "message"
    if (err.error?.message) {
      return err.error.message;
    }
    // 400 (validación de Bean Validation) -> viene en "errores" como { campo: mensaje }
    if (err.error?.errores) {
      return Object.values(err.error.errores).join('. ');
    }
    return 'No se pudo completar el registro';
  }
}