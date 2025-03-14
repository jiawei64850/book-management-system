import { getBookDetail } from '@/apis/book';
import BookForm from '@/components/BookForm'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function BookEdit() {
  const router = useRouter();
  const [data, setData] = useState({});
  
  useEffect(() => {
    const fetch = async () => {
      const { query = {} } = router;
      console.log(query);
      
      const { id } = query;
      if (id) {
        const res = await getBookDetail(id as string);
        setData(res.data);
      }
    }
    fetch();
  }, [router])
  return (
    <BookForm title="Book Edit" data={data}/>
  );
}