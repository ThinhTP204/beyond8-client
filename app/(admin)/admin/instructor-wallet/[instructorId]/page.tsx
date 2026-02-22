"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetWalletByInstructorId, useGetTransactionsByInstructorId } from "@/hooks/useWallet";
import { InstructorWalletStats } from "./components/InstructorWalletStats";
import { InstructorTransactionTable } from "./components/InstructorTransactionTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function InstructorWalletDetailPage() {
    const params = useParams();
    const router = useRouter();
    const instructorId = params.instructorId as string;

    const { wallet, isLoading: isWalletLoading } = useGetWalletByInstructorId(instructorId);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 8,
    });

    const { data: transactionsData, isLoading: isTransactionsLoading } = useGetTransactionsByInstructorId(instructorId, {
        pageNumber: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        isDescending: true,
    });

    return (
        <div className="space-y-4 mx-auto max-w-[1650px] p-2">
            {/* Header */}
            <div className="flex gap-4">
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/admin/instructor-wallet")}
                        className="mb-4 pl-0 hover:bg-transparent hover:text-black"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại danh sách
                    </Button>
                    {/* <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">Chi tiết ví giảng viên</h1>
                        <p className="text-muted-foreground">
                            Tra cứu thông tin, thu nhập và lịch sử giao dịch của giảng viên
                        </p>
                    </div> */}
                </div>
            </div>

            {/* Stats Cards */}
            <InstructorWalletStats
                wallet={wallet}
                isLoading={isWalletLoading}
            />

            {/* Transactions Section */}
            <InstructorTransactionTable
                transactions={transactionsData?.data || []}
                isLoading={isTransactionsLoading}
                pagination={pagination}
                setPagination={setPagination}
                pageCount={transactionsData?.totalPages || 0}
            />
        </div>
    );
}
