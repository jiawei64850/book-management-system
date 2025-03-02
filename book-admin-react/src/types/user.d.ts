import { USER_SEX, USER_ROLE, USER_STATUS } from "@/constant/user";

export interface UserQueryType {
  name?: string;
  status?: number;
  current?: number;
  pageSize?: number;
}

export interface UserType {
  name: string;
  nickName: string;
  password: string;
  _id?: string;
  sex: USER_SEX;
  role: USER_ROLE;
  status: USER_STATUS;
}