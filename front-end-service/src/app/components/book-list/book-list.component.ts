import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Author } from '../../models/author.model';
import { Book } from '../../models/book.model';
import { AuthorService } from '../../services/author.service';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {

  books: Book[] = [];
  currentBook: Book = {};
  tableHeader: string[] = [
    "ID",
    "Author",
    "Book Title",
    "Description",
    "Publish Status",
    "Price",
    "Actions"
  ];
  tableContentStructure: string[] = [
    "id",
    "author",
    "title",
    "description",
    "published",
    "price",
  ];
  filterChoices: String[] = [
    "title",
    'author'
  ];
  choosenFilter: String = "";

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.retrieveBooks();
  }

  retrieveBooks(): void {
    this.bookService.getAll()
      .subscribe({
        next: (data) => {
          this.books = data;
        },
        error: (e) => console.log(e)
      })
  }

  refreshList(): void {
    this.retrieveBooks();
    this.currentBook = {};
  }

  searchTitle(event: Event): void {
    this.currentBook = {};

    const input = event.target as HTMLInputElement;
    const title = input.value;

    if (title !== '') {
      this.bookService.get(title)
        .subscribe({
          next: (data) => {
            this.books = data.length > 0 ? data : [];
          },
          error: (e) => console.log(e)
        })
    } else {
      this.retrieveBooks();
    }
  }

  searchByAuthor(event: Event): void {
    const input = event.target as HTMLInputElement;
    const name = input.value;
    var authorBooks: Book[] = [];

    if (name !== '') {
      this.authorService.getByName(name)
        .subscribe({
          next: (data: Author[]) => {
            authorBooks = data.flatMap((authorDetail: Author) =>
              authorDetail.books
              ? authorDetail.books.map(book => ({
                ...book,
                author: authorDetail
              }))
              : []
            );

            this.books = authorBooks;
            console.log(this.books);
          }
        });
    } else {
      this.retrieveBooks();
    }
  }

  seeBookDetails(id: number): void {
    this.router.navigateByUrl(`books/${id}`);
  }

  getPropertyValue(book:Book, index: number): any {
    const propName = this.tableContentStructure[index];

    if (book && book.hasOwnProperty(propName)) {
      if (propName === "author") {
        return book.author?.firstName! + ' ' + book.author?.lastName!
      }
      return book[propName as keyof Book];
    }
  }

  resetFilterChoices(): void {
    this.choosenFilter = "";
    this.retrieveBooks();
  }

}
