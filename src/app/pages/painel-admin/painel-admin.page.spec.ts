import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PainelAdminPage } from './painel-admin.page';

describe('PainelAdminPage', () => {
  let component: PainelAdminPage;
  let fixture: ComponentFixture<PainelAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
