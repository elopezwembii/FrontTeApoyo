import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoDonaMayoresGastosComponent } from './grafico-dona-mayores-gastos.component';

describe('GraficoDonaMayoresGastosComponent', () => {
  let component: GraficoDonaMayoresGastosComponent;
  let fixture: ComponentFixture<GraficoDonaMayoresGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoDonaMayoresGastosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoDonaMayoresGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
