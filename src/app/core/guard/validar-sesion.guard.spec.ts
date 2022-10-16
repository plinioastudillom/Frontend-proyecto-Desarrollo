import { TestBed } from '@angular/core/testing';

import { ValidarSesionGuard } from './validar-sesion.guard';

describe('ValidarSesionGuard', () => {
  let guard: ValidarSesionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ValidarSesionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
