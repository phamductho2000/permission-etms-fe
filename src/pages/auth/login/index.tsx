import {useModel} from '@umijs/max';
import React, {useEffect, useRef, useState} from 'react';
import {flushSync} from 'react-dom';
import {getGlobalState} from '@/core/global.state';
import LoadingPage from '@/components/LoadingPage';
import {history} from '@@/exports';
import {Button} from "antd";

const Login: React.FC = () => {
    const {initialState, setInitialState} = useModel('@@initialState');
    const [loggingType, setLoggingType] = useState<'LOGGING' | 'CHOOSE_CSDT' | 'ERROR'>('LOGGING');
    const redirectUrl = () => {
        if (!history) return;
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
    }

    const fetchUserInfo = async () => {
        setLoggingType("LOGGING");
        getGlobalState().then(({currentUser, globalState}) => {
            if (currentUser) {
                flushSync(() => {
                    setInitialState((s) => ({
                        ...s,
                        currentUser,
                        globalState
                    }));
                });
            }
            if(globalState) {
                redirectUrl();
            } else {
                setLoggingType('CHOOSE_CSDT');
            }
        }).catch(() => {
            setTimeout(() => {
                setLoggingType('ERROR')
            }, 2000);
        });
    };

    useEffect(() => {
        // if (initialState?.currentUser) {
        //     if (initialState?.currentUser?.idCoSoDaoTao) {
        //         // nếu đã đăng nhập thì chuyển hướng
        //         redirectUrl();
        //     } else {
        //         setLoggingType('CHOOSE_CSDT');
        //         chooseCSDTRef.current?.open(() => fetchUserInfo());
        //     }
        // } else {
        //     // nếu chưa đăng nhập thì request đăng nhập
        //     fetchUserInfo();
        // }
    }, [initialState]);
    return <>
        {loggingType === 'LOGGING' && <LoadingPage message='Đăng nhập hệ thống...'/>}
        {loggingType === 'ERROR' && <LoadingPage loading={false} message='Có lỗi xảy ra trong quá trình đăng nhập'
                                                  action={<Button onClick={fetchUserInfo}>Thử lại</Button>}/>}
        {/*<ChooseCSDT ref={chooseCSDTRef}/>*/}
    </>
};

export default Login;
