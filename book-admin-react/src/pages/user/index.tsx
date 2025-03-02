import { Button, Form, Input, Select, Space, Row, Col, Table, TablePaginationConfig, Modal, Tag, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './index.module.css'
import dayjs from 'dayjs';
import { getUserList, userDelete, userUpdate } from '@/apis/user'
import { UserQueryType, UserType } from '@/types';
import Content from '@/components/Content';
import { USER_STATUS } from '@/constant/user';



export const STATUS_OPTIONS = [
  { label: "Normal", value: USER_STATUS.ON },
  { label: "Banned", value: USER_STATUS.OFF },
]
const COLUMNS = [
  {
    title: 'Account',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Nickname',
    dataIndex: 'nickName',
    key: 'nickName',
    width: 120,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    render: (text: string ) => {
      return text === USER_STATUS.ON ? <Tag color='green'>Normal</Tag> : <Tag color='red'>Banned</Tag>
    }
  },
  {
    title: 'Creation Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 130,
    render: (text: string) => dayjs(text).format('DD/MM/YYYY') 
  },
];


export default function User() {
  const [form] = Form.useForm()
  const router = useRouter()
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0,
  })
  const [data, setData] = useState([])

  const columns = [...COLUMNS, 
    {
      title: 'Action',
      key: 'action',
      render: ( _: any, row: any) => 
        <>
          <Space>
            <Button type="link" onClick={() => {
              handleUserEdit(row._id)
              }} 
            >
            Edit</Button>
            <Button type="link" onClick={() => {
              handleStatusChange(row)
              }} 
              danger={row.status == USER_STATUS.ON ? true : false}
            >
            {row.status === USER_STATUS.ON ? "Ban" : "Activate"}</Button>
            <Button type="link" onClick={() => {
              handleUserDelete(row._id)
              }} 
              danger
            >
            Delete</Button>
          </Space>
        </>
  
    }
  ]

  const fetchData = async (values?: any) => {
    const res = await getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...values,
    }); 
    
    const { data } = res;
    setData(data);
    setPagination({...pagination, total: res.total})
  };

  useEffect(() => {
    fetchData();
  }, [])
  
  
  const handleSearchFinish = async (values: UserQueryType) => {
    console.log(values);
    
    const res = await getUserList({...values, current: 1, pageSize: pagination.pageSize})
    console.log(res);
    setData(res.data);
    setPagination({...pagination, current: 1, total: res.total})
  }
  const handleSearchReset = () => {
    console.log(form);
    form.resetFields();
  }


  const handleUserEdit = (id: string) => {
    router.push(`/user/edit/${id}`)
  }
  
  const handleStatusChange = (row: UserType) => {
    const status = row.status === USER_STATUS.ON ? USER_STATUS.OFF : USER_STATUS.ON;

    userUpdate(row._id!, {
      ...row,
      status: status as USER_STATUS,
    });
    fetchData(form.getFieldsValue());
  }
  const handleUserDelete = (id: string) => {
    Modal.confirm({
      title: "Confirm Delete?",
      okText: "OK",
      cancelText: "Cancel",
      async onOk() {
        await userDelete(id);
        message.success("Delete Successful")
        fetchData(form.getFieldsValue());
      }
    })
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    console.log(pagination);
    setPagination((prev) => ({
      ...prev,
      current: pagination.current || prev.current, 
      pageSize: pagination.pageSize || prev.pageSize,
      total: pagination.total || prev.total,        
    }))
    const query = form.getFieldsValue();
    getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    });
  }

  return (
    <Content title="User List" operation={<Button type="primary" onClick={() => {
      router.push("/user/add")
    }}>
      Add
    </Button>}>
      
      <Form
        name="search"
        form={form}
        onFinish={handleSearchFinish}
        initialValues={{
          name: '',
          status: '',
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="Name" >
              <Input placeholder='please type in' allowClear/>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="status" label="Status" >
              <Select
                showSearch
                allowClear
                placeholder='please select'
                options={STATUS_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                <Button htmlType="submit" onClick={handleSearchReset}>
                  Clear
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles.tableWrap}>
      <Table 
        dataSource={data} 
        columns={columns} 
        scroll={{ x: 1000 }}
        onChange={handleTableChange}
        pagination={{...pagination, showTotal: () => `Totally ${pagination.total} pieces`}}
        />
      </div>
    </Content>
  );
}
