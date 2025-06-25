import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss']
})
export class ModuloComponent {
  x = 0;
  y = 0;
  n = 0;
  result: number | null = null;
  error = '';

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    if (this.y >= this.x || this.n < this.y) {
      this.error = 'Condiciones inválidas: se requiere que 0 ≤ y < x y y ≤ n';
      this.result = null;
      return;
    }

    this.http.post<{ result: number }>('http://localhost:8080/api/modulo', {
      x: this.x,
      y: this.y,
      n: this.n
    }).subscribe({
      next: (res) => {
        this.result = res.result;
        this.error = '';
      },
      error: () => {
        this.error = 'Error al conectar con la API.';
        this.result = null;
      }
    });
  }
}
