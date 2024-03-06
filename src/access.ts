/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: any) {
    const {globalState, currentUser} = initialState ?? {};
    const roleAccess: string[] = globalState?.roleAccess ?? [];
    return {
        canAccessMenu: (menu: any) => {
            const key = (typeof menu === 'string' || menu instanceof String) ? menu : (menu.code || menu.name).replaceAll('-', '_').toUpperCase();
            return !!currentUser && roleAccess?.some((rd) => rd === key);
            // return true;
        },
        canAccess: (key: string) => currentUser && roleAccess?.some((rd) => rd === key),
    };
}
