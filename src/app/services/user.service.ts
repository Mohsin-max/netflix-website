import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'http://localhost:3000/users';

  postUserData(data: any): Observable<any> {

    return this.http.post(this.baseURL, data)

  }

  getUserData():Observable<any>{

    return this.http.get(this.baseURL)

  }

}

