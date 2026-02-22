"use client"

import { DataTable } from "@/components/ui/data-table"
import { PaginationState } from "@tanstack/react-table"
import { getInstructorWalletColumns } from "./components/InstructorWalletColumns"
import { InstructorWalletToolbar } from "./components/InstructorWalletToolbar"
import { useState, useEffect } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/useDebounce"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import { useGetAllUsers } from "@/hooks/useUsers"
import { useIsMobile } from "@/hooks/useMobile"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const InstructorWalletPage = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const isMobile = useIsMobile()

    // URL Params State
    const pageNumber = Number(searchParams.get("pageNumber")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 9;
    const isDescending = searchParams.get("isDescending") === "false" ? false : true;

    const email = searchParams.get("email") || "";

    // Handle Pagination
    const pagination: PaginationState = {
        pageIndex: pageNumber - 1,
        pageSize: pageSize,
    };

    const setPagination = (updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
        const newPagination = typeof updater === "function" ? updater(pagination) : updater;
        const params = new URLSearchParams();
        params.set("pageNumber", String(newPagination.pageIndex + 1));
        params.set("pageSize", String(newPagination.pageSize));
        params.set("isDescending", String(isDescending));
        if (email) {
            params.set("email", email);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    // Mảng role Giảng viên
    const { data, isLoading, isError, error, refetch, isFetching } = useGetAllUsers({
        pageNumber: pageNumber,
        pageSize: pageSize,
        isDescending: isDescending,
        email: email,
        role: "ROLE_INSTRUCTOR" // Filter only instructors
    });

    const [searchValue, setSearchValue] = useState(email);

    useEffect(() => {
        const hasPageNumber = searchParams.has("pageNumber");
        const hasPageSize = searchParams.has("pageSize");

        if (!hasPageNumber || !hasPageSize) {
            const params = new URLSearchParams(searchParams.toString());
            if (!hasPageNumber) params.set("pageNumber", "1");
            if (!hasPageSize) params.set("pageSize", "9");
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, []);

    useEffect(() => {
        setSearchValue(email);
    }, [email]);

    const debouncedSearch = useDebounce(searchValue, 500);

    useEffect(() => {
        if (debouncedSearch !== email) {
            const params = new URLSearchParams(searchParams.toString());
            if (debouncedSearch) {
                params.set("email", debouncedSearch);
            } else {
                params.delete("email");
            }
            params.set("pageNumber", "1");
            router.push(`${pathname}?${params.toString()}`);
        }
    }, [debouncedSearch, pathname, router, searchParams, email]);

    const columns = getInstructorWalletColumns();

    return (
        <div className={`h-full flex-1 flex-col space-y-4 flex mx-auto max-w-[1600px]`}>
            {/* <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý ví giảng viên</h1>
                <p className="text-muted-foreground">
                    Tra cứu thông tin ví điện tử, số dư và lịch sử giao dịch của các giảng viên trên hệ thống
                </p>
            </div> */}

            {isError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Lỗi</AlertTitle>
                    <AlertDescription>
                        {error ? error.message : "Có lỗi xảy ra khi tải danh sách giảng viên."}
                    </AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-10 w-[250px]" />
                    </div>
                    <div className="rounded-md border">
                        <div className="h-12 border-b px-4 flex items-center gap-4">
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 w-[80px]" />
                        </div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-16 border-b px-4 flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-4 flex-1" />
                                <Skeleton className="h-4 flex-1" />
                                <Skeleton className="h-4 flex-1" />
                                <Skeleton className="h-8 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={`transition-opacity duration-200 mt-2 ${isFetching ? "opacity-50 pointer-events-none" : ""}`}>
                    {isMobile ? (
                        <div className="space-y-4">
                            <InstructorWalletToolbar
                                searchValue={searchValue}
                                onSearchChange={setSearchValue}
                                onRefresh={refetch}
                                isFetching={isFetching}
                            />
                            <div className="grid gap-4">
                                {data?.users?.map((user) => (
                                    <Card key={user.id} className="p-4 flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={formatImageUrl(user.avatarUrl)} />
                                                <AvatarFallback>{user.fullName?.[0]?.toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{user.fullName}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t">
                                            <span className="text-sm text-muted-foreground">{user.phoneNumber || "-"}</span>
                                            <Link href={`/admin/instructor-wallet/${user.id}`}>
                                                <Button variant="outline" size="sm" className="text-purple-600 border-purple-200">
                                                    Xem ví
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                            <div className="flex items-center justify-center px-2 py-4">
                                {/* Mobile Pagination (Simplified) */}
                                <div className="flex items-center space-x-1">
                                    <Button
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                        onClick={() => setPagination((prev: PaginationState) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                                        disabled={!data?.hasPreviousPage}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm font-medium px-4">
                                        Trang {pagination.pageIndex + 1} / {data?.totalPages || 1}
                                    </span>
                                    <Button
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                        onClick={() => setPagination((prev: PaginationState) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                                        disabled={!data?.hasNextPage}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <DataTable
                            data={data?.users || []}
                            columns={columns}
                            pageCount={data?.totalPages}
                            rowCount={data?.count}
                            pagination={pagination}
                            onPaginationChange={setPagination}
                        >
                            {(_table) => (
                                <InstructorWalletToolbar
                                    searchValue={searchValue}
                                    onSearchChange={setSearchValue}
                                    onRefresh={refetch}
                                    isFetching={isFetching}
                                />
                            )}
                        </DataTable>
                    )}
                </div>
            )}
        </div>
    )
}

export default InstructorWalletPage
