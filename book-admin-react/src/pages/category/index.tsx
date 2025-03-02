import { Button, Form, Input, Select, Space, Row, Col, Table, TablePaginationConfig, Modal, Tag, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './index.module.css'
import dayjs from 'dayjs';
import { getCategoryList, categoryDelete } from '@/apis/category'
import { CategoryQueryType } from '@/types';
import Content from '@/components/Content';

const LEVEL = {
  ONE: 1,
  TWO: 2,
}

export const LEVEL_OPTIONS = [
  { label: "LEVEL 1", value: LEVEL.ONE },
  { label: "LEVEL 2", value: LEVEL.TWO },
]
const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
    ellipsis: true,
    width: 120,
    render: (text: number) => {
      console.log(text);
      return <Tag color={text === 1 ? "green" : "cyan"}>{`Level ${ text }`}</Tag>
    }
  },
  {
    title: 'Category',
    dataIndex: 'parent',
    key: 'parent',
    width: 120,
    render: (text: { name: string }) => {
      return text?.name ?? '-'
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


export default function Category() {
  const [form] = Form.useForm()
  const router = useRouter()
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0,
  })
  const [data, setData] = useState([])
  console.log(data);
  
  const columns = [...COLUMNS, 
    {
      title: 'Action',
      key: 'action',
      render: ( _: any, row: any) => 
        <>
          <Space>
            <Button type="link" onClick={() => {
              handleCategoryEdit(row._id)
              }} 
            >
            edit</Button>
            <Button type="link" onClick={() => {
              handleCategoryDelete(row._id)
              }} 
              danger
            >
            delete</Button>
          </Space>
        </>
  
    }
  ]

  const fetchData = async (values?: any) => {
    const res = await getCategoryList({
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
  
  
  const handleSearchFinish = async (values: CategoryQueryType) => {
    console.log(values);
    
    const res = await getCategoryList({...values, current: 1, pageSize: pagination.pageSize})
    console.log(res);
    setData(res.data);
    setPagination({...pagination, current: 1, total: res.total})
  }
  const handleSearchReset = () => {
    console.log(form);
    form.resetFields();
  }


  const handleCategoryEdit = (id: string) => {
    router.push(`/category/edit/${id}`)
  }
  
  const handleCategoryDelete = (id: string) => {
    Modal.confirm({
      title: "Confirm Delete?",
      okText: "OK",
      cancelText: "Cancel",
      async onOk() {
        await categoryDelete(id);
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
    getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    });
  }

  return (
    <Content title="Category List" operation={<Button type="primary" onClick={() => {
      router.push("/category/add")
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
            <Form.Item name="name" label="Name" >
              <Input placeholder='please type in' allowClear/>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="level" label="Level" >
              <Select
                showSearch
                allowClear
                placeholder='please select'
                options={LEVEL_OPTIONS}
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
