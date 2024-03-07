import {DatePicker, DatePickerProps, Flex, Form, Input, Modal} from "antd";
import dayjs from "dayjs";
import React, {useEffect, useImperativeHandle, useState} from "react";

export type RefTypePTDT = {
    create: (isChild:boolean, pRecord?: API.DmPhuongThucDaoTaoDTO) => void,
    update: (pRecord: API.DmPhuongThucDaoTaoDTO, isView: boolean) => void,
}

const CreatFromGroup = React.forwardRef<RefTypePTDT, any>((props, ref) => {

    const [record, setRecord] = useState<[]>();
    const [form] = Form.useForm();
    const [isview, setisview] = useState<boolean>(false);



    // const handleClose = () => {
    //     setOpen(false);
    //     setRecord(undefined);
    //     setisview(false);
    //     form.resetFields();
    // }
    //
    //
    // useEffect(() => {
    //     if (open && !applicationList.length) {
    //         handleLoadApplicationList({});
    //     }
    // }, [open])
    //
    // useImperativeHandle(ref, () => {
    //         return {
    //             create(isChild: boolean, pRecord?: API.DmPhuongThucDaoTaoDTO) {
    //                 setOpen(true);
    //                 if (isChild && pRecord) {
    //                     form.setFieldsValue(pRecord);
    //                 } else {
    //                     form.setFieldsValue(pRecord);
    //                 }
    //             },
    //             update(pRecord: API.DmPhuongThucDaoTaoDTO, isView) {
    //                 setOpen(true);
    //                 form.setFieldsValue({
    //                     ...pRecord,
    //                     ngayCapNhat: dayjs(pRecord.ngayCapNhat),
    //                 });
    //                 setRecord(pRecord);
    //                 setOpen(true);
    //                 setisview(isView);
    //
    //             },
    //         };
    //     }, []
    // );


    // change time thay đôi
    const onChangedate: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };
    // const onFinish = () => {
    //     form.validateFields().then((formValue: API.DmPhuongThucDaoTaoDTO) => {
    //         if (record?.id) {
    //             const newRecord = {...record, ...formValue};
    //             updateRecord(newRecord, (success: boolean) => {
    //                 if (success) {
    //                     props.onReLoadList();
    //                     handleClose();
    //                     api['success']({message: 'Cập nhật thành công'});
    //                 }
    //             });
    //         } else {
    //             createRecord(formValue, (success: boolean) => {
    //                 if (success) {
    //                     props.onReLoadList();
    //                     handleClose();
    //                     api['success']({message: 'Thêm mới thành công'});
    //                 }
    //             });
    //         }
    //     });
    // }
    return (<>
        {/*{contextHolder}*/}
        <Modal open={open} onCancel={handleClose} onOk={onFinish} title={record?.id ? isview ? 'Thông tin chi tiết' : 'Cập nhật' : 'Tạo mới'}
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
                // form={form}
                // disabled={isview}
            >
                <Form.Item<API.DmPhuongThucDaoTaoDTO>
                    label="ID"
                    name="id"
                >
                    <Input />
                </Form.Item>

                <Form.Item<API.DmPhuongThucDaoTaoDTO>
                    label="Tên nhóm quyền "
                    name="tenNhomQuyen"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<API.DmPhuongThucDaoTaoDTO>
                    label="Ghi chú"
                    name="ghiChu"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<API.DmPhuongThucDaoTaoDTO>
                    label="Ngày cập nhật"
                    name="ngayCapNhat"
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
