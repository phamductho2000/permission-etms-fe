import {useCallback, useMemo, useRef, useState} from "react";
import {useSearchParams} from '@@/exports';
import {convertSearchParamsToObject} from "@/utils";
import {SorterResult} from "antd/es/table/interface";

const defaultState: PaginationType = {
    page: 1,
    size: 10,
    dontUseParam: false
}
const usePagination = (initialState?: PaginationType) => {
    const defaultPageSize = useRef<number>(10);
    const defaultSort = useRef<string | undefined>(initialState?.sort);
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);
    const initState = (): PaginationType => {
        const initValue: PaginationType = {
            page: initialState?.page ?? defaultState.page,
            size: initialState?.size ?? defaultState.size,
            sort: initialState?.sort
        };
        defaultPageSize.current = initValue.size!;

        if(!initialState?.dontUseParam) {
            const queryPage = searchParams.get('page');
            const querySize = searchParams.get('size');
            const querySort = searchParams.get('sort');

            if (queryPage) {
                initValue.page = +queryPage
            }
            if (querySize) {
                initValue.size = +querySize
            }
            if (querySort) {
                initValue.sort = querySort;
            }
        }
        return initValue;
    }
    const [pagination, setPagination] = useState<PaginationType>(initState());

    const onChangePagination = useCallback((page: number, size: number) => {
        setPagination(prev => {
            const newPagination: PaginationType = {...prev, page, size}

            if(!initialState?.dontUseParam) {
                const params = convertSearchParamsToObject(new URLSearchParams(window.location.search));
                if (newPagination.page !== 1) {
                    params['page'] = newPagination.page + "";
                } else {
                    searchParams.delete("page");
                    delete params['page'];
                }
                if (newPagination.size !== defaultPageSize.current) {
                    params['size'] = newPagination.size + "";
                } else {
                    delete params['size'];
                }

                setSearchParams(params)
            }
            return newPagination;
        })
    }, [])

    const onResetPage = useCallback(() => {
        setPagination(prev => {
            const newPagination: PaginationType = {...prev, page: 1}
            if(!initialState?.dontUseParam) {
                const params = convertSearchParamsToObject(new URLSearchParams(window.location.search));
                delete params['page'];
                delete params['size'];
                setSearchParams(params)
            }
            return newPagination;
        })
    }, [])

    const paginationQuery = useMemo(() => ({
        page: (pagination.page ?? 1) - 1,
        size: pagination.size,
        sort: pagination.sort ? pagination.sort : undefined
    }), [pagination]);

    const paginationProps = useMemo(() => ({
        current: pagination.page,
        pageSize: pagination.size,

        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: onChangePagination,
    }), [pagination]);

    const onChange = (pagination: any, filters: any, sorter: SorterResult<any> | SorterResult<any>[]) => {
        console.log(pagination, filters, sorter);
        setPagination(prev => {
            const firstSort: SorterResult<any> = sorter instanceof Array ? sorter[0] : sorter;
            const {field, columnKey, order} = firstSort;
            const columnName = columnKey ?? field;

            let sort = undefined;
            if(!initialState?.dontUseParam) {
                const params = convertSearchParamsToObject(new URLSearchParams(window.location.search));
                if (columnName) {
                    sort = `${columnName},${order === 'ascend' ? 'asc' : 'desc'}`;
                    if (field !== defaultSort.current) {
                        params['sort'] = sort;
                    } else {
                        delete params['sort'];
                    }
                } else {
                    delete params['sort'];
                }
                setSearchParams(params)
            } else {
                if (columnName) {
                    sort = `${columnName},${order === 'ascend' ? 'asc' : 'desc'}`;
                }
            }
            sort = sort ?? defaultSort.current;
            return {...prev, sort: sort}
        })
    }

    const tableProps = useCallback((total: number) => ({
        pagination: {
            current: pagination.page,
            pageSize: pagination.size,

            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: onChangePagination,
            total: total

        },
        onChange: onChange
    }), [pagination]);

    return {paginationQuery, onChangePagination, paginationProps, onResetPage, tableProps}
}
export default usePagination;
