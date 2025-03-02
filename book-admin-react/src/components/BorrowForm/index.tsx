import { getBookList } from '@/apis/book';
import { borrowAdd, borrowUpdate } from '@/apis/borrow';
import { getUserList } from '@/apis/user';
import Content from '@/components/Content';
import styles from '@/styles/Home.module.css'
import { BookType, BorrowType, UserType } from '@/types';
import { Button, Form, message, Select } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


export default function BorrowForm({ title, editData }: {
  title: string,
  editData?: BorrowType,
}) {
  const [userList, setUserList] = useState<UserType[]>([]);
  const [bookList, setBookList] = useState<BookType[]>([])
  const [stock, setStock] = useState(0)
  const router = useRouter();

  useEffect(() => {
    getUserList().then(res => setUserList(res.data));
    getBookList().then(res => setBookList(res.data));
  }, [])

  const [form] = Form.useForm();

  const handleFinish = async (values: BorrowType) => {
    console.log(values);
    try {
      if (editData?._id) {
        await borrowUpdate(values)
        message.success("Edit success")
      } else {
        await borrowAdd(values)
        message.success("Add success")
      }
      router.push('/borrow');
    } catch (error) {
      console.log(error);
    }
  }

  const handleBookChange = (_value: any, option: any) => {
    setStock(option.stock);
  }

  
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
          label="Book Name" 
          name="book" 
          rules={[
            {
              required: true,
              message: "please choose book name"
            }
          ]}
        >
          <Select 
            onChange={handleBookChange}
            placeholder='please choose' 
            options={bookList.map(item => ({
              label: item.name,
              value: item._id,
              stock: item.stock,
            }))}
          >
          </Select>
        </Form.Item>
        <Form.Item 
          label="Borrow User" 
          name="user"
          rules={[
            {
              required: true,
              message: "please choose borrow user"
            }
          ]}
        >
          <Select 
            placeholder='please choose' 
            options={userList.map(item => ({
              label: item.name,
              value: item._id,
            }))}
          >
          </Select>
        </Form.Item>
        <Form.Item 
          label="Book Stocks" 
        >
        {stock}
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            size="large" 
            htmlType="submit" 
            className={styles.btn}
            disabled={stock <= 0}
          >Create</Button>
        </Form.Item>
      </Form>
    </Content>
  );
}