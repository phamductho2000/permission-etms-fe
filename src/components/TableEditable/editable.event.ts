import $ from 'jquery';
import {
    CellEditedType,
    CellIdType,
    EditableColumnsType,
    SelectedPos
} from "@/components/TableEditable/editable.type";
import {useEffect, useRef, useState} from "react";
import {INPUT_FORMAT_ALLOW} from "@/components/DateTime";
import dayjs from "dayjs";
import {addOrUpdateToDataSource} from "@/utils/dataUtil";
import {v1 as uuid} from "uuid";
import {flatToTree, treeToFlat} from "@/utils/treeUtil";

export const useTableEditableHandleEvent = (
    tableId: string,
    flatDataSource: any[],
    columns: EditableColumnsType[],
    onChangeData: (data: any[]) => void,
    rowKey: string,
    parentKey: string | undefined
) => {
    const [cellEdited, setCellEdited] = useState<CellEditedType>();
    const [cellsSelected, setCellsSelected] = useState<SelectedPos>()
    const isMouseDown = useRef<boolean>(false);
    const timer = useRef<any>();
    const handleKeydown = (event: any) => {
        // nếu chưa chọn thì bỏ qua
        if (!cellsSelected) {
            return;
        }

        // khi nhập dữ liệu
        if (!cellEdited && !event.ctrlKey) {
            if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)) {
                setCellsSelected(prevSelect => {
                    setCellEdited({...prevSelect!.from, action: 'keydown', keydown: event.key});
                    return {from: prevSelect!.from, to: prevSelect!.from}
                })
                return;
            }
        }

        // di chuyển
        if (event.keyCode >= 37 && event.keyCode <= 40 && !cellEdited) {
            if ((event.key === 'ArrowUp')) {
                if (event.shiftKey) {
                    if (cellsSelected.to.x > 0) {
                        setCellsSelected({
                            from: cellsSelected!.from,
                            to: {x: cellsSelected?.to.x - 1, y: cellsSelected.to.y}
                        })
                    }
                } else {
                    setCellsSelected({
                        from: {x: Math.max(0, cellsSelected.from.x - 1), y: cellsSelected.from.y},
                        to: {x: Math.max(0, cellsSelected.from.x - 1), y: cellsSelected.from.y}
                    })
                }
                return;
            }
            if ((event.key === 'ArrowDown')) {
                if (event.shiftKey) {
                    if (cellsSelected.to.x < flatDataSource.length - 1) {
                        setCellsSelected({
                            from: cellsSelected!.from,
                            to: {x: cellsSelected?.to.x + 1, y: cellsSelected.to.y}
                        })
                    }
                } else {
                    setCellsSelected({
                        from: {
                            x: Math.min(flatDataSource.length - 1, cellsSelected.from.x + 1),
                            y: cellsSelected.from.y
                        },
                        to: {x: Math.min(flatDataSource.length - 1, cellsSelected.from.x + 1), y: cellsSelected.from.y}
                    })
                }
                return;
            }
            if ((event.key === 'ArrowLeft')) {
                if (event.shiftKey) {
                    if (cellsSelected.to.y > 0) {
                        setCellsSelected({
                            from: cellsSelected!.from,
                            to: {x: cellsSelected?.to.x, y: cellsSelected.to.y - 1}
                        })
                    }
                } else {
                    setCellsSelected({
                        from: {x: cellsSelected.from.x, y: Math.max(0, cellsSelected.from.y - 1)},
                        to: {x: cellsSelected.from.x, y: Math.max(0, cellsSelected.from.y - 1)}
                    })
                }
                return;
            }
            if ((event.key === 'ArrowRight')) {
                if (event.shiftKey) {
                    if (cellsSelected.to.y < columns.length - 2) {
                        setCellsSelected({
                            from: cellsSelected!.from,
                            to: {x: cellsSelected?.to.x, y: cellsSelected.to.y + 1}
                        })
                    }
                } else {
                    setCellsSelected({
                        from: {x: cellsSelected.from.x, y: Math.min(columns.length - 2, cellsSelected.from.y + 1)},
                        to: {x: cellsSelected.from.x, y: Math.min(columns.length - 2, cellsSelected.from.y + 1)}
                    })
                }
                return;
            }
            setCellEdited(undefined)
        }

        // xóa dữ liệu
        if ((event.key === 'Backspace' || event.key === 'Delete') && !cellEdited && cellsSelected) {
            const newFlatDataSource = [...flatDataSource];
            for (let i = cellsSelected.from.x; i <= cellsSelected.to.x; i++) {
                for (let j = cellsSelected.from.y; j <= cellsSelected.to.y; j++) {
                    const nameField = columns[j].dataIndex;
                    newFlatDataSource[i][nameField] = undefined;
                }
            }
            onChangeData(newFlatDataSource);
        }
    }

    const handlePaste = (event: any) => {
        if (!cellsSelected || cellEdited) {
            return;
        }
        let text: string = event.clipboardData?.getData('Text');
        if (text.endsWith("\n")) {
            text = text.slice(0, -2);
        }
        const parse = (str: string) => str.split(/\r\n|\n|\r/).map(row => row.split('\t'));
        const pasteData: string[][] = parse(text);

        // paste dữ liệu vào dòng
        let pasteIndex: number = 0;
        const handlePasteRow = (tree: any[], startRowIndex: number, isFirstPasteRow: boolean) => {
            const getValueIntoColumn = (originValue: any, column: EditableColumnsType) => {
                let newValue: any = undefined;
                if (column.dataType === 'checkbox') {
                    newValue = !!(+originValue);
                } else if (column.dataType === 'datetime') {
                    if (originValue instanceof Number) {
                        newValue = originValue;
                    } else {
                        INPUT_FORMAT_ALLOW.forEach(f => {
                            const date = dayjs(originValue, f);
                            if (date.isValid()) {
                                // trigger change
                                newValue = date.unix();
                                return;
                            }
                        })
                    }
                } else {
                    newValue = originValue;
                }
                return newValue;
            }
            const handlePasteCell = (item: any, pasteCellValue: string[]) => {
                const newItem = {...item}
                const cellStartIndex = cellsSelected.from.y;
                let currentCellIndex = cellStartIndex;
                while (currentCellIndex < columns.length && (currentCellIndex - cellStartIndex) < pasteCellValue.length) {
                    const column = columns[currentCellIndex];
                    if (column.editable) {
                        newItem[column.dataIndex] = getValueIntoColumn(pasteCellValue[currentCellIndex - cellStartIndex], column);
                    }
                    currentCellIndex++;
                }
                return newItem;
            }

            let newTree = [...tree];
            let currentRowIndex = startRowIndex;
            while (pasteIndex < pasteData.length && currentRowIndex < newTree.length) {
                let item = newTree[currentRowIndex];

                // paste row
                item = handlePasteCell(item, pasteData[pasteIndex]);
                pasteIndex++;
                currentRowIndex++;
                if (item.children) {
                    item.children = handlePasteRow(item.children, 0, false);
                }
                newTree = addOrUpdateToDataSource(newTree, item, rowKey);
            }
            while (isFirstPasteRow && pasteIndex < pasteData.length) {
                // add new row
                let item = {
                    [rowKey]: uuid(),
                    [parentKey!]: newTree?.[0]?.[parentKey!]
                }
                item = item = handlePasteCell(item, pasteData[pasteIndex]);
                newTree.push(item);
                pasteIndex++;
            }
            return newTree;
        }

        // tìm dòng để paste
        const handlePasteMultiRowInTree = (tree: any) => {
            let newTree = [...tree ?? []];
            for (const [index, treeItem] of newTree.entries()) {
                const rowId = flatDataSource[cellsSelected.from.x][rowKey];
                if (treeItem[rowKey] === rowId) {
                    // paste từ đây
                    newTree = handlePasteRow(newTree, index, true);
                } else {
                    if (treeItem.children) {
                        treeItem.children = handlePasteMultiRowInTree(treeItem.children);
                    }
                }
            }
            return newTree;
        }
        const dataSource = flatToTree(flatDataSource);
        const newTree = handlePasteMultiRowInTree(dataSource);
        const newDatasource = treeToFlat(newTree);
        onChangeData(newDatasource);
    }

    const getCellHover = (e: any): CellIdType | null => {
        if (e.target?.className === 'editable-cell' || e.target?.className?.includes?.('table-editable-cell-selected')) {
            const tableElement = e.target.closest('.ant-table');

            if(tableElement?.id !== tableId) {
                setCellsSelected(undefined);
                return null;
            }

            const tdElement = e.target.closest('td');
            if (tdElement) {
                const cellId: CellIdType = {
                    _rowId: tdElement.getAttribute('_rowid'),
                    _cellIndex: +tdElement.getAttribute('_cellindex'),
                    _cellName: tdElement.getAttribute('_cellname'),
                    _rowIndex: +tdElement.getAttribute('_rowindex')
                }
                return cellId;
            }
        }
        return null;
    }

    const handleMouseDown = (e: any) => {
        timer.current = setTimeout(() => {
            const cellHover = getCellHover(e);
            if (cellHover) {
                // console.log('handleMouseDown')
                setCellsSelected({
                    from: {x: cellHover._rowIndex, y: cellHover._cellIndex},
                    to: {x: cellHover._rowIndex, y: cellHover._cellIndex},
                })
                setCellEdited(undefined)
                isMouseDown.current = true;
            }
            // else {
            //     setCellsSelected(undefined)
            // }
        }, 150)
    }

    const handleClick = (e: any) => {
        const cellHover = getCellHover(e);
        if (cellHover) {
            setCellsSelected(prevSelected => {
                if (e.detail === 1) {
                    // console.log('handleClick', prevSelected, cellHover, e.detail);
                    if (prevSelected?.from.x === cellHover._rowIndex && prevSelected.from.y === cellHover._cellIndex) {
                        setCellEdited({
                            x: cellHover._rowIndex,
                            y: cellHover._cellIndex,
                            keydown: undefined,
                            action: 'double-click'
                        })
                    } else {
                        setCellEdited(undefined)
                    }
                } else if (e.detail === 2) {
                    // console.log('handleDoubleClick', prevSelected, cellHover, e.detail);
                    setCellEdited({
                        x: cellHover._rowIndex,
                        y: cellHover._cellIndex,
                        keydown: undefined,
                        action: 'double-click'
                    })
                }
                return {
                    from: {x: cellHover._rowIndex, y: cellHover._cellIndex},
                    to: {x: cellHover._rowIndex, y: cellHover._cellIndex},
                }
            })
        } else {
            // console.log('setCellEdited un')
            setCellEdited(undefined)
            // setCellsSelected(undefined)
        }
        clearTimeout(timer.current);
    }

    const handleMouseMove = (e: any) => {
        setTimeout(() => {
            if (isMouseDown.current) {
                const cellHover = getCellHover(e);
                if (cellHover) {
                    console.log('handleMouseMove')
                    setCellsSelected(prev => {
                        if (prev) {
                            return {
                                from: prev!.from,
                                to: {x: cellHover._rowIndex, y: cellHover._cellIndex},
                            }
                        }
                        return prev
                    })
                }
            }
        }, 170)
    }

    const handleMouseUp = () => {
        // console.log('handleMouseUp')
        isMouseDown.current = false;
    }

    const range = (start: number, end: number) => {
        const array = [];
        const inc = end - start > 0;
        for (let i = start; inc ? i <= end : i >= end; inc ? i++ : i--) {
            if (inc) {
                array.push(i)
            } else {
                array.unshift(i);
            }
        }
        return array;
    };

    const handleCopy = (e: any) => {
        if (!cellsSelected || cellEdited) return;

        const text = range(cellsSelected.from.x, cellsSelected.to.x)
            .map(i =>
                range(cellsSelected.from.y, cellsSelected.to.y)
                    .map(j => {
                        const nameField = columns[j].dataIndex
                        const cell = flatDataSource?.[i]?.[nameField];
                        return cell;
                    })
                    .join('\t'),
            )
            .join('\n');

        console.log('text', text)
        const wd = window as any;
        if (wd?.clipboardData?.setData) {
            wd.clipboardData.setData('Text', text);
        } else {
            e?.clipboardData?.setData('text/plain', text);
        }
    }

    useEffect(() => {
        $(document)
            .click(handleClick)
            .mousedown(handleMouseDown)
            .mousemove(handleMouseMove)
            .mouseup(handleMouseUp);

        return () => {
            $(document)
                .off('click')
                .off('mousedown')
                .off('mousemove')
                .off('mouseup');
        }
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('paste', handlePaste);
        window.addEventListener('copy', handleCopy);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('paste', handlePaste);
            window.removeEventListener('copy', handleCopy);
        }
    }, [cellsSelected, cellEdited])

    return {cellEdited, cellsSelected}
}
