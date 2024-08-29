export interface ApiResponse<T> {
    success: 0 | 1;
    data: T;
    msg?: string;
}
