import { getUserDetail } from "@/apis/user";
import UserForm from "@/components/UserForm";
import { UserType } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserEdit() {
  const [data, setData] = useState<Partial<UserType>>()
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    if(id) {
      getUserDetail(id as string).then(res => setData(res.data));
    }
  }, [id])
  return (
    <UserForm title="User Edit" editData={data}/>
  );
}