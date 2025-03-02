import { Button, Form, Input, Select, Space, Row, Col, Table, TablePaginationConfig, Image, Tooltip, message, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './index.module.css'
import dayjs from 'dayjs';
import { getBookList } from '@/apis/book'
import { getBorrowList, borrowDelete } from '@/apis/borrow';
import { BookType, BorrowQueryType, BorrowType, UserType } from '@/types';
import Content from '@/components/Content';
import { getUserList } from '@/apis/user';


const Borrow = () => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0,
  })
  const [data, setData] = useState([])
  const [bookList, setBookList] = useState<BookType[]>([])
  const [userList, setUserList] = useState<UserType[]>([])
  // to do
  const fetchData = async (search?: BorrowQueryType) => {
    const res = await getBorrowList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...search,
    }); 
    console.log(res.data);
    const newData = res.data.map((item: BorrowType) => ({
      ...item,
      bookName: item.book.name,
      borrowUser: item.user.nickName,
    }))
    
    setData(newData);
    setPagination({...pagination, total: res.total})
  };
  useEffect(() => {
    fetchData();
    getBookList({ all: true }).then(res => {
      setBookList(res.data);
    getUserList().then(res => {
      setUserList(res.data);
    })
    })
  }, [])
  
  const STATUS_OPTIONS = [
    {
      label: "on",
      value: "on",
    },
    {
      label: "off",
      value: "off",
    }
  ]

  const COLUMNS = [
    {
      title: 'Name',
      dataIndex: 'bookName',
      key: 'bookName',
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text: string) => (
        text === "on" ? (
        <Tag color="red">Borrowed</Tag> 
        ) : ( 
        <Tag color="green">Returned</Tag>
        )
      )
    },
    {
      title: 'Borrow User',
      dataIndex: 'borrowUser',
      key: 'borrowUser',
      width: 120,
    },
    {
      title: 'Borrow Time',
      dataIndex: 'borrowAt',
      key: 'borrowAt',
      width: 130,
      render: (text: string) => dayjs(text).format('DD/MM/YYYY') 
    },
    {
      title: 'Return Time',
      dataIndex: 'backAt',
      key: 'backAt',
      width: 130,
      render: (text: string) => dayjs(text).format('DD/MM/YYYY') 
    },
  ];
  
  const columns = [...COLUMNS, 
    {
      title: 'Action',
      key: 'action',
      render: ( _: any, row: any) => 
        <>
          <Space>
            {row.status === "on" &&
            <Button type="link" onClick={() => {
              handleBorrowEdit(row._id)
            }}
          >
          return</Button>}
            <Button type="link" onClick={() => {
              handleBorrowDelete(row._id)
            }} 
            danger
          >
          delete</Button>
          </Space>
        </>
  
    }
  ]
  const handleSearchFinish = async (values: BorrowQueryType) => {
    const res = await getBorrowList({...values, current: 1, pageSize: pagination.pageSize})
    const newData = res.data.map((item: BorrowType) => ({
      ...item,
      bookName: item.book.name,
      borrowUser: item.user.nickName,
    }))
    console.log(newData);
    setData(newData);
    setPagination({...pagination, current: 1, total: res.total})
  }
  const handleSearchReset = () => {
    console.log(form);
    form.resetFields();
  }

  const handleBorrowEdit = (id: string) => {
    router.push(`/borrow/edit/${id}`)
  }
  
  const handleBorrowDelete = async (id: string) => {
    await borrowDelete(id);
    message.success("Deleting Successful");
    fetchData(form.getFieldsValue());
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
    getBookList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    });
  }

  return (
    <Content title="Borrow List" operation={<Button type="primary" onClick={() => {
      router.push("/borrow/add")
    }}>
      Add
    </Button>}>
      
      <Form
        name="search"
        form={form}
        onFinish={handleSearchFinish}
        initialValues={{
          name: '',
          author: '',
          category: ''
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="Book Name" >
              <Select 
                allowClear 
                showSearch
                optionFilterProp='label'
                options={bookList.map(item => ({
                  label: item.name,
                  value: item._id,
                }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="status" label="Status" >
              <Select allowClear showSearch options={STATUS_OPTIONS}></Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="user" label="Borrow User" >
              <Select
                showSearch
                allowClear
                placeholder='please select'
                options={userList.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
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


export default Borrow;
