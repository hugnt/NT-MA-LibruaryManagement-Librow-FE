import DataTable from "@/components/data-table/DataTable";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import PageHeader from "@/components/page/PageHeader";
import { DataFilter, defaultFilter } from "@/types/filter";
import { AuditLog } from "@/types/User";
import { useEffect, useState } from "react";
import { AuditLogColumnsData } from "../components/AuditLogColumnsData";
import userService from "../service/userService";
import SearchInput from "@/components/input/SearchInput";

export default function ActivityLog() {
    const [data, setData] = useState<AuditLog[]>([]);
    const [filter, setFilter] = useState<DataFilter>(defaultFilter);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    useEffect(() => {
        handleGetList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])

    const handleGetList = () => {
        setTableLoading(true)
        userService.getActitviyLog(filter).then(res => {
            console.log("res:", res.data)
            setData(res.data || []);
            setTotalRecords(res.totalRecords ?? 0)
        }).finally(() => setTableLoading(false));
    }

    const handleSearch = (query: string) => {
        setFilter({ ...filter, pageNumber: 1, searchValue: query })
    };

    return (
        <div>
            <PageHeader title="Activity logs" subtitle="Here&apos;s the user activities in this app" />
            <div className="flex space-x-3">
                <SearchInput onSearch={handleSearch} />
            </div>
            <div className='space-y-4'>
                <DataTable data={data} columns={AuditLogColumnsData} loading={tableLoading} />
                <DataTablePagination
                    pageSizeList={[5, 8, 10]}
                    pageSize={filter?.pageSize}
                    pageNumber={filter?.pageNumber}
                    totalRecords={totalRecords}
                    onPageNumberChanged={(pageNumber: number) => setFilter({ ...filter, pageNumber: pageNumber })}
                    onPageSizeChanged={(pageSize: number) => setFilter({ ...filter, pageNumber: 1, pageSize: pageSize })} />
            </div>
        </div>
    )
}
