import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Author } from '../../models/author.model';
import { Book } from '../../models/book.model';
import { AuthorService } from '../../services/author.service';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatRadioModule
  ],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent implements OnInit {

  bookForm = new FormGroup({
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
  })

  authors: Author[] = [];
  choosenAuthor: Author = {};
  choosenAuthorName: string = "";

  constructor(
    private bookService: BookService,
    private authorService: AuthorService
  ) {}

  ngOnInit(): void {
    this.retrieveAuthor();
  }

  onSubmit(): void {
    const data: Book = {
      authorId: this.bookForm.value.author.id,
      title: this.bookForm.value.title!,
      description: this.bookForm.value.description!,
      price: this.bookForm.value.price!,
      published: this.bookForm.value.published!
    }

    this.bookService.create(data)
      .subscribe({
        next: () => {
          this.onReset();
          window.alert("Book saved to database!");
        },
        error: (e) => console.log(e)
      });
  }

  onReset(): void {
    this.bookForm.reset({
      title: "",
      author: null,
      description: "",
      price: 0,
      published: false
    });
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

}
