
import React from 'react';
import './loading.css';

const LoadingPage: React.FC<Props> = (props: Props) => {
    return (
        <div className='load-data'>
            {props.loading && <div className="loader" /> }
            <div style={{ fontSize: 16, marginTop: 10, fontWeight: 500 }}>{props.message}</div>
            <div className={"mt-3"}>{props.action}</div>
        </div>
    )
}
type Props = {
    message?: string,
    loading?: boolean,
    action?: React.ReactNode
}
LoadingPage.defaultProps = {
    message: 'Đang lấy dữ liệu...',
    loading: true
}
export default LoadingPage;
