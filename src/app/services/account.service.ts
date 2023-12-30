import { Injectable } from '@angular/core';
import { Observable, take, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GlobalComponent } from '../global-component';
import { Account } from '../models/Account';
import { PaginatedResult } from '../models/Pagination';

@Injectable()
export class AccountService {

  constructor(private http: HttpClient) { }

  public post(account: Account): Observable<any>{
    return this.http.post(GlobalComponent.baseURL+'Account/add', account).pipe(take(1));
  }

  public put(account: Account): Observable<any>{
    return this.http.put(GlobalComponent.baseURL+'Account/update', account).pipe(take(1));
  }

  public delete(id: number): Observable<any>{
    return this.http.delete(`${GlobalComponent.baseURL}Account/delete?id=${id}`).pipe(take(1));
  }

  public getById(id: number): Observable<Account>{
    return this.http.get<Account>(`${GlobalComponent.baseURL}Account/getById?id=${id}`).pipe(take(1));
  }

  //*********************************************************************************************** */

  public get( page?: number,
              itemsPerPage?: number,
              term?: string,
              orderField?: string,
              orderReverse?: boolean ): Observable<PaginatedResult<Account[]>> 
  {
    const paginatedResult: PaginatedResult<Account[]> = new PaginatedResult<Account[]>();
    let params = new HttpParams;
    if (page !=  null && itemsPerPage != null){
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    if (term != null && term != ''){
      params = params.append('term', term)
    }
    if (orderField != null && orderField != ''){
      params = params.append('orderField', orderField);
    }
    if (orderReverse != null){
      params = params.append('orderReverse', orderReverse);
    }
    return this.http.get<Account[]>(GlobalComponent.baseURL+'Account/get', {observe: 'response', params})
                    .pipe(take(1), map((response) => {
      paginatedResult.result = response.body!;
      if(response.headers.has('Pagination')){
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
      })
    );
  }

}
