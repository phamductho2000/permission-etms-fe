import {Button, Card, Col, Form, Input, Popconfirm, Row, Space, Table, Tooltip} from "antd";
import access from "@/access";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    ReloadOutlined,
    SearchOutlined,
    UserAddOutlined
} from "@ant-design/icons";
import {PageContainer} from "@ant-design/pro-layout";
import SidebarPhanQuyenUseData, {RefType} from "@/pages/permission/use-data/sidebar-phan-quyen-use-data";
import {useRef} from "react";

export default function ManageUseData() {
    const createSideBarRef = useRef<RefType>();

    const [form] = Form.useForm();

    // column table
    const dataSource = [
        {
            key: '1',
            id: "23123123",
            name: '212121',
            tenTruyCap: "fixdata1",
            hoVaTen: "testthue1",
            tenCqt: '10 Downing Street',
        },
        {
            key: '2',
            id: "id2312313",
            name: '121212',
            tenTruyCap: "fixdata2",
            hoVaTen: "testthue2",
            tenCqt: '10 Downing Street',
        },
    ];

    const columns = [
        {
            title: "STT",
            dataIndex: 'stt',
            key: 'stt',
            // render: (text: string, row: API.DmPhuongThucDaoTaoDTO, index: number) => index + 1,
        },
        {
            title: "ID",
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: "Tên truy cập",
            dataIndex: 'tenTruyCap',
            key: 'tenTruyCap',
        },
        {
            title: "Họ Và Tên",
            dataIndex: 'hoVaTen',
            key: 'hoVaTen',
        },
        {
            title: "Tên CQT",
            dataIndex: 'tenCqt',
            key: 'tenCqt',
        },
        {
            title: "Thao tác",
            dataIndex: 'id',
            key: 'id',
            render: (id: string, record: API.DmPhuongThucDaoTaoDTO) =>
                <Space>
                    <Tooltip placement="top" title='Xem'>
                        <Button onClick={() => createSideBarRef.current?.update(record, true)}
                                icon={<EyeOutlined/>}>
                        </Button>
                    </Tooltip>

                    <Tooltip placement="top" title='Sửa'>
                        <Button onClick={() => createSideBarRef.current?.update(record, false)}
                                icon={<EditOutlined/>}></Button>
                    </Tooltip>
                    <Tooltip placement="top" title='Phân quyền'>
                        <Button onClick={() => createSideBarRef.current?.create()}
                                icon={<UserAddOutlined/>}>
                        </Button>
                    </Tooltip>
                    {/*<Popconfirm*/}
                    {/*    placement="top"*/}
                    {/*    title={"Xóa"}*/}
                    {/*    description={"Bạn có chắc chắn muốn xóa bản ghi này?"}*/}
                    {/*    okText="Đồng ý"*/}
                    {/*    cancelText="Hủy" onConfirm={() => {*/}
                    {/*    // deleteRecord(id);*/}
                    {/*}}*/}
                    {/*>*/}
                    {/*    <Tooltip title={intl.formatMessage({*/}
                    {/*        id: 'pages.category.group.deleteMessage',*/}
                    {/*        defaultMessage: 'Xóa bản ghi'*/}
                    {/*    })}><Button danger icon={<DeleteOutlined/>}></Button></Tooltip>*/}
                    {/*</Popconfirm>*/}
                </Space>
        },
    ]
    return (<>
            <PageContainer title={"Phân quyền sử dụng dữ liệu"}>
                <div style={{marginTop: "10px"}}>
                    <Form
                        name="form-group-create"
                        form={form}
                        labelWrap
                        labelCol={{span: 4}}
                        wrapperCol={{span: 16}}
                    >
                        <Row>
                            <Form.Item label={""} style={{width: "350px"}} >
                                <Input placeholder="ID or Họ và Tên"/>
                            </Form.Item>
                            <Button type="primary" style={{marginLeft: "-80px"}} icon={<SearchOutlined />} >Tìm Kiếm</Button>
                        </Row>
                    </Form>
                </div>
                <div>
                    <Card>
                        <Space>
                            {/*<Button type='primary' onClick={() => createFormRef.current?.create(false)}>Thêm mới</Button>*/}
                            {/*<Button icon={<ReloadOutlined/>} onClick={handleLoadData}></Button>*/}
                        </Space>
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            style={{marginTop: 14}}
                            // pagination={{...paginationProps, total: total}}
                            rowKey={"ma"}
                        />
                    </Card>
                </div>
            </PageContainer>

            <SidebarPhanQuyenUseData ref={createSideBarRef}/>

        </>
    )
}
