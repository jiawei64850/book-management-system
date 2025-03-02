import { UserQueryType, UserType } from "@/types";
import qs from "qs";
import request from "@/utils/request";

const getUserList = async (params? : UserQueryType) => {
  return request.get(`/api/users?${qs.stringify(params)}`)
}
const getUserDetail = (id: string) => {
  return request.get(`/api/users/${id}`)
}

const userAdd = (params: UserType) => {
  return request.post('/api/users', params);
}

const userDelete = (id: string) => {
  return request.delete(`/api/users/${id}`)
}

const userUpdate = (id: string, params: UserType) => {
  return request.put(`/api/users/${id}`, params);
}

const login = (params: Pick<UserType, "name" | "password">) => {
  return request.post('/api/login/', params);
}

const logout = () => {
  return request.get('/api/logout/');
}
export { 
  getUserList, 
  getUserDetail, 
  userAdd, 
  userDelete, 
  userUpdate, 
  login,
  logout, 
};