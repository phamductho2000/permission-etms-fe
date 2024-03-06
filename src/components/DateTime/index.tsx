import {DatePicker, DatePickerProps} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as React from "react";

export const INPUT_FORMAT_ALLOW = [
    "DD/MM/YYYY",
    "DD-MM-YYYY",
    "DDMMYYYY",
    "DD.MM.YYYY",
    "D/M/YYYY",
    "DMYYYY",
    "D.M.YYYY",
    "D-M-YYYY"
]
type DateTimeProps = DatePickerProps & {
    value?: number | null | undefined | string,
    onChange?: (value: number | null | undefined, s: string | undefined) => void
}
const DateTime = React.forwardRef<any, DateTimeProps> ((props: DateTimeProps, ref) => {
    const [value, setValue] = useState<dayjs.Dayjs | null>();

    useEffect(() => {
        if(value?.unix() !== props.value) {
            setValue(props.value ? dayjs(+(props.value)) : undefined);
        }
    }, [props.value])
    const triggerChange = (newValue?: dayjs.Dayjs | null) => {
        setValue(newValue);
        props?.onChange?.(newValue ? newValue?.unix() * 1000 : undefined, newValue?.format(props.format?.toString()));
    }
    const onKeyDown = (e: any) => {
        if(e.key === 'Enter' || e.key === 'Tab') {
            const inputValue = e.target.value;
            // check format
            INPUT_FORMAT_ALLOW.forEach(f => {
                const date = dayjs(inputValue, f);
                if(date.isValid()) {
                    // trigger change
                    triggerChange(date);
                    return;
                }
            })
        }
    }

    return <DatePicker ref={ref} format={'DD/MM/YYYY'} {...props} value={value} onChange={(v) => triggerChange(v)} onKeyDown={onKeyDown} style={{ width: '100%', ...props.style }}/>
});
export default DateTime;
