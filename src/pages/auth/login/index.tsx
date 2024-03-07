import {useModel} from '@umijs/max';
import React, {useEffect, useRef, useState} from 'react';
import {flushSync} from 'react-dom';
import {getGlobalState} from '@/core/global.state';
import LoadingPage from '@/components/LoadingPage';
import {history} from '@@/exports';
import {Button, Card, Form, Input} from "antd";

const Login: React.FC = () => {
    const {initialState, setInitialState} = useModel('@@initialState');
    const [form] = Form.useForm();
    const [loggingType, setLoggingType] = useState<'LOGGING' | 'CHOOSE_CSDT' | 'ERROR'>('LOGGING');
    const redirectUrl = () => {
        if (!history) return;
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
    }

    const fetchUserInfo = async () => {
        // setLoggingType("LOGGING");
        // getGlobalState().then(({currentUser, globalState}) => {
        //     if (currentUser) {
        //         flushSync(() => {
        //             setInitialState((s) => ({
        //                 ...s,
        //                 currentUser,
        //                 globalState
        //             }));
        //         });
        //     }
        //     if(globalState) {
        //         redirectUrl();
        //     } else {
        //         setLoggingType('CHOOSE_CSDT');
        //     }
        // }).catch(() => {
        //     setTimeout(() => {
        //         setLoggingType('ERROR')
        //     }, 2000);
        // });
    };

    useEffect(() => {
        if (initialState?.currentUser) {
            // nếu đã đăng nhập thì chuyển hướng
            redirectUrl();
        } else {
            // nếu chưa đăng nhập thì request đăng nhập
            fetchUserInfo();
        }
    }, [initialState]);

    const onLogin = () => {
        form.validateFields().then(formValue => {
            redirectUrl();
        })
    }

    return <>
        {/*{loggingType === 'LOGGING' && <LoadingPage message='Đăng nhập hệ thống...'/>}*/}
        {/*{loggingType === 'ERROR' && <LoadingPage loading={false} message='Có lỗi xảy ra trong quá trình đăng nhập'*/}
        {/*                                          action={<Button onClick={fetchUserInfo}>Thử lại</Button>}/>}*/}
        {/*<ChooseCSDT ref={chooseCSDTRef}/>*/}
            <Card className={"login"}>
                <h2 className={"text-center"}>Đăng nhập</h2>
                <Form layout={"vertical"} onFinish={onLogin}>
                    <Form.Item name={"username"} label={"Tên đăng nhập"} required>
                        <Input size={"large"}></Input>
                    </Form.Item>
                    <Form.Item name={"password"} label={"Mật khẩu"} required>
                        <Input size={"large"}></Input>
                    </Form.Item>
                    <Button type={'primary'} className={"w-full"} size={"large"}>Đăng nhập</Button>
                </Form>
            </Card>
    </>
};

export default Login;
