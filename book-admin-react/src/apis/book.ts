import { BookQueryType, BookType } from "@/types";
import qs from "qs";
import request from "@/utils/request";

const getBookList = async (params? : BookQueryType) => {
  return request.get(`/api/books?${qs.stringify(params)}`)
}

const bookAdd = (params: BookType) => {
  return request.post('/api/books', params);
}

const bookUpdate = (id: string, params: BookType) => {
  return request.put(`/api/books/${id}`, params);
}

const bookDelete = (id: string) => {
  return request.delete(`/api/books/${id}`);
}

const getBookDetail = (id: string) => {
  return request.get(`/api/books/${id}`);
}
export { getBookList, bookAdd, bookUpdate, bookDelete, getBookDetail };