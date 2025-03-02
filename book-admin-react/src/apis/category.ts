import { CategoryQueryType, CategoryType } from "@/types";
import qs from "qs";
import request from "@/utils/request";

const getCategoryList = async (params? : CategoryQueryType) => {
  return request.get(`/api/categories?${qs.stringify(params)}`)
}

const categoryAdd = (params: CategoryType) => {
  return request.post('/api/categories', params);
}

const categoryDelete = (id: string) => {
  return request.delete(`/api/categories/${id}`);
}

const categoryUpdate = (id: string, params: CategoryType) => {
  return request.put(`/api/categories/${id}`, params);
}

const getCategoryDetail = (id: string) => {
  return request.get(`/api/categories/${id}`);
}
export { getCategoryList, categoryAdd, categoryDelete, categoryUpdate, getCategoryDetail };