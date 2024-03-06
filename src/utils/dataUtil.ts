/**
 *
 * @param dataSource Thêm 1 bản ghi vào danh sách
 * @param record
 * @returns
 */
export function addToDataSource<T>(dataSource: T[], record: T) {
    return [...dataSource, record];
}

/**
 *
 * @param dataSource
 * @param record
 * @returns
 */
export function addOrUpdateToDataSource<T>(dataSource: T[], record: T, key: string = 'id'): T[] {
    // @ts-ignore
    const index = dataSource.findIndex((r) => r[key] === record[key]);
    const rel = [...dataSource];
    if (index >= 0) {
        rel.splice(index, 1, record);
    } else {
        rel.push(record);
    }
    return rel;
}

/**
 * Cập nhật lại một bản ghi trong một danh sách dựa vào id
 * @param dataSource
 * @param record
 * @param key
 * @returns
 */
export function updateToDataSource<T>(dataSource: T[], record: T, key: string = 'id') {
    // @ts-ignore
    const index = dataSource.findIndex((r) => r[key] === record[key]);
    const rel = [...dataSource];
    if (index >= 0) {
        rel.splice(index, 1, record);
    }
    return rel;
}

/**
 * Xoá 1 bản ghi trong danh sách dựa vào id
 * @param dataSource
 * @param id
 * @param key
 * @returns
 */
export function deleteFromDataSource<T>(dataSource: T[], id: any, key: string = 'id') {
    const index = dataSource.findIndex((r) => r[key as keyof T] === id);
    const rel = [...dataSource];
    if (index >= 0) {
        rel.splice(index, 1);
    }
    return rel;
}

export function addOfUpdateListToDataSource<T>(
    dataSource: T[],
    recordList: T[],
    key: string = 'id',
): T[] {
    let rel = [...dataSource];
    recordList.forEach((record: T) => {
        rel = addOrUpdateToDataSource(rel, record, key);
    });
    return rel;
}

export function deleteListFromDataSource<T>(dataSource: T[], recordList: T[], key: string = 'id') {
    // @ts-ignore
    return dataSource.filter((d) => !recordList.some((r) => r[key] === d[key]));
}

export function deleteListIdsFromDataSource<T>(
    dataSource: T[],
    recordList: string[],
    key: string = 'id',
) {
    return dataSource.filter((d) => !recordList.some((value) => value === d[key as keyof T]));
}

export const copyObject = (target: object, source: object) => {
    const keys = Object.keys(target);
    const retVal = {...target};
    keys.forEach((k) => {
        // @ts-ignore
        retVal[k] = source[k];
    });
    return retVal;
};

export const compare = {
    '===': (a: any, b: any) => a === b,
    '!==': (a: any, b: any) => a !== b,
    '&&': (a: any, b: any) => a && b,
    '||': (a: any, b: any) => a || b
}

export const objectNullOrEmpty = (object: any) => {
    if (object === undefined || object === null) {
        return true;
    } else {
        for (const key in object) {
            if (object.hasOwnProperty(key) && object[key]) {
                return false;
            }
        }
        return true;
    }
};

export const combineCriteriaSearch = (source: object, criteria: object, condition: string): boolean => {
    const combines: any[] = [];
    for (const [key, value] of Object.entries(source)) {
        // console.log(`${key}: ${value}`);
        // @ts-ignore
        if (criteria.hasOwnProperty(key) && criteria[key]) {
            // @ts-ignore
            combines.push(value.includes(criteria[key]));
        }
    }
    if (combines.length > 0) {
        // @ts-ignore
        const res = combines.reduce((t, v) => compare[condition](t, v));
        console.log('combines', combines);
        console.log('res', res);
        return res;
    }
    return false;
}
