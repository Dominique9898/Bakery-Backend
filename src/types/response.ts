// 基础响应接口
export interface ApiResponseBase {
    success: boolean;
    message?: string;
    error?: string;
}

// 带数据的响应接口
export interface ApiResponseWithData<T> extends ApiResponseBase {
    data: T;
}

// 分页数据接口
export interface PaginatedData<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// 分页响应接口
export interface ApiResponsePaginated<T> extends ApiResponseBase {
    data: PaginatedData<T>;
}

// 统一导出类型
export type ApiResponse<T = undefined> = T extends undefined 
    ? ApiResponseBase 
    : ApiResponseWithData<T>; 