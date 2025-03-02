import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Radio,
} from 'antd';

import { UserType } from '@/types';
import { useRouter } from 'next/router';
import styles from "./index.module.css"

import Content from '../Content';
import { userAdd, userUpdate } from '@/apis/user';
import { USER_ROLE, USER_SEX, USER_STATUS } from '@/constant/user';




const UserForm = ({ 
  title, 
  editData = { 
    sex: USER_SEX.MALE,
    role: USER_ROLE.USER,
    status: USER_STATUS.ON,
  }}: {
  title: string,
  editData?: Partial<UserType>
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  useEffect(() => {
    if(editData._id){
      form.setFieldsValue(editData);
    }
  }, [editData, form])
  
  const handleFinish = async (values: UserType) => {
    if (editData?._id) {
      await userUpdate(editData?._id, values)
      message.success("updated success!")
    } else {
      await userAdd(values)
      console.log(values);
      
      message.success("created success!")
      
    }
    router.push('/user')
  }

  return (
    <Content title={title}>
      <Form
        form={form}
        className={styles.from}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 17 }}
        initialValues={editData}
        layout="horizontal"
        onFinish={handleFinish}
      >
        <Form.Item 
          label="Name" 
          name="name" 
          rules={[
            {
              required: true,
              message: "please type in account"
            }
          ]}
        >
          <Input placeholder='please type in'/>
        </Form.Item>
        <Form.Item 
          label="Name" 
          name="nickName"
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
          label="Gender" 
          name="sex"
          rules={[
            {
              required: true,
              message: "please choose gender"
            }
          ]}
        >
          <Radio.Group>
            <Radio value={USER_SEX.MALE}>Male</Radio>
            <Radio value={USER_SEX.FEMALE}>Female</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password 
            placeholder='please type in'
          />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Radio.Group>
            <Radio value={USER_STATUS.ON}>Activate</Radio>
            <Radio value={USER_STATUS.OFF}>Ban</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Role" name="role">
          <Radio.Group>
            <Radio value={USER_ROLE.USER}>User</Radio>
            <Radio value={USER_ROLE.ADMIN}>Admin</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" size="large" htmlType="submit" className={styles.btn}>
            {editData?._id ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default UserForm;