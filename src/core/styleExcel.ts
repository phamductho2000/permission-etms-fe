export const borderStyles = {
    top: {style: "thin", color: {argb: "#fffff"}},
    left: {style: "thin", color: {argb: "#fffff"}},
    bottom: {style: "thin", color: {argb: "#fffff"}},
    right: {style: "thin", color: {argb: "#fffff"}},
};
export const title = {
    font: {name: 'Times New Roman', size: 14, bold: true},
    alignment: {horizontal: 'center', vertical: 'middle', wrapText: true},
}
const defaultTitle = {
  font: {name: 'Times New Roman', size: 12},
  alignment: {horizontal: 'center', vertical: 'middle', wrapText: true},
}
const defaultTitleBold = {
  font: {name: 'Times New Roman', size: 12, bold: true},
  alignment: {horizontal: 'center', vertical: 'middle', wrapText: true},
}
export const subTitle = {
    font: {name: 'Times New Roman', size: 14, italic: true},
    alignment: {horizontal: 'center', vertical: 'middle'}
}
export const subTitleLeft = {
    font: {name: 'Times New Roman', size: 13},
    alignment: {horizontal: 'left', vertical: 'middle'}
}

export const subTitle2 = {
    font: {name: 'Times New Roman', size: 13},
    alignment: {horizontal: 'left', vertical: 'middle'}
}

export const header = {
    font: {name: 'Times New Roman', size: 13, bold: true},
    border: borderStyles,
    alignment: {horizontal: 'center', vertical: 'middle', wrapText: true},
    fill: {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'D8D8D8'}
    }
}

export const subHeader = {
    font: {size: 11, bold: true},
    alignment: {horizontal: 'center', vertical: 'middle', wrapText: true},
    border: borderStyles,
};

export const footer = {
    font: {name: 'Times New Roman', size: 12, bold: false},
    alignment: {horizontal: 'center', vertical: 'middle'},
}

export const footerBold = {
    font: {name: 'Times New Roman', size: 12, bold: true},
    alignment: {horizontal: 'center', vertical: 'middle'},
    border: null
}
export const signStyle = {
    font: {name: 'Times New Roman', size: 12, bold: false},
    alignment: {horizontal: 'right', vertical: 'middle'},
    border: null
}

export const dataStyle = {
    font: {name: 'Times New Roman', size: 12, bold: false, color: {argb: '000000'}},
    alignment: {vertical: 'middle', wrapText: true},
    border: borderStyles
}
export const dataStyleCenter = {
    font: {name: 'Times New Roman', size: 12, bold: false, color: {argb: '000000'}},
    alignment: {horizontal: 'center', vertical: 'middle', wrapText: true},
    border: borderStyles
}


export const mergeCells = (worksheet: { mergeCells: (arg0: string) => void; }, from: string, to: string) => {
    worksheet.mergeCells(`${from}:${to}`)
}
export const customCell = (worksheet: any, position: string, cellName: string, customStyle: any) => {
    const customCellExcel = worksheet.getCell(position);
    customCellExcel.style = customStyle;
    customCellExcel.value = cellName;
}
export const genDefaultCell = (worksheet: any) => {
    worksheet.mergeCells(`A1:D1`)
    worksheet.mergeCells(`A2:D2`)
    customCell(worksheet, 'A1', 'HỌC VIỆN CHÍNH TRỊ QUỐC GIA HỒ CHÍ MINH', defaultTitle);
    customCell(worksheet, 'A2', 'HỌC VIỆN CHÍNH TRỊ KHU VỰC I', defaultTitleBold);
}