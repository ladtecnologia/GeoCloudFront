import { Injectable } from '@angular/core';
import { Observable, take, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GlobalComponent } from '../global-component';
import { User } from '../models/User';
import { PaginatedResult } from '../models/Pagination';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  // GET USERS ************************************************************************************

  public get( page?: number,
              itemsPerPage?: number,
              term?: string,
              orderField?: string,
              orderReverse?: boolean ): Observable<PaginatedResult<User[]>> 
  {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
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
    return this.http.get<User[]>(GlobalComponent.baseURL+'User/get', {observe: 'response', params})
                    .pipe(take(1), map((response) => {
      paginatedResult.result = response.body!;
      if(response.headers.has('Pagination')){
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
      })
    );
  }

  //*********************************************************************************************** */

  public getById(id: number): Observable<User>{
    return this.http.get<User>(`${GlobalComponent.baseURL}User/getById?id=${id}`).pipe(take(1));
  }

  public post(user: User): Observable<any>{
    return this.http.post(GlobalComponent.baseURL+'User/add', user).pipe(take(1));
  }

  public put(user: User): Observable<any>{
    return this.http.put(GlobalComponent.baseURL+'User/update', user).pipe(take(1));
  }

  public delete(id: number): Observable<any>{
    return this.http.delete(`${GlobalComponent.baseURL}User/delete?id=${id}`).pipe(take(1));
  }

}
