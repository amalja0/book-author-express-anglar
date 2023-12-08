import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from '../models/author.model';
import { Book } from '../models/book.model';

const BASE_URL = 'http://localhost:3002/api/author'

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Author[]> {
    return this.http.get<Book[]>(BASE_URL);
  }

  getByName(name: String): Observable<Author[]> {
    return this.http.get<Author[]>(`${BASE_URL}/name?name=${name}`);
  }

}
