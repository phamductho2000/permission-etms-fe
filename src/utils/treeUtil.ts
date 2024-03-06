export const flatToTree = (dataFrom: readonly any[], key: string = 'id', parentKey: string = 'parentId') => {
    let hashTable = Object.create(null)
    dataFrom?.forEach(data => hashTable[data[key]] = {...data})
    let dataTree: any[] = [];
    dataFrom?.forEach(data => {
        if (data[parentKey] !== undefined) {
            if (hashTable[data[parentKey]] && !hashTable[data[parentKey]]?.children) {
                hashTable[data[parentKey]].children = [];
            }
            hashTable[data[parentKey]]?.children?.push(hashTable[data[key]]);
        } else {
            dataTree.push(hashTable[data[key]])
        }
    })
    return dataTree;
}

// export const treeToFlat = (tree: any) => tree.children.flatMap(({children = [], ...rest}) => [rest, ...treeToFlat({children})])

export const treeToFlat = (tree?: readonly any[]): any[] => (tree ?? []).flatMap((item: any) => {
        const {children, ...rest} = item;
        return [
            rest,
            ...treeToFlat(children || [])
        ]
    }
);

export const deleteItemFromTree = (tree: readonly any[] | undefined, key: string, keyField: string = 'id') => {
    let newTree = [...tree ?? []];
    for (const [index, el] of newTree.entries()) {
        if (el[keyField] === key) {
            newTree.splice(index, 1);
            break;
        }
        if(el.children) {
            el.children = deleteItemFromTree(el.children, key, keyField);
        }
    }
    return newTree;
}
