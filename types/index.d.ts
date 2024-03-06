type SearchQueryType = { [key: string]: string | undefined }

declare type PaginationType = {
    page?: number,
    size?: number,
    sort?: string;
    dontUseParam?: boolean // = true nếu muốn thay đổi Pagination mà k cập nhật param trên url
}
