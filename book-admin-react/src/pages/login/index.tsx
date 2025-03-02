

import { login } from "@/apis/user";
import styles from "./index.module.css";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/router";



export default function Home() {
  const router = useRouter()
  const handleFinish = async (values: {
    name: string;
    password: string;
  }) => {
    const res = await login(values);
    console.log(res);
    if (res.success) {
      message.success("logined success");

      localStorage.setItem("user", JSON.stringify({ info: res.data, token: res.token }));

      router.push('/book');
    }
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Book Management System</h2>
      <Form onFinish={handleFinish}>
        <Form.Item label="Account " name="name" rules={[{ required: true, message: "please key in account"}]}>
          <Input placeholder="please key in account"/>
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: "please key in password"}]}>
          <Input.Password placeholder="please key in password"/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" className={styles.btn}>Login</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
