import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloComponent } from './modulo.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('ModuloComponent', () => {
  let component: ModuloComponent;
  let fixture: ComponentFixture<ModuloComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuloComponent],
      imports: [FormsModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar error si y >= x', () => {
    component.x = 5;
    component.y = 5;
    component.n = 10;
    component.onSubmit();
    expect(component.error).toContain('Condiciones inválidas');
    expect(component.result).toBeNull();
  });

  it('debe mostrar error si n < y', () => {
    component.x = 7;
    component.y = 6;
    component.n = 5;
    component.onSubmit();
    expect(component.error).toContain('Condiciones inválidas');
    expect(component.result).toBeNull();
  });

  it('debe obtener resultado válido desde la API', () => {
    component.x = 7;
    component.y = 5;
    component.n = 12345;
    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:8080/api/modulo');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ x: 7, y: 5, n: 12345 });

    req.flush({ result: 12339 });

    expect(component.result).toBe(12339);
    expect(component.error).toBe('');
  });

  it('debe manejar error de red', () => {
    component.x = 7;
    component.y = 2;
    component.n = 50;
    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:8080/api/modulo');
    req.error(new ErrorEvent('Error de red'));

    expect(component.error).toContain('Error al conectar con la API');
    expect(component.result).toBeNull();
  });
});