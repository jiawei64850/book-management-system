import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Select,
} from 'antd';

import { CategoryType } from '@/types';
import { useRouter } from 'next/router';
import styles from "./index.module.css"
import Content from '../Content';
import { LEVEL_OPTIONS } from '@/pages/category';
import { categoryAdd, categoryUpdate, getCategoryList } from '@/apis/category';



const CatergoryForm = ({ title, data }: { title: string, data:  Partial<CategoryType> }) => {
  const [level, setLevel] = useState(1);
  const [levelOneList, setLevelOneList] = useState<CategoryType[]>([]);
  const [form] = Form.useForm();
  const router = useRouter();
  const handleFinish = async (values: CategoryType) => {
    if (data?._id) {
      await categoryUpdate(data?._id, values);
      message.success("updated success!")
    } else {
      await categoryAdd(values); 
      message.success("created success!")
    }
    
    console.log(values);
    router.push('/category')
  }

  useEffect(() => {
    console.log(data);
    
    if(data?._id) {
      form.setFieldsValue({...data});
    }
  }, [data, form])

  useEffect(() => {
    const fetchdata = async () => {
      const res = await getCategoryList({ all: true, level: 1});
      setLevelOneList(res.data);
      
    }
    fetchdata();
  }, [])


  useEffect(() => {
    if(data?._id) {
      form.setFieldsValue({...data});
    }
  }, [data, form])
  
  const levelOneOptions = useMemo(() => {
    return levelOneList.map(item => ({
      value: item._id,
      label: item.name,
    }))
  }, [levelOneList])

  return (
    <Content title={title}>
      <Form
        form={form}
        className={styles.from}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 17 }}
        layout="horizontal"
        onFinish={handleFinish}
      >
        <Form.Item 
          label="Name" 
          name="name" 
          rules={[
            {
              required: true,
              message: "please type in name"
            }
          ]}
        >
          <Input placeholder='please type in'/>
        </Form.Item>
        <Form.Item 
          label="Level" 
          name="level"
          rules={[
            {
              required: true,
              message: "please choose level"
            }
          ]}
        >
          <Select 
            placeholder='please choose' 
            options={LEVEL_OPTIONS}
            disabled={!!data?._id}
            onChange={(value) => {
              console.log(value);
              setLevel(value);
            }}
          ></Select>
        </Form.Item>
        {(level === 2 || data?.level === 2)  && 
        <Form.Item 
          label="Parent Level" 
          name="parent"
          rules={[
            {
              required: true,
              message: "please choose parent level"
            }
          ]}
        >
          <Select placeholder='please choose' options={levelOneOptions}></Select>
        </Form.Item>}
        <Form.Item>
          <Button type="primary" size="large" htmlType="submit" className={styles.btn}>
            {data?._id ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default CatergoryForm;