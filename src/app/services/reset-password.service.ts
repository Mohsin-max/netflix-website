import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http: HttpClient) { }

  baseURL: string = `http://localhost:5000`

  getOtp(email: string): Observable<any> {

    return this.http.post(`/api/generate-otp`, {email})
    // return this.http.post(this.baseURL, email)

  }

}
