import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private http: HttpClient) { }

  getData(){
    return this.http.get('api/getData');
  }

  getCollection(){
    return this.http.get('api/getCollection');
  }

  getCollectionById(id){
    console.log('usao u funkciju:',id);
    return this.http.get('api/getItemById/:'+id);
  }

  updateItem(id){
    return null;
  }
}
