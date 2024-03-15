import {DatePicker, DatePickerProps, Flex, Form, Input, Modal, notification} from "antd";
import dayjs from "dayjs";
import React, {useImperativeHandle, useState} from "react";
import {useModel} from "@@/exports";

export type RefTypeAdminRole = {
    create: () => void,
    update: (pRecord: API.AdminRoleDTO, isView: boolean) => void,
}

const CreatFromGroup = React.forwardRef<RefTypeAdminRole, any>((props, ref) => {
    const [record, setRecord] = useState<[]>();
    const [form] = Form.useForm();
    const [isview, setisview] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const {createadminrole,updateadminrole} = useModel('admin-role');
    const [api, contextHolder] = notification.useNotification();



    const handleClose = () => {
        setOpen(false);
        setRecord(undefined);
        setisview(false);
        form.resetFields();
    }

    useImperativeHandle(ref, () => {
            return {
                create(isChild: boolean, pRecord?: API.AdminRoleDTO) {
                    setOpen(true);
                    if (isChild && pRecord) {
                        form.setFieldsValue(pRecord);
                    } else {
                        form.setFieldsValue(pRecord);
                    }
                },
                update(pRecord: API.AdminRoleDTO, isView) {
                    setOpen(true);
                    form.setFieldsValue({
                        ...pRecord,
                        updatedDate: dayjs(pRecord.updatedDate),
                    });
                    setRecord(pRecord);
                    setOpen(true);
                    setisview(isView);

                },
            };
        }, []
    );


    // change time thay đôi
    const onChangedate: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };
    const onFinish = () => {
        form.validateFields().then((formValue: API.AdminRoleDTO) => {
            if (record) {
                const newRecord = {...record, ...formValue};
                updateadminrole(newRecord, (success: boolean) => {
                    if (success) {
                        props.onReLoadList();
                        handleClose();
                        api['success']({message: 'Cập nhật thành công'});
                    }
                });
            } else {
                createadminrole(formValue, (success: boolean) => {
                    if (success) {
                        props.onReLoadList();
                        handleClose();
                        api['success']({message: 'Thêm mới thành công'});
                    }
                });
            }
        });
    }
    return (<>
        {contextHolder}
        <Modal open={open} onCancel={handleClose} onOk={onFinish} title={record ? isview ? 'Thông tin chi tiết' : 'Cập nhật' : 'Tạo mới'}
               footer={(_, {OkBtn}) => (
                   isview ? <></> :
                       <Flex justify="flex-end">
                           <OkBtn/>
                       </Flex>
               )}
        >
            <Form
                name="form-group-create"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                form={form}
                disabled={isview}
            >
                <Form.Item<API.AdminRoleDTO>
                    label="ID"
                    name="roleId"
                >
                    <Input />
                </Form.Item>

                <Form.Item<API.AdminRoleDTO>
                    label="Tên nhóm quyền "
                    name="roleName"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<API.AdminRoleDTO>
                    label="Ghi chú"
                    name="note"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<API.AdminRoleDTO>
                    label="Ngày cập nhật"
                    name="updatedDate"
                    rules={[{ required: true }]}
                >
                    <DatePicker
                        onChange={onChangedate}/>
                </Form.Item>
            </Form>
        </Modal>
    </>);
});

export default CreatFromGroup;
