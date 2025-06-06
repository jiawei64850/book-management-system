import { CategoryType } from "./category";

export interface BookQueryType {
  name?: string;
  author?: string;
  category?: number;
  current?: number;
  pageSize?: number;
  all?: boolean;
}

export interface BookType {
  name: string;
  author: string;
  category: CategoryType | string,
  cover: string;
  publishAt: number;
  stock: number;
  description: string;
  _id?: string;
}