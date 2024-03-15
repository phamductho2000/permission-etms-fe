import {useCallback, useState} from "react";
import {getAllAdminRoleFunction} from "@/services/apis/adminRoleFunctionController";
import {getAllTblUsers, updateRoleAdminUserDto} from "@/services/apis/tblUsersController";
import {updateRoleAdminUserDto1} from "@/services/apis/adminRoleUserController";
import {addOrUpdateToDataSource} from "@/utils/dataUtil";

export default function tblUser () {
    const [listTblUsers, setlistTblUsers] = useState<API.TblUsersDTO[]>([]);
    const [total, setTotal] = useState<any>(10);
    const loadData = useCallback((pagination: PaginationType, body: API.TblUsersDTO) => {
        getAllTblUsers().then(resp => {
            setlistTblUsers(resp);
            setTotal(resp.total ?? null);
        })
    }, []);
    const updateTblUsers = useCallback((newRecord: API.TblUsersDTO, callback?: (success: boolean) => void) => {
        updateRoleAdminUserDto(newRecord).then(resp => {
            setlistTblUsers(prev => addOrUpdateToDataSource(prev, resp, 'id'));
            callback?.(resp.success ? resp.success : false)
        })
    }, []);

    return {listTblUsers, loadData, total,updateTblUsers}
}
