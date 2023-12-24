import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalComponent } from '../global-component';
import { Deposit } from '../models/Deposit';

@Injectable()
export class DepositService {

  constructor(private http: HttpClient) { }

  public get(): Observable<Deposit[]>{
    return this.http.get<Deposit[]>(GlobalComponent.baseURL+'Deposit/get').pipe(take(1));
  }

  public getByName(name: string): Observable<Deposit[]>{
    return this.http.get<Deposit[]>(`${GlobalComponent.baseURL}Deposit/getByName?name=${name}`).pipe(take(1));
  }

  public getById(id: number): Observable<Deposit>{
    return this.http.get<Deposit>(`${GlobalComponent.baseURL}Deposit/getById?id=${id}`).pipe(take(1));
  }

  public post(deposit: Deposit): Observable<Deposit>{
    return this.http.post<Deposit>(GlobalComponent.baseURL+'Deposit/add', deposit).pipe(take(1));
  }

  public put(deposit: Deposit): Observable<Deposit>{
    return this.http.put<Deposit>(GlobalComponent.baseURL+'Deposit/update', deposit).pipe(take(1));
  }

  public delete(id: number): Observable<any>{
    return this.http.delete(`${GlobalComponent.baseURL}delete?id=${id}`).pipe(take(1));
  }

}
