import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, take } from 'rxjs';
import { GlobalComponent } from '../global-component';
import { PaginatedResult } from '../models/Pagination';
import { Profile } from '../models/Profile';

@Injectable()
export class ProfileService {

  constructor(private http: HttpClient) { }

  public post(profile: Profile): Observable<any>{
    return this.http.post(GlobalComponent.baseURL+'Profile/add', profile).pipe(take(1));
  }

  public put(profile: Profile): Observable<any>{
    return this.http.put(GlobalComponent.baseURL+'Profile/update', profile).pipe(take(1));
  }

  public delete(id: number): Observable<any>{
    return this.http.delete(`${GlobalComponent.baseURL}Profile/delete?id=${id}`).pipe(take(1));
  }

  public getById(id: number): Observable<Profile>{
    return this.http.get<Profile>(`${GlobalComponent.baseURL}Profile/getById?id=${id}`).pipe(take(1));
  }

  //*********************************************************************************************** */
  
  public get( page?: number,
              itemsPerPage?: number,
              term?: string,
              orderField?: string,
              orderReverse?: boolean ): Observable<PaginatedResult<Profile[]>> 
  {
    const paginatedResult: PaginatedResult<Profile[]> = new PaginatedResult<Profile[]>();
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
    return this.http.get<Profile[]>(GlobalComponent.baseURL+'Profile/get', {observe: 'response', params})
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
