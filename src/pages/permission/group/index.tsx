import {Button, Card, Form, Input, Popconfirm, Row, Space, Table, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined, UserAddOutlined} from "@ant-design/icons";
import {PageContainer} from "@ant-design/pro-layout";
import {useRef} from "react";
import SidebarPhanQuyenGroup, {RefType} from "@/pages/permission/group/sidebar-phan-quyen-group";

export default function ManageGroup() {
    const createSideBarRef = useRef<RefType>();
    const [form] = Form.useForm();

    const dataSource = [
        {
            key: '1',
            id: "23123123",
            tenNhomQuyen: "fixdata1",
            ghiChu: "testthue1",
        },
        {
            key: '2',
            id: "id2312313",
            tenNhomQuyen: "fixdata2",
            ghiChu: "testthue2",
        },
    ];
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
            title: "Tên nhóm quyền",
            dataIndex: 'tenNhomQuyen',
            key: 'tenNhomQuyen',
        },
        {
            title: "Ghi chú",
            dataIndex: 'ghiChu',
            key: 'ghiChu',
        },
        {
            title: "Ngày cập nhật",
            dataIndex: 'ngayCapNhat',
            key: 'ngayCapNhat',
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
                    <Popconfirm
                        placement="top"
                        title={"Xóa"}
                        description={"Bạn có chắc chắn muốn xóa bản ghi này?"}
                        okText="Đồng ý"
                        cancelText="Hủy" onConfirm={() => {
                        // deleteRecord(id);
                    }}
                    >
                        <Tooltip title={"xóa bản ghi"}><Button danger icon={<DeleteOutlined/>}></Button></Tooltip>
                    </Popconfirm>
                </Space>
        },
    ]
    return (<>
            <PageContainer title={"Quản lý nhóm quyền"}>
                <div style={{marginTop: "10px"}}>
                    <Form
                        name="form-group-create"
                        form={form}
                        labelWrap
                        labelCol={{span: 4}}
                        wrapperCol={{span: 16}}
                    >
                        {/*<Row>*/}
                        {/*    <Form.Item label={""} style={{width: "350px"}} >*/}
                        {/*        <Input placeholder="ID or Họ và Tên"/>*/}
                        {/*    </Form.Item>*/}
                        {/*    <Button type="primary" style={{marginLeft: "-80px"}} icon={<SearchOutlined />} >Tìm Kiếm</Button>*/}
                        {/*</Row>*/}
                    </Form>
                </div>
                <div>
                    <Card>
                        <Space>
                            <Button type='primary' onClick={() => createFormRef.current?.create(false)}>Thêm mới</Button>
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
            <SidebarPhanQuyenGroup ref={createSideBarRef}/>

        </>
    )
}
