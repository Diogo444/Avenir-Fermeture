import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjoutProduit } from './ajoutProduit';

describe('AjoutProduit', () => {
  let component: AjoutProduit;
  let fixture: ComponentFixture<AjoutProduit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutProduit],
    }).compileComponents();

    fixture = TestBed.createComponent(AjoutProduit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
