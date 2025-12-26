/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ClientsService } from '../../../services/clients.service';
import { ReferentielsService } from '../../../services/referentiels.service';
import { CommonModule } from '@angular/common';
import { ClientListItem } from '../../../models/clients.model';
import { Router } from '@angular/router';
import { NgxIntlTelInputWrapperModule } from '../../../shared/ngx-intl-tel-input-wrapper.module';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { getTitre } from '../../../models/titres.model';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  takeUntil,
} from 'rxjs/operators';
import { PhoneFormatPipe } from '../../../shared/utils/pipes/phone-format.pipe';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatListModule,
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    NgxIntlTelInputWrapperModule,
    MatProgressSpinnerModule,
    PhoneFormatPipe,
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit, OnDestroy {
  client: ClientListItem[] = [];
  displayedColumns: string[] = [
    'title',
    'lastName',
    'firstName',
    'email',
    'phone',
    'city',
    'action',
  ];

  isLoading = true;
  isLoadingMore = false;
  message: string | null = null;
  hasMore = true;
  pageSize = 10;

  // Filters state
  searchCtrl = new FormControl<string>('');
  titleCtrl = new FormControl<string>('');
  hasEmail = false;
  hasPhone = false;
  titles: getTitre[] = [];

  private readonly clientsService = inject(ClientsService);
  private readonly referentielsService = inject(ReferentielsService);
  private readonly router = inject(Router);
  private readonly hasEmail$ = new BehaviorSubject<boolean>(false);
  private readonly hasPhone$ = new BehaviorSubject<boolean>(false);
  private readonly destroy$ = new Subject<void>();
  private observer?: IntersectionObserver;
  private activeRequestId = 0;
  private currentPage = 1;
  private pendingLoad = false;
  private currentFilters: {
    q?: string;
    title?: string;
    hasEmail?: boolean;
    hasPhone?: boolean;
    sort?: 'createdAt' | 'updatedAt' | 'lastName' | 'firstName';
    order?: 'ASC' | 'DESC';
    include?: 'summary' | 'detail';
  } = {
    sort: 'createdAt',
    order: 'DESC',
    include: 'summary',
  };

  @ViewChild('loadMoreAnchor')
  set loadMoreAnchor(value: ElementRef<HTMLElement> | undefined) {
    if (!value) {
      this.observer?.disconnect();
      return;
    }
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.onLoadMoreAnchor();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );
    this.observer.observe(value.nativeElement);
  }

  ngOnInit(): void {
    // Load filter options
    this.referentielsService.getTitres().subscribe({
      next: (titles) => (this.titles = titles),
      error: () => {},
    });

    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value ?? ''),
      debounceTime(250),
      distinctUntilChanged()
    );
    const title$ = this.titleCtrl.valueChanges.pipe(
      startWith(this.titleCtrl.value ?? ''),
      distinctUntilChanged()
    );

    combineLatest([search$, title$, this.hasEmail$, this.hasPhone$])
      .pipe(
        tap(() => {
          this.message = null;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(([q, title, hasEmail, hasPhone]) => {
        const query = (q ?? '').trim();
        const titleValue = (title ?? '').trim();
        this.currentFilters = {
          q: query || undefined,
          title: titleValue || undefined,
          hasEmail: hasEmail || undefined,
          hasPhone: hasPhone || undefined,
          sort: 'createdAt',
          order: 'DESC',
          include: 'summary',
        };
        this.resetAndLoad();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.observer?.disconnect();
  }

  addClient() {
    this.router.navigate(['/cree-client']);
  }

  onClientClick(client: ClientListItem) {
    localStorage.setItem('code_client', client.code_client.toString());
    localStorage.setItem('id_client', client.id.toString());
    this.router.navigate([`/one-client/${client.code_client}`]);
  }

  deleteClient(id: number) {
    this.clientsService.deleteClient(id).subscribe({
      next: () => {
        this.client = this.client.filter((c) => c.id !== id);
      },
      error: (error) => {
        this.message =
          'Une erreur est survenue lors de la suppression du client.';
        console.error(error);
      },
    });
  }

  // Toggle filters
  toggleEmailFilter() {
    this.hasEmail = !this.hasEmail;
    this.hasEmail$.next(this.hasEmail);
  }

  togglePhoneFilter() {
    this.hasPhone = !this.hasPhone;
    this.hasPhone$.next(this.hasPhone);
  }

  clearFilters() {
    this.searchCtrl.setValue('');
    this.titleCtrl.setValue('');
    this.hasEmail = false;
    this.hasPhone = false;
    this.hasEmail$.next(this.hasEmail);
    this.hasPhone$.next(this.hasPhone);
  }

  private resetAndLoad() {
    this.client = [];
    this.currentPage = 1;
    this.hasMore = true;
    this.pendingLoad = false;
    this.isLoadingMore = false;
    this.fetchPage(1, true);
  }

  private onLoadMoreAnchor() {
    if (!this.hasMore) {
      return;
    }
    if (this.isLoading || this.isLoadingMore) {
      this.pendingLoad = true;
      return;
    }
    this.loadNextPage();
  }

  private loadNextPage() {
    if (!this.hasMore || this.isLoading || this.isLoadingMore) {
      return;
    }
    this.fetchPage(this.currentPage + 1, false);
  }

  private fetchPage(page: number, reset: boolean) {
    const requestId = ++this.activeRequestId;
    if (reset) {
      this.isLoading = true;
    } else {
      this.isLoadingMore = true;
    }

    this.clientsService
      .getClients({
        ...this.currentFilters,
        page,
        pageSize: this.pageSize,
      })
      .pipe(
        catchError((error) => {
          if (requestId === this.activeRequestId) {
            this.message =
              'Une erreur est survenue lors de la récupération des clients.';
          }
          console.error(error);
          return of([] as ClientListItem[]);
        })
      )
      .subscribe((data) => {
        if (requestId !== this.activeRequestId) {
          return;
        }
        if (reset) {
          this.client = data;
        } else {
          this.client = [...this.client, ...data];
        }
        this.currentPage = page;
        this.hasMore = data.length === this.pageSize;
        this.isLoading = false;
        this.isLoadingMore = false;

        if (this.pendingLoad) {
          const shouldLoad = this.hasMore;
          this.pendingLoad = false;
          if (shouldLoad) {
            this.loadNextPage();
          }
        }
      });
  }
}
