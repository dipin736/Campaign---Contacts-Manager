import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contact {
  id?: string;
  createdAt?: string;
  first_name: string;
  last_name: string;
  emailId: string;
  age: number;
  gender: string;
  mobilenumber: number;
  pan_no: string;
  adhaar_no: string;
  status: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = 'https://65c0cfa6dc74300bce8cc64d.mockapi.io/Contact/profile';

  constructor(private http: HttpClient) {}


  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }


  getById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}/${id}`);
  }


  create(contact: Contact): Observable<Contact> {
    if (!contact.createdAt) {
      contact.createdAt = new Date().toISOString().split('T')[0];
    }
    return this.http.post<Contact>(this.baseUrl, contact);
  }


  update(id: string, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/${id}`, contact);
  }


  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
