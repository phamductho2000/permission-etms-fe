import {Button, Card, Form, Input, Row, Space, Table, Tooltip} from "antd";
import {SearchOutlined, UserAddOutlined} from "@ant-design/icons";
import {PageContainer} from "@ant-design/pro-layout";
import SidebarPhanQuyenUseData, {RefType} from "@/pages/permission/use-data/sidebar-phan-quyen-use-data";
import {useEffect, useRef, useState} from "react";
import {useModel} from "@umijs/max";

export default function ManageUseData() {
    const createSideBarRef = useRef<RefType>();
    const {listUserRole, loadData} = useModel('user-role')
    const [applicationList, setApplicationList] = useState<API.UserRoleDTO[]>([]);

    const [form] = Form.useForm();

    useEffect(() => {
        loadData(applicationList)
    }, [open]);
    const columns = [
        {
            title: "STT",
            dataIndex: 'stt',
            key: 'stt',
            render: (text: string, row: API.UserRoleDTO, index: number) => index + 1,
        },
        {
            title: "ID",
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: "Tài khoản",
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: "Họ Và Tên",
            dataIndex: 'createdBy',
            key: 'createdBy',
        },
        // {
        //     title: "Tên CQT",
        //     dataIndex: 'areaCode',
        //     key: 'areaCode',
        // },
        {
            title: "Thao tác",
            dataIndex: 'id',
            key: 'id',
            render: (id: string, record: API.UserRoleDTO) =>
                <Space>
                    {/*<Tooltip placement="top" title='Xem'>*/}
                    {/*    <Button onClick={() => createSideBarRef.current?.update(record, true)}*/}
                    {/*            icon={<EyeOutlined/>}>*/}
                    {/*    </Button>*/}
                    {/*</Tooltip>*/}

                    {/*<Tooltip placement="top" title='Sửa'>*/}
                    {/*    <Button onClick={() => createSideBarRef.current?.update(record, false)}*/}
                    {/*            icon={<EditOutlined/>}></Button>*/}
                    {/*</Tooltip>*/}
                    <Tooltip placement="top" title='Phân quyền'>
                        <Button onClick={() => createSideBarRef.current?.create(record)}
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
                            dataSource={listUserRole}
                            columns={columns}
                            style={{marginTop: 14}}
                            // pagination={{...paginationProps, total: total}}
                            rowKey={"id"}
                        />
                    </Card>
                </div>
            </PageContainer>

            <SidebarPhanQuyenUseData ref={createSideBarRef}/>

        </>
    )
}
