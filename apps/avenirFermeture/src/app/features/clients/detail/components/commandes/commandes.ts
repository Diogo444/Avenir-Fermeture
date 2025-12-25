import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { CommandesService } from '../../../../../services/commandes.service';
import { Client } from '../../../../../models/clients.model';
import { Commande, StatutCommande, TypeAcompte } from '../../../../../models/commandes.model';

type OrderStatus = 'En cours' | 'Terminée' | 'Annulée';
type FilterStatus = 'Tous' | 'En cours' | 'Terminées' | 'Annulées';

interface OrderProductDetail {
  typeProduit: string;
  quantite: number;
  etatProduit: string;
  etatCouleur: string | null;
  note?: string | null;
  avenant: boolean;
}

interface OrderDetails {
  devisNumero: string;
  commandeInterne: string;
  dateSignature: string;
  montantHt: string;
  montantTtc: string;
  typeAcompte: string;
  permisDp: boolean;
  fournisseur: string;
  produits: OrderProductDetail[];
  avenantsCount: number;
  dateMetre: string;
  dateAvenant: string;
  dateLimitePose: string;
  dateLivraisonSouhaitee: string;
}

interface OrderNode {
  type: 'order';
  reference: string;
  status: OrderStatus;
  details: OrderDetails;
  children: OrderTreeNode[];
}

interface OrderDetailNode {
  type: 'detail';
  reference: string;
  status: OrderStatus;
  details: OrderDetails;
}

type OrderTreeNode = OrderNode | OrderDetailNode;

const STATUS_LABELS: Record<StatutCommande, OrderStatus> = {
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  ANNULEE: 'Annulée',
};

const ACOMPTE_LABELS: Record<TypeAcompte, string> = {
  SIGNATURE: 'Signature',
  METRE: 'Métré',
  LIVRAISON: 'Livraison',
  POSE: 'Pose',
};

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatTreeModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './commandes.html',
  styleUrl: './commandes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Commandes implements OnInit {
  @Input() client!: Client;
  private commandesService = inject(CommandesService);
  private cdr = inject(ChangeDetectorRef);
  private allOrders: OrderNode[] = [];
  private readonly currencyFormatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
  private readonly dateFormatter = new Intl.DateTimeFormat('fr-FR');

  searchTerm = '';
  selectedFilter: FilterStatus = 'Tous';
  dataSource: OrderNode[] = [];
  isLoading = true;

  childrenAccessor = (node: OrderTreeNode) => (node.type === 'order' ? node.children : []);
  hasChild = (_: number, node: OrderTreeNode) => node.type === 'order' && node.children.length > 0;

  ngOnInit(): void {
    this.loadCommandes();
  }

  onFilterChange(event: { value: FilterStatus }) {
    this.selectedFilter = event.value;
    this.applyFilters();
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.applyFilters();
  }

  get totalAvenants(): number {
    return this.allOrders.reduce((total, order) => total + order.details.avenantsCount, 0);
  }

  private loadCommandes() {
    if (!this.client?.id) {
      this.allOrders = [];
      this.isLoading = false;
      this.applyFilters();
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.commandesService
      .getCommandesByClientId(this.client.id)
      .pipe(
        catchError(() => {
          this.allOrders = [];
          return of<Commande[]>([]);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe(commandes => {
        this.allOrders = (commandes ?? []).map(commande => this.mapCommande(commande));
        this.applyFilters();
      });
  }

  private applyFilters() {
    this.dataSource = this.filterOrders();
  }

  private filterOrders(): OrderNode[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.allOrders.filter(order => {
      if (!this.matchesFilter(order)) {
        return false;
      }
      if (!term) {
        return true;
      }

      const produitsText = order.details.produits
        .map(produit => [produit.typeProduit, produit.note ?? '', produit.etatProduit].join(' '))
        .join(' ');

      const haystack = [
        order.reference,
        order.details.devisNumero,
        order.details.commandeInterne,
        order.details.fournisseur,
        order.details.typeAcompte,
        order.details.montantHt,
        order.details.montantTtc,
        order.details.dateSignature,
        produitsText,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }

  private matchesFilter(order: OrderNode): boolean {
    if (this.selectedFilter === 'Tous') {
      return true;
    }
    if (this.selectedFilter === 'Terminées') {
      return order.status === 'Terminée';
    }
    if (this.selectedFilter === 'Annulées') {
      return order.status === 'Annulée';
    }
    return order.status === this.selectedFilter;
  }

  private mapCommande(commande: Commande): OrderNode {
    const produits = (commande.commandesProduits ?? []).map(item => ({
      typeProduit: item.produit?.nom ?? 'Produit',
      quantite: item.quantite ?? 0,
      etatProduit: item.status?.name ?? 'Non défini',
      etatCouleur: item.status?.color ?? null,
      note: item.note ?? null,
      avenant: item.avenant ?? false,
    }));

    const details: OrderDetails = {
      devisNumero: commande.numero_devis ?? '-',
      commandeInterne: commande.numero_commande_interne ?? '-',
      dateSignature: this.formatDate(commande.date_signature),
      montantHt: this.formatCurrency(commande.montant_ht),
      montantTtc: this.formatCurrency(commande.montant_ttc),
      typeAcompte: ACOMPTE_LABELS[commande.type_acompte] ?? '-',
      permisDp: commande.permis_dp ?? false,
      fournisseur: commande.fournisseur?.nom ?? '-',
      produits,
      avenantsCount: produits.filter(produit => produit.avenant).length,
      dateMetre: this.formatDate(commande.date_metre),
      dateAvenant: this.formatDate(commande.date_avenant),
      dateLimitePose: this.formatDate(commande.date_limite_pose),
      dateLivraisonSouhaitee: this.formatDate(commande.date_livraison_souhaitee),
    };

    const orderNode: OrderNode = {
      type: 'order',
      reference: commande.reference_commande,
      status: STATUS_LABELS[commande.statut_commande] ?? 'En cours',
      details,
      children: [],
    };

    orderNode.children = [
      {
        type: 'detail',
        reference: orderNode.reference,
        status: orderNode.status,
        details,
      },
    ];

    return orderNode;
  }

  private formatCurrency(value?: number | null): string {
    if (value === null || typeof value === 'undefined') {
      return '-';
    }
    return this.currencyFormatter.format(Number(value));
  }

  private formatDate(value?: string | Date | null): string {
    if (!value) {
      return '-';
    }
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    return this.dateFormatter.format(date);
  }
}
