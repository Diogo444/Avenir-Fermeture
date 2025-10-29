import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Facture } from './facture';

describe('Facture', () => {
  let component: Facture;
  let fixture: ComponentFixture<Facture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Facture],
    }).compileComponents();

    fixture = TestBed.createComponent(Facture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
