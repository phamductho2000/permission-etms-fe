import {useModel} from '@umijs/max';
import React, {useEffect, useRef, useState} from 'react';
import {flushSync} from 'react-dom';
import {getGlobalState} from '@/core/global.state';
import LoadingPage from '@/components/LoadingPage';
import {history} from '@@/exports';
import {Button, Card, Col, Form, Input, Row} from "antd";
import LogoLogin from "public/images/logo-login.jpg"

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
{/*<Row className={"login"}>*/}
{/*    <Col>*/}
        <div  className={"login"}>
            <Card className={"login-form"}>

                <h2 className={"text-center"}>Hệ thống Kho lưu trữ</h2>
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
        </div>

    {/*</Col>*/}
{/*    <Col>*/}
{/*        <img src={'https://hocvien.tiki.vn/wp-content/uploads/2021/11/online-tax-payment-concept.jpg'} width={"80%"} height={500} alt={""}/>*/}
{/*    </Col>*/}
{/*</Row>*/}

    </>
};

export default Login;
