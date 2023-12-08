import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {

  bookId?: string;
  book ?: Book;
  isUpdate?: boolean = false;
  isDelete?: boolean;
  updateBookForm = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required
    ]),
    description: new FormControl<string>('', [
      Validators.required
    ]),
    published: new FormControl<boolean>(false, [
      Validators.required
    ])
  });

  listTitle = [
    "ID",
    "Book Title",
    "Description",
    "Publish Status",
  ];

  structure = [
    "id",
    "title",
    "description",
    "published",
  ]

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id')!;
    this.retrieveBook();
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

  getPropertyValue(index: number): any {
    const propName = this.structure[index];

    if (this.book && this.book.hasOwnProperty(propName)) {
      return this.book[propName as keyof Book];
    }
  }

  setUpdateBook(): void {
    if(this.book) {
      this.updateBookForm.setValue({
        title: this.book.title!,
        description: this.book.description!,
        published: this.book.published!
      })
    }
    this.isUpdate = true;
  }

  onSubmitUpdate(): void {
    const requestBody = this.updateBookForm.value;

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

}
