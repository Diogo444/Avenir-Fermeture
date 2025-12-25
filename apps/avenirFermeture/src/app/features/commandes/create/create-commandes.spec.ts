import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCommandes } from './create-commandes';
import { Api } from '../../../services/api/api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('CreateCommandes', () => {
  let component: CreateCommandes;
  let fixture: ComponentFixture<CreateCommandes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCommandes],
      providers: [
        {
          provide: Api,
          useValue: {
            getProduits: jest.fn(() => of([])),
            getFournisseurs: jest.fn(() => of([])),
            GetStatus: jest.fn(() => of([])),
            getClientByCode: jest.fn(() => of({ id: 1 })),
            createCommande: jest.fn(() => of({})),
          },
        },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCommandes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
