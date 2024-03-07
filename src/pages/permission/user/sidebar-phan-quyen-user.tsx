import React, {useImperativeHandle, useState} from "react";
import {Button, Drawer, Flex, Form, Row, Table} from "antd";
import Search from "antd/es/input/Search";

export type RefType = {
    create: () => void,
    // update: (pRecord: API.QthtNhomDTO, isView: boolean) => void
}
const SidebarPhanQuyenUser = React.forwardRef<RefType, any>((props, ref) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    useImperativeHandle(ref, () => {
        return {
            create() {
                showDrawer();
                // setRecord(pRecord);
            },
            update(pRecord: API.QthtNhomDTO, isView: boolean) {
                // setRecord(pRecord);
                // form.setFieldsValue(pRecord);
                // setOpen(true);
                // setIsView(isView);
            },
        };
    }, []);

    const data = [
        {
            key: '1',
            maCqt: "sdasdgajhgdaj",
            tenTruyCap: "dcmđâsdasdasmmm",
            hoVaTen: "canhdadasjdaj",
        },
        {
            key: '2',
            maCqt: "sdasdgajhgdaj",
            tenTruyCap: "dcsdasdasdasdmmmm",
            hoVaTen: "5464665",
        },
    ]
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };


    const columns = [
        // {
        //     title: intl.formatMessage({id: 'pages.category.group.table.orderNo', defaultMessage: 'STT'}),
        //     dataIndex: 'orderNo',
        //     key: 'orderNo',
        //     render: (text: string, row: API.QthtTaikhoanDTO, index: number) => index + 1,
        // },
        {
            title: "ID",
            dataIndex: 'maCqt',
            key: 'maCqt',
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
            title: "Cơ quan thuế",
            dataIndex: 'coQuanThue',
            key: 'coQuanThue',
        },
    ]
    return (
        <>
            <Drawer
                title="Phân quyền Gán cơ quan thuế quản lý cho NSD"
                width={"40%"}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                // extra={
                //     <Space>
                //         <Button onClick={onClose}>Làm mới</Button>
                //         <Button onClick={onFinish} type="primary">
                //             Lưu
                //         </Button>
                //     </Space>
                // }
            >
                <Form
                    name="form-group-create"
                    form={form}
                    labelWrap
                    labelCol={{flex: "150px"}}
                >

                    <Row>
                        <Flex justify={"space-between"} gap={"large"}>
                            <Search placeholder="Nhập tên người dùng"  enterButton />
                            <Button type="primary" >
                                Lưu
                            </Button>
                        </Flex>
                    </Row>
                </Form>

                <Table
                    rowSelection={rowSelection}
                    dataSource={data}
                    columns={columns}
                    style={{marginTop: 14}}
                    // pagination={pagination}
                    rowKey="id"
                />
            </Drawer>
        </>
    );
})
export default SidebarPhanQuyenUser;
