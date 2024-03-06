import {Button, Table, Typography} from "antd";
import {EditableCell, EditableRow} from "@/components/TableEditable/editable";
import React, {useEffect, useMemo, useRef} from "react";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {v1 as uuid, v4} from "uuid";
import './style.css';
import {deleteItemFromTree, flatToTree, treeToFlat} from "@/utils/treeUtil";
import {
    ColumnTypes,
    EditableColumnsType,
    TableEditableContextProps,
    TableEditableProps
} from "./editable.type";
import {useTableEditableHandleEvent} from "@/components/TableEditable/editable.event";

const {Text} = Typography;

export const TableEditableContext = React.createContext<TableEditableContextProps | null>(null);
const TableEditable: React.FC<TableEditableProps> = (props: TableEditableProps) => {
    const flatDataSource = useRef<any[]>([]);
    const tableId = useRef<string>(v4());

    const {cellEdited, cellsSelected} = useTableEditableHandleEvent(
        tableId.current,
        flatDataSource.current,
        props.columnsEditable,
        props.onChangeData,
        props.rowKey,
        props.parentKey
    );

    const dataSource = useMemo(() => {
        if (props.treeTable) {
            const dataTree: any[] = flatToTree(props.dataSource!, props.rowKey, props.parentKey);
            flatDataSource.current = treeToFlat(dataTree);
            return dataTree;
        } else {
            flatDataSource.current = [...props.dataSource ?? []];
            return props.dataSource;
        }
    }, [props.dataSource])
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const handleSave = (row: any) => {
        const newData = [...props.dataSource || []];
        const index = newData.findIndex(item => row[props.rowKey] === item[props.rowKey]);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
            children: undefined
        });
        props.onChangeData?.(newData);
    };

    const handleAdd = () => {
        props.onChangeData?.([...props.dataSource || [], {[props.rowKey]: uuid()}]);
    };

    const handleDelete = (key: string) => {
        if (props.treeTable) {
            const newTree = deleteItemFromTree(dataSource, key, props.rowKey);
            const newDataSource = treeToFlat(newTree);
            props.onChangeData?.(newDataSource);
        } else {
            const newDataSource = [...props.dataSource || []];
            const newContentList = newDataSource.filter(item => item[props.rowKey] !== key);
            props.onChangeData?.(newContentList);
        }
    };

    const realColumns: EditableColumnsType[] = useMemo(() => {
        const relVal = [...props.columnsEditable];
        if (props.showAdvancedAction) {
            relVal.push({
                dataIndex: props.rowKey,
                align: 'center',
                width: '60px',
                key: 'deleteColumn',
                title: '',
                // title: <Button size='small' className='text-green-800' onClick={handleAdd} icon={<PlusCircleOutlined/>}
                //                disabled={props.disabled}/>,
                render: (id: any) => <Button
                    className='btn-outline-danger'
                    size='small'
                    disabled={props.disabled}
                    onClick={() => handleDelete(id)}
                    icon={<DeleteOutlined className={'text-red-800'}/>}
                />
            })
        }
        return relVal;
    }, [props.showAdvancedAction, props.columnsEditable]);

    const columns = realColumns.map(col => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record: any) => ({
                record,
                ...col,
                dataSource: props.dataSource,
                handleSave: handleSave
            }),
        };
    });

    const expandable = {
        defaultExpandAllRows: true
    }
    const renderSummary = (pageData: any[], column: any[]) => {
        const dataTotal = column.map(c => {
            return {...c, total: 0}
        })
        pageData.forEach((d) => {
            dataTotal?.forEach(t => t.total += Number(d[t.dataIndex]) || 0)
        });
        return (
            <>
                <Table.Summary.Row>
                    {dataTotal.map((c, index) => {
                        if (c.isTitleSummary) {
                            return <Table.Summary.Cell key={index} index={index}>
                                <Text strong>Tổng cộng</Text>
                            </Table.Summary.Cell>
                        } else if (c.isSummary) {
                            return <Table.Summary.Cell key={index} index={index} align='right'>
                                {c.total ? c.total : ''}
                            </Table.Summary.Cell>
                        } else return <Table.Summary.Cell key={index} index={index}/>
                    })}
                </Table.Summary.Row>
            </>
        );
    }
    return <>
        <TableEditableContext.Provider
            value={{...props, cellEdited, cellsSelected, flatDataSource: flatDataSource.current}}>
            <Table
                id={tableId.current}
                className={'table-editable'}
                {...props}
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns as ColumnTypes}
                pagination={false}
                expandable={expandable}
                scroll={{x: true}}
                summary={props.showSummary ? (pageData) => renderSummary(pageData as any[], columns) : undefined}
            />
        </TableEditableContext.Provider>
        {props.showAdvancedAction && <Button
            type="text"
            onClick={handleAdd}
            className={'table-editable-add'}
            icon={<PlusOutlined/>}
        >
            Thêm dòng
        </Button>}
    </>

}
TableEditable.defaultProps = {
    rowKey: 'id',
    parentKey: 'parentId',
    dataSource: [],
    showAdvancedAction: false
}
export default TableEditable;
