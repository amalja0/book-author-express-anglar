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

@Component({
  selector: 'app-add-author',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-author.component.html',
  styleUrl: './add-author.component.css'
})
export class AddAuthorComponent implements OnInit {

  authorForm = new FormGroup({
    firstName: new FormControl<string>('', [
      Validators.required
    ]),
    lastName: new FormControl<string>('', [
      Validators.required
    ]),
  });

  constructor(private authorService: AuthorService) {}

  ngOnInit(): void {

  }

  onSubmit(): void {
    const requestBody = this.authorForm.value;

    this.authorService.create(requestBody)
      .subscribe({
        next: () => {
          this.onReset();
          window.alert("Author saved to database!");
        },
        error: (e) => console.log(e)
      });
  }

  onReset(): void {
    this.authorForm.reset({
      firstName:"",
      lastName:""
    });
  }

}
