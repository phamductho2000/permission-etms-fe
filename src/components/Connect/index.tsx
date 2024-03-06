import { Button, Result, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

export let setIsDisconnect: any = undefined;
const Connect = ({ children }: { children: any }) => {
    const [disconnect, setDisconnect] = useState<boolean>(false);
    const [connecting, setConnecting] = useState<boolean>(false);
    // const { initialState } = useModel('@@initialState');

    const onTestConnect = () => {
        if (!connecting) {
            setConnecting(true);
            // healthApi.checkHealth()
            //     .then(resp => {
            //         if (resp.status === 200) {
            //             if (initialState?.globalState) {
            //                 setDisconnect(false);
            //             } else {
            //                 window.location.reload();
            //             }
            //         }
            //     })
            //     .catch(e => {
            //         setTimeout(() => {
            //             setConnecting(false)
            //         }, 2000)
            //     })
        }
    }

    const onDisconnect = () => {
        if (!disconnect) {
            setDisconnect(true);
            onTestConnect();
        }
    }

    useEffect(() => {
        setIsDisconnect = onDisconnect;
    }, []);

    return (
        <>
            {disconnect && <Result
                status="500"
                title="500"
                subTitle="Không thể kết nối tới máy chủ"
                extra={
                    connecting ? <Spin spinning={true} /> :
                        <Button type="primary" onClick={onTestConnect}>
                            Thử lại
                        </Button>
                }
            />}
            <div hidden={disconnect} style={{ height: '100%' }}>{children}</div>
        </>
    );
};

export default Connect;
