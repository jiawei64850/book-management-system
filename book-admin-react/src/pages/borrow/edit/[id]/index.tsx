
import { getBorrowDetail } from '@/apis/borrow';
import BorrowForm from '@/components/BorrowForm';
import { BorrowType } from '@/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function BorrowEdit() {
  const [data, setData] = useState([])
  const router = useRouter();
  useEffect(() => {
    if (router.query.id) {
      getBorrowDetail(router.query.id as string).then(res => setData(res.data));
    }
  }, [router.query.id])
  return (
    <BorrowForm title="Borrow Edit" editData={data}/>
  );
}