import {Button, Card, Form, Input, Popconfirm, Row, Select, Space, Table, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined, UserAddOutlined} from "@ant-design/icons";
import {PageContainer} from "@ant-design/pro-layout";
import SidebarPhanQuyenUser, {RefType} from "@/pages/permission/user/sidebar-phan-quyen-user";
import {useRef} from "react";
import HcmaSelect from "@/components/HcmaSelect";

export default function ManageUser() {
    const createSideBarRef = useRef<RefType>();
    const [form] = Form.useForm();

    const dataSource = [
        {
            key: '1',
            id: "23123123",
            tenTruyCap: "fixdata1",
            hoVaTen: "testthue1",
        },
        {
            key: '2',
            id: "id2312313",
            tenTruyCap: "fixdata2",
            hoVaTen: "testthue2",
        },
    ];
        const data = [{
            key: '1',
            value: "sadasdasdsad"
        },
            {
                key: '2',
                value: "sadasdabbbbbbsdsad"
            }]
    // column table
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
                    {/*    deleteRecord(id);*/}
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
            <PageContainer title={"Gán cơ quan thuế quản lý cho NSD"}>
                <div style={{marginTop: "10px"}}>
                    <Form
                        name="form-group-create"
                        form={form}
                        labelWrap
                        labelCol={{flex: '120px'}}
                        wrapperCol={{span: 16}}
                    >
                        <Row>
                            <Form.Item label={"Tổng cục thuế"} style={{width: "350px"}} >
                                <HcmaSelect hcmaOptions={data} key={'key'} hcmaLabel={'value'}/>
                            </Form.Item>
                            <Form.Item label={"Cục thuế"} style={{width: "350px"}} >
                                <HcmaSelect/>
                            </Form.Item>
                            <Form.Item label={"Chi cục thuế"} style={{width: "350px"}} >
                                <HcmaSelect />
                            </Form.Item>
                            <Form.Item label={""} style={{width: "250px", marginLeft: "100px"}} >
                                <Input placeholder="ID or Họ và Tên" />
                            </Form.Item>
                            <Button type="primary" style={{marginLeft: "10px"}} icon={<SearchOutlined />} >Tìm Kiếm</Button>
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

            <SidebarPhanQuyenUser ref={createSideBarRef}/>

        </>
    )
}
