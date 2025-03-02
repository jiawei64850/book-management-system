import { BorrowQueryType, BorrowType } from "@/types";
import qs from "qs";
import request from "@/utils/request";

const getBorrowList = async (params? : BorrowQueryType) => {
  return request.get(`/api/borrows?${qs.stringify(params)}`)
}

const borrowAdd = (params: BorrowType) => {
  return request.post('/api/borrows', params);
}

const borrowUpdate = (params: BorrowType) => {
  return request.put('/api/borrows', params);
}
const borrowDelete = (id: string) => {
  return request.delete(`/api/borrows/${id}`);
}

const getBorrowDetail = (id: string) => {
  return request.get(`/api/borrows/${id}`);
}
export { getBorrowList, borrowAdd, borrowUpdate, borrowDelete, getBorrowDetail };