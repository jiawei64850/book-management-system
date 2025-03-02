import { Button, Form, Input, Select, Space, Row, Col, Table, TablePaginationConfig, Image, Tooltip, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './index.module.css'
import dayjs from 'dayjs';
import { getBookList, bookDelete } from '@/apis/book'
import { BookQueryType, CategoryType } from '@/types';
import Content from '@/components/Content';
import { getCategoryList } from '@/apis/category';


const Book = () => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0,
  })
  const [data, setData] = useState([])
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  const fetchData = async (search?: BookQueryType) => {
    const res = await getBookList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...search,
    }); 
    
    const { data } = res;
    console.log(data);
    
    setData(data);
    setPagination({...pagination, total: res.total})
  };
  useEffect(() => {
    fetchData();
    getCategoryList({ all: true }).then(res => {
      setCategoryList(res.data)
    })
  }, [])
  
  const COLUMNS = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 145,
    },
    {
      title: 'Cover',
      dataIndex: 'cover',
      key: 'cover',
      width: 120,
      render: (text: string) => {
        return (
        <Image 
          width={50}
          src={text}
          alt=''
        />
        )
      }
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: 120,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (text: CategoryType) => {
        return text?.name;
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
      render: (text: string) => {
        return (
          <Tooltip title={text} placement="topLeft">
            {text}
          </Tooltip>
        )
      }
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
    },
    {
      title: 'Creation Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
            <Button type="link" onClick={() => {
              handleBookEdit(row._id)
            }}
          >
          edit</Button>
            <Button type="link" onClick={() => {
              handleBookDelete(row._id)
            }} 
            danger
          >
          delete</Button>
          </Space>
        </>
  
    }
  ]
  const handleSearchFinish = async (values: BookQueryType) => {
    const res = await getBookList({...values, current: 1, pageSize: pagination.pageSize})
    console.log(res);
    setData(res.data);
    setPagination({...pagination, current: 1, total: res.total})
  }
  const handleSearchReset = () => {
    console.log(form);
    form.resetFields();
  }

  const handleBookEdit = (id: string) => {
    router.push(`/book/edit/${id}`)
  }
  
  const handleBookDelete = async (id: string) => {
    await bookDelete(id);
    message.success("Deleting Successful");
    fetchData(form.getFieldsValue());
  }

  const handleTableChange = async (pagination: TablePaginationConfig) => {
    console.log(pagination);
    setPagination((prev) => ({
      ...prev,
      current: pagination.current || prev.current, 
      pageSize: pagination.pageSize || prev.pageSize,
      total: pagination.total || prev.total,        
    }))
    const query = form.getFieldsValue();
    const res = await getBookList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    });
    setData(res.data);
  }

  return (
    <Content title="Book List" operation={<Button type="primary" onClick={() => {
      router.push("/book/add")
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
            <Form.Item name="author" label="Author" >
              <Input placeholder='please type in' allowClear/>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="category" label="Category" >
              <Select
                showSearch
                allowClear
                placeholder='please select'
                options={categoryList.map((item) => ({
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


export default Book;
