import {Button, Card, Form, Input, Popconfirm, Row, Select, Space, Table, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined, UserAddOutlined} from "@ant-design/icons";
import {PageContainer} from "@ant-design/pro-layout";
import SidebarPhanQuyenUser, {RefType} from "@/pages/permission/user/sidebar-phan-quyen-user";
import {useEffect, useRef, useState} from "react";
import HcmaSelect from "@/components/HcmaSelect";
import {useModel} from "@@/exports";
import {getAllZtbMapCqtDto} from "@/services/apis/ztbMapCqtController";

export default function ManageUser() {
    const createSideBarRef = useRef<RefType>();
    const [form] = Form.useForm();
    const {listTblUsers, loadData} = useModel('tbl-user');
    const [dmChicucthue, setdmChicucThue] = useState<API.ZtbMapCqtDTO[]>([]);
    const [applicationList, setApplicationList] = useState<API.TblUsersDTO[]>([]);

    useEffect(() => {
        loadData(applicationList)
    }, [open])

    useEffect(() => {
        getAllZtbMapCqtDto({page: 0, size: 0}, {}).then(resp => setdmChicucThue(resp))
    }, [])
    // column table
    const columns = [
        {
            title: "STT",
            dataIndex: 'stt',
            key: 'stt',
            render: (text: string, row: API.TblUsersDTO, index: number) => index + 1,
        },
        {
            title: "ID",
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: "Tên truy cập",
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: "Họ Và Tên",
            dataIndex: 'created',
            key: 'created',
        },
        {
            title: "Thao tác",
            dataIndex: 'id',
            key: 'id',
            render: (id: string, record: API.TblUsersDTO) =>
                <Space>
                    <Tooltip placement="top" title='Phân quyền'>
                        <Button onClick={() => createSideBarRef.current?.create(record)}
                                icon={<UserAddOutlined/>}>
                        </Button>
                    </Tooltip>
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
                            <Form.Item label={"Tổng cục thuế"} name={'tongCucThue'} style={{width: "350px"}} >
                                <HcmaSelect hcmaOptions={dmChicucthue} key={'maCqt'} hcmaLabel={'tenCqtNgan'}/>
                            </Form.Item>
                            <Form.Item label={"Cục thuế"} name={'cucThue'} style={{width: "350px"}} >
                                <HcmaSelect hcmaOptions={dmChicucthue} key={'maCqt'} hcmaLabel={'tenCqtNgan'}/>
                            </Form.Item>
                            <Form.Item label={"Chi cục thuế"} name={'chiCucThue'} style={{width: "350px"}} >
                                <HcmaSelect hcmaOptions={dmChicucthue} key={'maCqt'} hcmaLabel={'tenCqtNgan'}/>
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
                        </Space>
                        <Table
                            dataSource={listTblUsers}
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
