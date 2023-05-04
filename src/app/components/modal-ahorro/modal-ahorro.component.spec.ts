import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAhorroComponent } from './modal-ahorro.component';

describe('ModalAhorroComponent', () => {
  let component: ModalAhorroComponent;
  let fixture: ComponentFixture<ModalAhorroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAhorroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAhorroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
