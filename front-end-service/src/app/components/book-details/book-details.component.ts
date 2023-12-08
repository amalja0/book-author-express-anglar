import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Author } from '../../models/author.model';
import { Book } from '../../models/book.model';
import { AuthorService } from '../../services/author.service';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {

  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  bookId?: string;
  book ?: Book;
  isUpdate?: boolean = false;
  isDelete?: boolean;
  updateBookForm = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required
    ]),
    author: new FormControl<any>(null, [
      Validators.required
    ]),
    description: new FormControl<string>('', [
      Validators.required
    ]),
    price: new FormControl<number>(0),
    published: new FormControl<boolean>(false)
  });

  listTitle = [
    "ID",
    "Author",
    "Description",
    "Price",
    "Publish Status",
  ];

  structure = [
    "id",
    "author",
    "description",
    "price",
    "published",
  ];

  authors: Author[] = [];

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id')!;
    this.retrieveBook();
    this.retrieveAuthor();
  }

  retrieveBook(): void {
    this.bookService.getById(this.bookId)
      .subscribe({
        next: (data) => {
          this.book = data;
        },
        error: (e) => console.log(e)
      })
  }

  retrieveAuthor(): void {
    this.authorService.getAll()
      .subscribe({
        next: (data) => {
          this.authors = data.length > 0 ? data : [];
        },
        error: (e) => console.log(e)
      })
  }

  retrieveAuthorByName(event: Event): void {
    const input = event.target as HTMLInputElement;
    const name = input.value;

    if(name !== '') {
      this.authorService.getByName(name)
        .subscribe({
          next: (data) => {
              this.authors = data.length > 0 ? data : [];
          },
          error: (e) => console.log(e)
        })
    } else {
      this.retrieveAuthor();
    }
  }

  getPropertyValue(index: number): any {
    const propName = this.structure[index];

    if (this.book && this.book.hasOwnProperty(propName)) {
      if (propName === 'author') {
        return this.book?.author?.firstName + ' ' + this.book?.author?.lastName;
      } else {
        return this.book[propName as keyof Book];
      }
    }
  }

  setUpdateBook(): void {
    if (this.book) {
      const selectedAuthor = this.authors.find(author => author.id === this.book?.authorId);

      this.updateBookForm.setValue({
        author: selectedAuthor,
        title: this.book.title!,
        description: this.book.description!,
        price: this.book.price!,
        published: this.book.published!
      });
    }

    this.isUpdate = true;
  }

  onSubmitUpdate(): void {
    const requestBody: Book = {
      authorId: this.updateBookForm.value.author.id,
      title: this.updateBookForm.value.title!,
      description: this.updateBookForm.value.description!,
      price: this.updateBookForm.value.price!,
      published: this.updateBookForm.value.published!
    }

    this.bookService.update(this.bookId, requestBody)
      .subscribe({
        next: () => {
          this.retrieveBook();
          this.isUpdate = false;
        },
        error: (e) => console.log(e)
      })
  }

  onCancelUpdate(): void {
    this.isUpdate = false;
  }

  onRouteBack(): void {
    this.router.navigateByUrl(`books`);
  }

  onDelete(): void {
    this.isDelete = window.confirm("Are you sure to delete this data?");
    if (this.isDelete) {
      this.bookService.delete(this.bookId)
        .subscribe({
          next: () => {
            this.onRouteBack();
          }
        })
    }
  }

  getAuthorName(): string {
    return this.updateBookForm.get('author') ? this.updateBookForm.get('author')!.value : null;
  }

  displayFn(option: Author): string {
    return option.firstName && option.lastName ? option.firstName + ' ' + option.lastName : '';
  }

  defaultSelected(): void {
    const author = this.authors.find(author => this.book?.authorId === author.id);
    if (author) {

      const event = {
        source: this.matAutocomplete,
        option: { value: author }
      } as MatAutocompleteSelectedEvent;
      this.updateBookForm.get('author')?.patchValue(author);
      this.matAutocomplete.optionSelected.emit(event);
    }
  }
}
