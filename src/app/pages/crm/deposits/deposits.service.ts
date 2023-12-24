/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
// Products Services
import { restApiService } from "../../../core/services/rest-api.service";

// Date Format
import {DatePipe} from '@angular/common';

import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from './deposits-sortable.directive';
import { Deposit } from 'src/app/models/Deposit';

interface SearchResult {
  deposits: Deposit[];
  total: number;
}

interface StateX {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  date: string;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(deposits: Deposit[], column: SortColumn, direction: string): Deposit[] {
  if (direction === '' || column === '') {
    return deposits;
  } else {
    return [...deposits].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(country: Deposit, term: string, pipe: PipeTransform) {
  return country.name.toLowerCase().includes(term.toLowerCase())
  ;

}

@Injectable({providedIn: 'root'})

export class DepositsService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _deposits$ = new BehaviorSubject<Deposit[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  deposits?: any;

  private _stateX: StateX = {
    page: 1,
    pageSize: 8,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0,
    status: '',
    date: '',
  };

  constructor(private pipe: DecimalPipe, public restApiService: restApiService, private datePipe: DatePipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._deposits$.next(result.deposits);
      this._total$.next(result.total);
    });

    this._search$.next();
    
    //Api Data
    this.restApiService.getDepositData().subscribe({
      next: (deposits: Deposit[]) => {
        this.deposits = deposits;
      },
      error: (error: any) => {
        console.error(error);
      }
    });

  }

  get deposits$() { return this._deposits$.asObservable(); }
  get customer() { return this.deposits; }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._stateX.page; }
  get pageSize() { return this._stateX.pageSize; }
  get searchTerm() { return this._stateX.searchTerm; }
  get startIndex() { return this._stateX.startIndex; }
  get endIndex() { return this._stateX.endIndex; }
  get totalRecords() { return this._stateX.totalRecords; }
  get status() { return this._stateX.status; }
  get date() { return this._stateX.date; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set startIndex(startIndex: number) { this._set({ startIndex }); }
  set endIndex(endIndex: number) { this._set({ endIndex }); }
  set totalRecords(totalRecords: number) { this._set({ totalRecords }); }
  set status(status: any) { this._set({status}); }
  set date(date: any) { this._set({date}); }

  private _set(patch: Partial<StateX>) {
    Object.assign(this._stateX, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const datas = (this.customer) ?? [];
    const {sortColumn, sortDirection, pageSize, page, searchTerm, status, date} = this._stateX;

    // 1. sort
    let deposits = sort(datas, sortColumn, sortDirection);      

    // 2. filter
    deposits = deposits.filter(country => matches(country, searchTerm, this.pipe));   
    
    const total = deposits.length;

    // 3. paginate
    this.totalRecords = deposits.length;
    this._stateX.startIndex = (page - 1) * this.pageSize + 1;
    this._stateX.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
        this.endIndex = this.totalRecords;
    }
    deposits = deposits.slice(this._stateX.startIndex - 1, this._stateX.endIndex);
    return of({deposits, total});
  }
}
