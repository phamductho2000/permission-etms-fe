import {useCallback, useRef} from "react";
import {useSearchParams} from '@@/exports';
import {useSetState} from "ahooks";
import {convertSearchParamsToObject} from "@/utils";

type SearchQueryInitType = {
    keywords: string[]
}
const useSearchQuery = (props: SearchQueryInitType) => {
    const keywordsRef = useRef<string[]>(props?.keywords);
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);
    const initState = (): SearchQueryType => {
        const initValue: SearchQueryType = {};
        props.keywords.forEach(key => {
            const value = searchParams.get(key);
            if (value) {
                initValue[key] = value;
            }
        })
        return initValue;
    }

    const [searchQuery, setSearchQuery] = useSetState<SearchQueryType>(initState());

    const onChangeSearchQuery = useCallback((key: string, value?: string) => {
        if (keywordsRef.current.includes(key)) {
            const params = convertSearchParamsToObject(new URLSearchParams(window.location.search));
            if (value) {
                params[key] = value;
            } else {
                delete params[key];
            }

            setSearchParams(params)
            setSearchQuery({[key]: value});
        }
    }, []);

    /**
     * values: from value search
     * replace: bỏ toàn bộ param khác nếu form value k có hay không
     */
    const onChangeSearchQueries = useCallback((values: SearchQueryType, replace?: boolean) => {
        const params = convertSearchParamsToObject(new URLSearchParams(window.location.search));

        // xóa các params cũ
        if(replace) {
            keywordsRef.current.forEach(key => delete params[key]);
        }

        // set params mới
        setSearchQuery(prev => {
            const newSearchParams = {...prev}
            Object.keys(values).forEach(key => {
                if (keywordsRef.current.includes(key)) {
                    const value = values[key];
                    if (value) {
                        params[key] = value;
                    } else {
                        delete params[key];
                    }
                    newSearchParams[key] = value;
                }
            });

            setSearchParams(params)
            return newSearchParams;
        });
    }, []);

    return {searchQuery, onChangeSearchQuery, onChangeSearchQueries}
}
export default useSearchQuery;
