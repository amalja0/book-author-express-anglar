import { Author } from "./author.model";

export class Book {
  id?: any;
  authorId?: any;
  author?: Author;
  title?: string;
  description?: string;
  published?: boolean;
  price?: number;
}
