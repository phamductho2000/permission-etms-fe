import {useState} from "react";
import {Button, Flex, Table} from "antd";

export default function TabQuyenNguoiDung ({open, record}: any) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };


    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const data = [
        {
            key: '1',
            id: "316531531765",
            chucNang: "bbbbbbbbbbbbbbb",
        },
        {
            key: '2',
            id: "aaaaaaaaaaaaaaaaaaa",
            chucNang: "xxxxxxxxxxxxxx",
        },
    ]
    const columns = [
        // {
        //     title: intl.formatMessage({id: 'pages.category.group.table.orderNo', defaultMessage: 'STT'}),
        //     dataIndex: 'orderNo',
        //     key: 'orderNo',
        //     render: (text: string, row: API.QthtTaikhoanDTO, index: number) => index + 1,
        // },
        {
            title: "ID",
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: "Chức năng",
            dataIndex: 'chucNang',
            key: 'chucNang',
        },
    ]

    return (
        <>
            <Flex justify={"space-between"} gap={"large"}>
                {/*<Search placeholder="Nhập tên người dùng"  enterButton />*/}
                {/*<Button type="primary" onClick={() => createFormRef.current?.create()}>*/}
                {/*    Thêm mới*/}
                {/*</Button>*/}
                <Button type="primary" >
                    Lưu
                </Button>
            </Flex>

            <Table
                rowSelection={rowSelection}
                dataSource={data}
                columns={columns}
                style={{marginTop: 14}}
                // pagination={pagination}
                rowKey="id"
            />
            {/*<CreateFormTaiKhoan ref={createFormRef} onReLoadList={handleFindAllUser}/>*/}
        </>
    )

}
