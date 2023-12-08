import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

const BASE_URL = 'http://localhost:3002/api/book'

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(BASE_URL);
  }

  get(title: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${BASE_URL}/title?title=${title}`);
  }

  getById(id: any): Observable<Book> {
    return this.http.get(`${BASE_URL}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(BASE_URL, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${BASE_URL}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${BASE_URL}/${id}`);
  }

}
