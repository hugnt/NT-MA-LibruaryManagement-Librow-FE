export type DataFilter = {
    pageSize?: number,
    pageNumber?: number,
    totalRecords?: number,
}

export const defaultFilter: DataFilter = {
    pageSize: 10,
    pageNumber: 1,
    totalRecords: 0,
}
