import { BookType } from "./book";
import { UserType } from "./user";

export interface BorrowQueryType {
  name?: string;
  author?: string;
  category?: number;
  current?: number;
  pageSize?: number;
}

export interface BorrowType {
  book: BookType;
  borrowAt: number;
  backAt: number;
  _id?: string;
  user: UserType;
}