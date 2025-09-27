import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Commercial } from './commercial';

describe('Commercial', () => {
  let component: Commercial;
  let fixture: ComponentFixture<Commercial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commercial],
    }).compileComponents();

    fixture = TestBed.createComponent(Commercial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
