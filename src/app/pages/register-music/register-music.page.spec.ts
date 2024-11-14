import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterMusicPage } from './register-music.page';

describe('RegisterMusicPage', () => {
  let component: RegisterMusicPage;
  let fixture: ComponentFixture<RegisterMusicPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMusicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
