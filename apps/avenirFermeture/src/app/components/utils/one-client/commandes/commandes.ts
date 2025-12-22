import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';

type OrderStatus = 'En cours' | 'Terminée' | 'Annulée';
type ProductState = 'En cours' | 'Terminé';
type FilterStatus = 'Tous' | 'En cours' | 'Terminées' | 'Annulées';

interface OrderDetails {
  devisNumero: string;
  commandeInterne: string;
  dateSignature: string;
  montantHt: string;
  montantTtc: string;
  typeAcompte: 'Signature' | 'Métré' | 'Livraison' | 'Pose';
  permisDp: boolean;
  fournisseur: string;
  typeProduit: string;
  quantite: number;
  etatProduit: ProductState;
  note?: string;
  avenant: boolean;
  avenantsCount: number;
  dpAvenant: boolean;
  dateMetre: string;
  dateAvenant?: string;
  dateLimitePose: string;
  dateLivraisonSouhaitee: string;
}

interface OrderBase {
  reference: string;
  status: OrderStatus;
  details: OrderDetails;
}

interface OrderNode extends OrderBase {
  type: 'order';
  children: OrderTreeNode[];
}

interface OrderDetailNode extends OrderBase {
  type: 'detail';
}

type OrderTreeNode = OrderNode | OrderDetailNode;

const ORDER_DATA: OrderNode[] = [
  createOrderNode({
    reference: 'CMD-2025-001',
    status: 'En cours',
    details: {
      devisNumero: 'DEV-2025-087',
      commandeInterne: 'INT-34-2025',
      dateSignature: '12/01/2025',
      montantHt: '1 200,00 €',
      montantTtc: '1 440,00 €',
      typeAcompte: 'Signature',
      permisDp: false,
      fournisseur: 'ALM Menuiserie',
      typeProduit: 'Fenêtres PVC',
      quantite: 6,
      etatProduit: 'En cours',
      note: 'Dépose prévue semaine 06',
      avenant: false,
      avenantsCount: 0,
      dpAvenant: false,
      dateMetre: '05/01/2025',
      dateLimitePose: '20/02/2025',
      dateLivraisonSouhaitee: '18/02/2025',
    },
  }),
  createOrderNode({
    reference: 'CMD-2025-004',
    status: 'Terminée',
    details: {
      devisNumero: 'DEV-2024-221',
      commandeInterne: 'INT-12-2024',
      dateSignature: '20/10/2024',
      montantHt: '2 430,00 €',
      montantTtc: '2 916,00 €',
      typeAcompte: 'Livraison',
      permisDp: true,
      fournisseur: 'Atelier Nord',
      typeProduit: 'Volets roulants',
      quantite: 10,
      etatProduit: 'Terminé',
      note: 'Pose validée par le client',
      avenant: true,
      avenantsCount: 2,
      dpAvenant: true,
      dateMetre: '28/09/2024',
      dateAvenant: '15/11/2024',
      dateLimitePose: '05/12/2024',
      dateLivraisonSouhaitee: '30/11/2024',
    },
  }),
  createOrderNode({
    reference: 'CMD-2025-007',
    status: 'Annulée',
    details: {
      devisNumero: 'DEV-2025-102',
      commandeInterne: 'INT-58-2025',
      dateSignature: '08/02/2025',
      montantHt: '850,00 €',
      montantTtc: '1 020,00 €',
      typeAcompte: 'Pose',
      permisDp: false,
      fournisseur: 'Concept Fermeture',
      typeProduit: 'Porte d’entrée',
      quantite: 1,
      etatProduit: 'En cours',
      note: 'Commande arrêtée à la demande du client',
      avenant: false,
      avenantsCount: 0,
      dpAvenant: false,
      dateMetre: '06/02/2025',
      dateLimitePose: '28/02/2025',
      dateLivraisonSouhaitee: '25/02/2025',
    },
  }),
];

function createOrderNode(order: OrderBase): OrderNode {
  return {
    ...order,
    type: 'order',
    children: [
      {
        ...order,
        type: 'detail',
      },
    ],
  };
}

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [
    FormsModule,
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
export class Commandes {
  searchTerm = '';
  selectedFilter: FilterStatus = 'Tous';

  private readonly orders = ORDER_DATA;
  dataSource: OrderNode[] = this.orders;

  childrenAccessor = (node: OrderTreeNode) => (node.type === 'order' ? node.children : []);
  hasChild = (_: number, node: OrderTreeNode) => node.type === 'order' && node.children.length > 0;

  onFilterChange(event: { value: FilterStatus }) {
    this.selectedFilter = event.value;
    this.applyFilters();
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.applyFilters();
  }

  get totalAvenants(): number {
    return this.orders.reduce((total, order) => total + order.details.avenantsCount, 0);
  }

  private applyFilters() {
    this.dataSource = this.filterOrders();
  }

  private filterOrders(): OrderNode[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.orders.filter(order => {
      if (!this.matchesFilter(order)) {
        return false;
      }
      if (!term) {
        return true;
      }
      const haystack = [
        order.reference,
        order.details.devisNumero,
        order.details.commandeInterne,
        order.details.fournisseur,
        order.details.typeProduit,
        order.details.montantHt,
        order.details.montantTtc,
        order.details.dateSignature,
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
}
