import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { Component, inject, Injectable, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, Observable, merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DataSource } from '@angular/cdk/collections';

class DynamicFlatNode {
  constructor(
    public item: string,
    public level = 1,
    public expandable = false,
    public isLoading = signal(false),
  ) {}
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({providedIn: 'root'})
export class DynamicDatabase {
  dataMap = new Map<string, string[]>([
    ['En cours', [
      'CMD-2025-001 — Fenêtres PVC — 1 200,00 €',
      'CMD-2025-004 — Porte d’entrée — 850,00 €',
    ]],
    ['Terminées', [
      'CMD-2024-132 — Volets roulants — 2 430,00 €',
    ]],
    ['Annulées', []],
  ]);

  rootLevelNodes: string[] = ['En cours', 'Terminées', 'Annulées'];


  /** Initial data from database */
  initialData(): DynamicFlatNode[] {
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  }

  getChildren(node: string): string[] | undefined {
    return this.dataMap.get(node);
  }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */

export class DynamicDataSource implements DataSource<DynamicFlatNode> {
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);
  private _expansionSubscription?: Subscription;

  get data(): DynamicFlatNode[] {
    return this.dataChange.value;
  }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _database: DynamicDatabase,
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._expansionSubscription = this._treeControl.expansionModel.changed.subscribe(change => {
      if (
        (change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void {
    if (this._expansionSubscription) {
      this._expansionSubscription.unsubscribe();
      this._expansionSubscription = undefined;
    }
  }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    const children = this._database.getChildren(node.item);
    const index = this.data.indexOf(node);
    if (!children || index < 0) {
      // If no children, or cannot find the node, no op
      return;
    }

    node.isLoading.set(true);

    setTimeout(() => {
      if (expand) {
        const nodes = children.map(
          name => new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name)),
        );
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (
          let i = index + 1;
          i < this.data.length && this.data[i].level > node.level;
          i++, count++
        );
        this.data.splice(index + 1, count);
      }

      // notify the change
      this.dataChange.next(this.data);
      node.isLoading.set(false);
    }, 1000);
  }
}

/**
 * @title Tree with dynamic data
 */


@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatTreeModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './commandes.html',
  styleUrl: './commandes.css',
})
export class Commandes {
  // UI state (search + filters)
  searchTerm = '';
  selectedFilter: 'Tous' | 'En cours' | 'Terminées' | 'Annulées' = 'Tous';

  // Services + data
  private database = inject(DynamicDatabase);

  constructor() {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, this.database);
    this.dataSource.data = this.database.initialData();
  }

  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  // Actions (UI only for now)
  onFilterSelect(filter: 'Tous' | 'En cours' | 'Terminées' | 'Annulées') {
    this.selectedFilter = filter;
    // NOTE: Filtering the data source will be added later when backend is ready.
  }

  // Helpers
  getGroupCount(group: string): number {
    const children = this.database.getChildren(group) || [];
    return children.length;
  }
}
