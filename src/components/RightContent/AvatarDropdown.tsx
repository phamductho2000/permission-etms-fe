import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {history, useModel} from '@umijs/max';
import {Spin} from 'antd';
import {createStyles} from 'antd-style';
import {stringify} from 'querystring';
import type {MenuInfo} from 'rc-menu/lib/interface';
import React, {useCallback, useRef} from 'react';
import {flushSync} from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import {LOGIN_PATH} from '@/core/constant';
import {getPathname} from "@/utils";
import {useIntl} from "@@/exports";

export type GlobalHeaderRightProps = {
    menu?: boolean;
    children?: React.ReactNode;
};

export const AvatarName = () => {
    const {initialState} = useModel('@@initialState');
    const {currentUser} = initialState || {};
    return <span className="anticon">{currentUser?.username}</span>;
};

const useStyles = createStyles(({token}) => {
    return {
        action: {
            display: 'flex',
            height: '48px',
            marginLeft: 'auto',
            overflow: 'hidden',
            alignItems: 'center',
            padding: '0 8px',
            cursor: 'pointer',
            borderRadius: token.borderRadius,
            '&:hover': {
                backgroundColor: token.colorBgTextHover,
            },
        },
    };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({menu, children}) => {
    const intl = useIntl();
    const loginOut = async () => {
        // await outLogin();
        const pathname = getPathname()
        const {search} = window.location;
        const urlParams = new URL(window.location.href).searchParams;
        const redirect = urlParams.get('redirect');
        // Note: There may be security issues, please note
        if (window.location.pathname !== LOGIN_PATH && !redirect) {
            history.replace({
                pathname: LOGIN_PATH,
                search: stringify({
                    redirect: pathname + search,
                }),
            });
        }
    };
    const {styles} = useStyles();

    const {initialState, setInitialState} = useModel('@@initialState');

    const onMenuClick = useCallback(
        (event: MenuInfo) => {
            const {key} = event;
            if (key === 'logout') {
                flushSync(() => {
                    setInitialState((s) => ({...s, currentUser: undefined}));
                });
                loginOut();
                return;
            }
            if (key === 'change-csdt') {
                chooseCSDT.current?.open(() => window.location.reload());
                return;
            }
            history.push(`/account/${key}`);
        },
        [setInitialState],
    );

    const loading = (
        <span className={styles.action}>
      <Spin
          size="small"
          style={{
              marginLeft: 8,
              marginRight: 8,
          }}
      />
    </span>
    );

    if (!initialState) {
        return loading;
    }

    const {currentUser} = initialState;

    if (!currentUser || !currentUser.username) {
        return loading;
    }

    const menuItems = [
        ...(menu
            ? [
                // {
                //     key: 'center',
                //     icon: <UserOutlined/>,
                //     label: '个人中心',
                // },
                {
                    key: 'change-csdt',
                    icon: <SettingOutlined/>,
                    label: intl.formatMessage({id: 'app.header.menu.change-csdt', defaultMessage: 'Thay đổi Cơ sở đào tạo'}),
                },
                {
                    type: 'divider' as const,
                },
            ]
            : []),
        {
            key: 'logout',
            icon: <LogoutOutlined/>,
            label: intl.formatMessage({id: 'app.header.menu.logout', defaultMessage: 'Logout'}),
        },
    ];

    return (
        <>
            <HeaderDropdown
                menu={{
                    selectedKeys: [],
                    onClick: onMenuClick,
                    items: menuItems,
                }}
            >
                {children}
            </HeaderDropdown>
        </>
    );
};
