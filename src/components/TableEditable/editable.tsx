import {AutoComplete, Checkbox, Form, Input, InputNumber, Select, Table} from "antd";
import {FormInstance} from "antd/es/form";
import React, {memo, useContext, useEffect, useMemo, useRef} from "react";
import {formatInputNumber} from "@/core/constant";
import DateTime from "@/components/DateTime";
import {filterOption} from "@/utils";
import {CellIdType, EditableColumnsProps} from "./editable.type";
import {TableEditableContext} from "@/components/TableEditable/index";

interface EditableRowProps {
    index: number;
    id: string
}

const EditableContext = React.createContext<FormInstance<any> | null>(null);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const EditableRow: React.FC<EditableRowProps> = memo(({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} id={index + ''}/>
            </EditableContext.Provider>
        </Form>
    );
});
export const EditableCell: React.FC<EditableColumnsProps> = memo(({
                                                                      editable,
                                                                      children,
                                                                      dataIndex,
                                                                      record,
                                                                      handleSave,
                                                                      dataType,
                                                                      options,
                                                                      inputRender,
                                                                      dataSource,
                                                                      minWidth,
                                                                      ...restProps
                                                                  }) => {
    const inputRef = useRef<any>(null);
    const form = useContext(EditableContext)!;
    const tableProps = useContext(TableEditableContext)!;

    // cellId
    const cellId: CellIdType = useMemo(() => {
        const rowIndex = tableProps.flatDataSource?.findIndex((r: any) => r[tableProps.rowKey] === record?.[tableProps.rowKey]);
        const cellIndex = tableProps.columnsEditable.findIndex(c => c.dataIndex === dataIndex);
        return { _rowIndex: rowIndex, _rowId: record?.[tableProps.rowKey], _cellIndex: cellIndex, _cellName: dataIndex }
    }, [tableProps.flatDataSource, record])

    const editing = editable && tableProps.cellEdited?.x === cellId._rowIndex && tableProps.cellEdited?.y === cellId._cellIndex;
    const selected: boolean = useMemo(() => {
        if(!editable || !tableProps.cellsSelected) {
            return false;
        }
        const minX = Math.min(tableProps.cellsSelected.from.x, tableProps.cellsSelected.to.x);
        const maxX = Math.max(tableProps.cellsSelected.from.x, tableProps.cellsSelected.to.x);
        const minY = Math.min(tableProps.cellsSelected.from.y, tableProps.cellsSelected.to.y);
        const maxY = Math.max(tableProps.cellsSelected.from.y, tableProps.cellsSelected.to.y);

        return cellId._rowIndex >= minX && cellId._rowIndex <= maxX && cellId._cellIndex >= minY && cellId._cellIndex <= maxY
    }, [editable, tableProps.cellsSelected, cellId])

    useEffect(() => {
        if (editing) {
            if (!restProps.alwaysShowEdit && record) {
                let newValue = record[dataIndex];
                if (dataType !== 'checkbox' && dataType !== 'select' && tableProps.cellEdited?.action === 'keydown') {
                    console.log(isNaN(tableProps.cellEdited?.keydown));
                    if((dataType ==='number' || dataType === 'datetime') && isNaN(tableProps.cellEdited?.keydown)) {
                        // nếu là số hoặc ngày tháng mà nhập text thì bỏ qua
                    } else {
                        newValue = tableProps.cellEdited?.keydown;
                    }
                }
                form?.setFieldsValue({[dataIndex]: newValue});
            }
            setTimeout(function () {
                inputRef.current?.focus();
            }, 50);
        }
    }, [editing]);

    useEffect(() => {
        if (restProps?.alwaysShowEdit) {
            form.setFieldsValue({[dataIndex]: record?.[dataIndex]});
        }
    }, [record?.[dataIndex]]);

    const save = () => {
        form.validateFields().then(values => {
            const value = values[dataIndex];
            if (value !== record[dataIndex]) {
                handleSave?.({...record, [dataIndex]: value});
            }
        }).catch((e) => {
            console.log(e)
        });
    }

    let childNode = children;

    const onNextInput = (nextItem?: Element | null, self?: any, shiftKey?: boolean) => {
        if (nextItem) {
            const nextInputs = nextItem.getElementsByClassName('editable-cell-value-wrap');
            const nextInput = nextInputs && nextInputs[0];
            if (nextInput) {
                if (dataType !== 'checkbox') {
                    self?.click();
                } else {
                    // setEditing(false)
                }
                // @ts-ignore
                nextInput?.click();

            } else {
                const next2 = shiftKey ? nextItem.previousElementSibling : nextItem.nextElementSibling;
                if (next2) {
                    onNextInput(next2, self, shiftKey);
                } else {
                    const parentNodeNextItem = shiftKey ? nextItem?.parentElement?.previousElementSibling : nextItem?.parentElement?.nextElementSibling;
                    if (parentNodeNextItem) {
                        onNextInput(parentNodeNextItem, self, shiftKey);
                    }
                }
            }
        }
    }

    const onTab = (e: any) => {
        const self = document.activeElement;
        const item = self?.closest('.g-edit');
        if (e.shiftKey) {
            const prevItem = item?.previousElementSibling;
            onNextInput(prevItem, self, e.shiftKey);
        } else {
            const nextItem = item?.nextElementSibling;
            onNextInput(nextItem, self, e.shiftKey);
        }
    }

    const onKeyDown = (e: any) => {
        if (e.code === 'Tab' || e.code === 'Enter') {
            save();
            onTab(e);
        }
    }

    const onClickCheckbox = () => {
        save();
    }
    const onEnterCheckbox = (e: any) => {
        e.preventDefault();
        if (e.code === 'Enter') {
            form.setFieldsValue({[dataIndex]: !record[dataIndex]});
            save();
        } else if (e.code === 'Tab') {
            onTab(e);
        }
    }

    const onSelectAutocomplete = (_: string, option?: any) => {
        handleSave?.({...record, ...option})
    }

    const handleFilterAutocomplete = (value: string, option?: any): boolean => {
        return option?.value?.toUpperCase().includes(value.toUpperCase());
    };

    const renderInput = () => {
        if (inputRender !== undefined) {
            return inputRender(inputRef, {
                field: record[dataIndex],
                record,
                dataSource,
                onBlur: save,
                onKeyDown: onKeyDown,
                defaultValue: record[dataIndex],
                variant: 'borderless',
            });
        }
        const inputProps: any = {
            ref: inputRef,
            onBlur: save,
            variant: 'borderless',
            onKeyDown: onKeyDown
        }

        if (dataType === 'autocomplete') {
            return <AutoComplete
                {...inputProps}
                options={options}
                onSelect={onSelectAutocomplete}
                filterOption={handleFilterAutocomplete}
            />
        }
        if (dataType === 'select') {
            return <Select
                {...inputProps}
                showSearch
                filterOption={filterOption}
                options={options}
                variant={'borderless'}
            >
            </Select>
        }
        if (dataType === 'number') {
            return <InputNumber
                {...inputProps}
                style={{width: '100%'}}
                min={0}
                max={1000000000}
                {...formatInputNumber}
            />
        }
        if (dataType === 'checkbox') {
            return <Checkbox {...inputProps} onClick={onClickCheckbox} onKeyDown={onEnterCheckbox}/>
        }
        if (dataType === 'datetime') {
            return <DateTime {...inputProps}/>
        }

        return <Input {...inputProps} maxLength={255} style={{width: '100%'}}/>
    }

    const valuePropName = dataType === 'checkbox' ? {valuePropName: 'checked'} : {};
    const rules = [];
    if (restProps.pattern) {
        rules.push({pattern: restProps.pattern, message: ''});
    }
    if (restProps.max) {
        rules.push({max: restProps.max});
    }

    const editableRecord = restProps.checkEditable ? restProps.checkEditable?.(record, dataIndex) : true;

    if ((editable || restProps.alwaysShowEdit) && editableRecord) {
        childNode = editing || restProps.alwaysShowEdit ? (
            <Form.Item
                // style={{margin: '-5px -12px', padding: 0}}
                name={dataIndex}
                className="editable-cell-edit"
                rules={rules}
                {...valuePropName}
            >
                {renderInput()}
            </Form.Item>
        ) : (
            <div
                className={'editable-cell'}
                style={{minWidth: minWidth}}
            >
                {children}
            </div>
        );
    }

    // @ts-ignore
    return <td {...restProps} {...cellId}>
        <div className={`editable-cell-value-wrap ${selected ? 'table-editable-cell-selected' : ''}`}>
            {childNode}
        </div>
    </td>;
});
