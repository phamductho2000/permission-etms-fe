import {useEffect, useState} from "react";
import {Button, Flex, Form, notification, Table} from "antd";
import Search from "antd/es/input/Search";
import {useModel} from "@@/exports";
import {getAllAdminRoleFunction} from "@/services/apis/adminRoleFunctionController";
import {findAllUserAdminByGroupId, getAllAdminRoleUser} from "@/services/apis/adminRoleUserController";
import {usePagination} from "ahooks";

export default function TabQuyenNguoiDung ({open, record}: any) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [applicationList, setApplicationList] = useState<API.TblUsersDTO[]>([]);
    const {listTblUsers, loadData,  getAll} = useModel('tbl-user');
    const {updateadRoleAdmiUserDto} = useModel('admin-role-user');
    const [listUser, setListUser] = useState<API.AdminRoleUserDTO[]>();
    const [api, contextHolder] = notification.useNotification();
    const [listAdminRoleUser, setAdminRoleUser] = useState<API.AdminRoleUserDTO[]>()
    const [total, setTotal] = useState<any>();
    const {paginationQuery, paginationProps, onChangePagination} = usePagination({sort: 'taiKhoan,ASC'});
    const [form] = Form.useForm();
    const [inputSearch, setInputSearch] = useState<string>();


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const handleLoadData = (formValue?: API.TblUsersDTO|null) => {
        if (formValue) {
            loadData(paginationQuery, formValue);
        } else {
            form.validateFields().then((formValue: API.TblUsersDTO) => {
                loadData(paginationQuery, formValue);
                console.log('formvalue', formValue)
            })
        }
    };


    useEffect(() => {
        getAll(applicationList)
    }, [open])

    const handleFindAllUserByGroupId = (body: API.AdminRoleDTO) => {
        // lấy ra findbyid của userrole
        findAllUserAdminByGroupId(body).then((resp: any) => {
            setListUser(resp);
        })
    }

    useEffect(() => {
        if (open && record) {
            handleFindAllUser({});
            handleFindAllUserByGroupId(record as API.AdminRoleDTO);
        }
    }, [open, record])

    useEffect(() => {
        // set lại nút checkbox theo funcID
        if (listUser) {
            const keys = listUser.map(item => item?.userId);
            setSelectedRowKeys(keys as React.Key[]);
            console.log('ListUser', listUser);
        }
    }, [listUser])

    const pagination = {
        ...paginationProps,
        total,
        onChange: onChangePagination
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
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
            title: "Chức năng",
            dataIndex: 'username',
            key: 'username',
        },
    ]

    const handleFindAllUser = (body?: any) => {
        getAllAdminRoleUser().then(resp => {
            setAdminRoleUser(resp as API.AdminRoleUserDTO[]);
            setTotal(resp?.total);
        })
    }
    function onSave() {
        console.log('listSelected', selectedRowKeys);
        if (selectedRowKeys.length > 0) {
            const newdata =[]
            selectedRowKeys.forEach(e => {
                const data = {userId: e}
                console.log('e', data);
                newdata.push(data)

                console.log('newdata', newdata);
            })
            const body: API.AdminRoleUserDTO = {
                roleId: record?.roleId,
                tblUsersDTOS: newdata
            }
            console.log('record', record);
            updateadRoleAdmiUserDto(body, (success: boolean) => {
                if (success) {
                    handleFindAllUser({});
                    api['success']({message: 'Cập nhật thành công'});


                }
            });
        } else {
            api['error']({message: 'Vui lòng chọn ít nhất một người dùng'});
        }
    }

    return (
        <>
            {contextHolder}
            <Flex justify={"space-between"} gap={"large"}>
                <Search placeholder="Chức Năng"
                        onSearch={(e) => handleLoadData({username: e})}
                        onChange={(e) => setInputSearch(e.target.value)}
                        enterButton />
                <Button type="primary" onClick={onSave} >
                    Lưu
                </Button>
            </Flex>

            <Table
                rowSelection={rowSelection}
                dataSource={listTblUsers}
                columns={columns}
                style={{marginTop: 14}}
                pagination={pagination}
                rowKey="userId"
            />
        </>
    )

}
