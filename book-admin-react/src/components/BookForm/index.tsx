import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Image,
} from 'antd';
import { bookAdd, bookUpdate } from '@/apis/book';
import { BookType, CategoryType } from '@/types';
import { useRouter } from 'next/router';
import styles from "./index.module.css"
import dayjs from 'dayjs';
import Content from '../Content';
import { getCategoryList } from '@/apis/category';

const { TextArea } = Input;


const BookForm = ({ title, data } : { title: string, data: BookType }) => {
  const [preview, setPreview] = useState("");
  const [categoryList, setCategoryList] = useState<CategoryType[]>([])
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    getCategoryList({ all: true }).then(res => {
      setCategoryList(res.data);
    })
    
  }, [])

  useEffect(() => {
    if(data?._id) {
      data.publishAt = Number(dayjs(data.publishAt));
      if (typeof data.category === 'object' && '_id' in data.category) {
        data.category = (data.category as CategoryType)._id ?? '' 
      } else {
        data.category = data.category as string; 
      }
      form.setFieldsValue({...data});
    }
  }, [data, form])

  const handleFinish = async (values: BookType) => {
    if (values.publishAt) {
      values.publishAt = dayjs(values.publishAt).valueOf();
    }
    if (data?._id) {
      await bookUpdate(data?._id, values);
      message.success("updated success!")
    } else {
      await bookAdd(values);
      message.success("created success!")
    }
    console.log(values);
    router.push('/book')
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
          label="Author" 
          name="author"
          rules={[
            {
              required: true,
              message: "please type in author"
            }
          ]}
        >
          <Input placeholder='please type in'/>
        </Form.Item>
        <Form.Item 
          label="Category" 
          name="category"
          rules={[
            {
              required: true,
              message: "please choose category"
            }
          ]}
        >
          <Select 
            placeholder='please choose' 
            options={categoryList.map(item => ({
              label: item.name,
              value: item._id,
            }))}
          >
          </Select>
        </Form.Item>
        <Form.Item label="Cover" name="cover">
          <Input.Group compact>
            <Input 
              placeholder='please type in'
              style={{ width: "calc(100% - 82px)" }}
              onChange={(e) => {
                form.setFieldValue("cover", e.target.value);
                console.log(e);
                
                
              }}
              />
            <Button 
              type="primary"
              onClick={(e) => {
                setPreview(form.getFieldValue("cover"));
              }}
            >Preview</Button>
          </Input.Group>
        </Form.Item>
        {preview && (
        <Form.Item label="" colon={false}>
          <Image src={preview} width={100} height={100} alt="" />
        </Form.Item>
        )}
        <Form.Item label="Publish date" name="publishAt">
          <DatePicker placeholder='please choose'/>
        </Form.Item>
        <Form.Item label="Stock" name="stock">
          <Input placeholder='please type in'/>
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea rows={4} placeholder='please type in'/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" size="large" htmlType="submit" className={styles.btn}>
            {data?._id ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default BookForm;