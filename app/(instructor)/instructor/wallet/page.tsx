"use client";

import React, { useState } from "react";
import { WalletStatsCards } from "./components/WalletStatsCards";
import { TransactionHistoryTable } from "./components/TransactionHistoryTable";
import { WithdrawalSection } from "./components/WithdrawalSection";
import { ChartLineInteractive } from "../dashboard/components/ChartLineInteractive";
import { useGetMyWallet, useGetMyTransactions } from "@/hooks/useWallet";
import { DepositDialog } from "./components/DepositDialog";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function WalletPage() {
  const { wallet, isLoading: isWalletLoading } = useGetMyWallet();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: transactionsData, isLoading: isTransactionsLoading, refetch: refetchTransactions } = useGetMyTransactions({
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    isDescending: true,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const processedRef = useRef(false);

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_Amount = searchParams.get("vnp_Amount");

    if (vnp_ResponseCode && !processedRef.current) {
      processedRef.current = true;
      if (vnp_ResponseCode === "00") {
        const amount = vnp_Amount ? parseInt(vnp_Amount) / 100 : 0;
        toast.success(`Nạp tiền thành công ${amount > 0 ? amount.toLocaleString() + ' VNĐ' : ''}`);
        // Refetch to get updated wallet balance and transactions
        refetchTransactions();
      } else {
        toast.error("Nạp tiền thất bại hoặc đã bị hủy.");
      }

      // Cleanup URL to remove VNPay params
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname, refetchTransactions]);

  return (
    <div className="space-y-6 sm:space-y-8 mx-auto max-w-[1650px] p-1">
      {/* Header */}
      <div className="flex sm:flex-row flex-col gap-4 sm:items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Ví của tôi</h1>
          <p className="text-muted-foreground">
            Quản lý thu nhập và lịch sử giao dịch của bạn
          </p>
        </div>
        <DepositDialog />
      </div>

      {/* Stats Cards */}
      <WalletStatsCards
        totalRevenue={wallet?.totalEarnings || 0}
        currentBalance={wallet?.availableBalance || 0}
        pendingClearance={wallet?.holdBalance || 0}
        totalWithdrawn={wallet?.totalWithdrawn || 0}
        isLoading={isWalletLoading}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Chart Section */}
          <ChartLineInteractive />

          {/* Transactions Section */}
          <TransactionHistoryTable
            transactions={transactionsData?.data || []}
            isLoading={isTransactionsLoading}
            pagination={pagination}
            setPagination={setPagination}
            pageCount={transactionsData?.totalPages || 0}
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className="xl:col-span-1">
          <WithdrawalSection />
        </div>
      </div>
    </div>
  );
}
