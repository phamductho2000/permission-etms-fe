import {Select} from 'antd';
import {history} from "@@/exports";
import {APPLICATION_CONTEXT} from "@/core/constant";

export const dataToSelectBox = (data: any[] = [], key: string = 'id', name: string | string[] = 'name') => {
    const renderName = (record: any) => {
        if (typeof name === 'string') {
            return record[name];
        } else {
            if (name.length <= 1) {
                return record[name?.[0]]
            }
            return name.map(n => record[n]).join(' - ');
        }
    }

    return data.map(record => <Select.Option key={record[key]}
                                             value={record[key]}>{renderName(record)}</Select.Option>);
}

export const isNullOrEmpty = (value: any) => {
    return value ? value.length === 0 : true;
}

export const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

export const downloadFile = (base64: string, fileName: string, contentType: string) => {
    const blob = b64toBlob(base64, contentType);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

export const dataToTree = (data: any[], codeField: string, parentField: string, titleField: string = 'name', parentCode: string = ''): any[] => {
    const level: any[] = data.filter(d => (d[parentField] ?? '') === parentCode);
    level.forEach(d => {
        d.key = d[codeField];
        d.value = d[codeField];
        d.title = d[titleField];
        const children = dataToTree(data, codeField, parentField, titleField, d[codeField]);
        if (children.length > 0) {
            d.children = children;
        } else {
            d.children = undefined
        }
    });
    return level;
}

/**
 * format number to zero number: example zeroPad(5, 4) = "0005"
 * @param num
 * @param places
 * @returns
 */
export const zeroPad = (num: number, places: number) => {
    const zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}


export const formatCurrency = (currency?: number): string => {
    if (!currency && currency !== 0) return '';
    return (+currency).toLocaleString('vi-VN')
}

//format về tiếng việt không dấu
export const removeAccents = (str: any) => {
    if (str) {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }
}


// format về tên viết hoa chữ cái đầu
export const capitalizeName = (name: string): string => {
    if (!name) return name;
    return name.toLowerCase().replace(/(?:^|\s|['`‘’.-])[^\x00-\x60^\x7B-\xDF](?!(\s|$))/g, s => s.toUpperCase());
}


export const searchText = (title: string, searchvalue: string) => {
    if (searchvalue.indexOf('%') === 0 && searchvalue.lastIndexOf('%') + 1 === searchvalue.length) {
        return title.includes(searchvalue.replaceAll('%', '').toLowerCase())
    } else if (searchvalue.indexOf('%') === 0 && searchvalue.lastIndexOf('%') === 0) {
        return title.toLowerCase().endsWith(searchvalue.replace('%', '').toLowerCase())
    } else if (searchvalue.indexOf('%') === searchvalue.length - 1 && searchvalue.lastIndexOf('%') + 1 === searchvalue.length) {
        return title.toLowerCase().startsWith(searchvalue.replace('%', '').toLowerCase())
    } else {
        const index = title.indexOf("_")
        const Code = title.substring(0, index);
        const name = title.substring(index + 1).trim();
        return Code.toLowerCase() === searchvalue.toLowerCase() || name.toLowerCase() === searchvalue.toLowerCase()
    }
}


export const formatNumber = (num?: number | string): string => {
    return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const vniToEng = (text: string) => {
    let str = text ?? '';
    // xóa dấu
    str = str
        .normalize('NFD') // chuyển chuỗi sang unicode tổ hợp
        .replace(/[\u0300-\u036f]/g, ''); // xóa các ký tự dấu sau khi tách tổ hợp

    // Thay ký tự đĐ
    str = str.replace(/[đĐ]/g, 'd');

    // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, '');

    // xóa phần dư - ở đầu & cuối
    str = str.replace(/^-+|-+$/g, '');

    // return
    return str;
}

export const equalsText = (fullText: string, searchElement: string) => {
    return vniToEng(fullText?.toLowerCase()).includes(vniToEng(searchElement?.toLowerCase()));
}

export const removeVietnameseTones = (text: string) => {
    let str = text ?? '';
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}
export const filterOption = (value: any, option: any): boolean => {
    console.log(option);
    return (
        option?.value?.toLowerCase().includes(value.toLowerCase()) ||
        option?.label?.toLowerCase().includes(value.toLowerCase()) ||
        option?.children?.toLowerCase().includes(value.toLowerCase())
    );
};

export const convertSearchParamsToObject = (searchParams: any): { [key: string]: string } => {
    const params: any = {};
    for (let [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    return params;
}

export const getPathname = () => {
    const {pathname} = history.location;
    return pathname.replace(new RegExp(`${APPLICATION_CONTEXT}`, 'g'), '');
}
