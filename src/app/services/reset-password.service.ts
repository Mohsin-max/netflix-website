import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http: HttpClient) { }

  // baseURL: string = `http://localhost:5000`
  baseURL: string = `https://2a28-124-29-238-48.ngrok-free.app`

  

  getOtp(email: any): Observable<any> {

    return this.http.post(`${this.baseURL}/generate-otp`, { email })
    // return this.http.post(this.baseURL, email)

  }

  verifyOtp(email: any, otp: string): Observable<any> {

    return this.http.post(`${this.baseURL}/verify-otp`, { email, otp })

  }

}
