import { getCategoryDetail } from '@/apis/category';
import CategoryForm from '@/components/CategoryForm';
import styles from '@/styles/Home.module.css'
import { CategoryType } from '@/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CategoryEdit() {
  const router = useRouter();
  const [data, setData] = useState<Partial<CategoryType>>({});
  
  useEffect(() => {
    const fetch = async () => {
      const { query = {} } = router;
      console.log(query);
      
      const { id } = query;
      if (id) {
        const res = await getCategoryDetail(id as string);
        console.log(res)
        setData(res.data);
      }
    }
    fetch();
  }, [router])
  return (
    <CategoryForm title="Category Edit" data={data}/>
  );
}