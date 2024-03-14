import {useCallback, useState} from "react";
import {getAllAdminRoleFunction} from "@/services/apis/adminRoleFunctionController";
import {getAllTblUsers} from "@/services/apis/tblUsersController";

export default function tblUser () {
    const [listTblUsers, setlistTblUsers] = useState<API.TblUsersDTO[]>([]);
    const [total, setTotal] = useState<any>(10);
    const loadData = useCallback((pagination: PaginationType, body: API.TblUsersDTO) => {
        getAllTblUsers().then(resp => {
            setlistTblUsers(resp);
            setTotal(resp.total ?? null);
        })
    }, []);

    return {listTblUsers, loadData, total}
}
