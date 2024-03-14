import {useCallback, useState} from "react";
import {getAllAdminRoleFunction} from "@/services/apis/adminRoleFunctionController";
import {getAllAdminFunc} from "@/services/apis/adminFunctionApi";

export default function AdminFunciton () {
    const [listAdminFunc, setlistAdminFunc] = useState<API.AdminFuncDTO[]>([]);
    const [total, setTotal] = useState<any>(10);
    const loadData = useCallback((pagination: PaginationType, body: API.AdminFuncDTO) => {
        getAllAdminFunc().then(resp => {
            setlistAdminFunc(resp);
            setTotal(resp.total ?? null);
        })
    }, []);

    return {listAdminFunc, loadData, total}
}