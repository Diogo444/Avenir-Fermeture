import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCommandes } from './create-commandes';
import { ProduitsService } from '../../../services/produits.service';
import { ReferentielsService } from '../../../services/referentiels.service';
import { ClientsService } from '../../../services/clients.service';
import { CommandesService } from '../../../services/commandes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('CreateCommandes', () => {
  let component: CreateCommandes;
  let fixture: ComponentFixture<CreateCommandes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCommandes],
      providers: [
        {
          provide: ProduitsService,
          useValue: { getProduits: jest.fn(() => of([])) },
        },
        {
          provide: ReferentielsService,
          useValue: {
            getFournisseurs: jest.fn(() => of([])),
            getStatus: jest.fn(() => of([])),
          },
        },
        {
          provide: ClientsService,
          useValue: { getClientByCode: jest.fn(() => of({ id: 1 })) },
        },
        {
          provide: CommandesService,
          useValue: {
            createCommande: jest.fn(() => of({})),
            getCommandeById: jest.fn(() => of(null)),
            updateCommande: jest.fn(() => of({})),
          },
        },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
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
