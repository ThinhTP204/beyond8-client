import apiService, { RequestParams } from "../core"
import { Metadata } from "./fetchUsers"

export interface Wallet {
    id: string
    instructorId: string
    availableBalance: number
    holdBalance: number
    currency: string
    totalEarnings: number
    totalWithdrawn: number
    lastPayoutAt: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string | null
}

export enum TransactionType {
    Sale = "Sale",
    Payout = "Payout",
    PlatformFee = "PlatformFee",
    Adjustment = "Adjustment",
    TopUp = "TopUp",
    CouponHold = "CouponHold",
    CouponRelease = "CouponRelease",
    CouponUsage = "CouponUsage",
}

export interface WalletTransaction {
    id: string
    walletId: string
    type: TransactionType
    status: string
    amount: number
    currency: string
    balanceBefore: number
    balanceAfter: number
    referenceId: string
    referenceType: string
    description: string
    externalTransactionId: string
    createdAt: string
}

export interface WalletResponse {
    isSuccess: boolean
    message: string
    data: Wallet
    metadata: unknown
}

export interface ChargeWalletRequest {
    amount: number
}

export interface ChargeWalletResponse {
    isSuccess: boolean
    message: string
    data: {
        paymentId: string
        paymentNumber: string
        purpose: string
        expiredAt: string
        paymentUrl: string
    }
    metadata: Metadata
}

export interface TransactionsParams {
    pageNumber: number
    pageSize: number
    isDescending: boolean
}

export interface TransactionsResponse {
    isSuccess: boolean
    message: string
    data: WalletTransaction[]
    metadata: Metadata
}

const convertParamsToQuery = (params: TransactionsParams): RequestParams => {
    if (!params) {
        return {};
    }
    const query: RequestParams = {}
    if (params.pageNumber) {
        query.pageNumber = params.pageNumber;
    }
    if (params.pageSize) {
        query.pageSize = params.pageSize;
    }
    if (params.isDescending) {
        query.isDescending = params.isDescending;
    }
    return query;
}

export const fetchWallet = {
    //Lấy thông tin ví của giảng viên hiện tại (Instructor)
    getMyWallet: async (): Promise<WalletResponse> => {
        const response = await apiService.get<WalletResponse>("api/v1/wallets/my-wallet");
        return response.data;
    },

    //Nạp tiền vào ví giảng viên qua VNPay — Purpose: WalletTopUp (Instructor)
    chargeWallet: async (request: ChargeWalletRequest): Promise<ChargeWalletResponse> => {
        const response = await apiService.post<ChargeWalletResponse>("api/v1/wallets/top-up", request);
        return response.data;
    },

    //Lấy lịch sử giao dịch ví của giảng viên hiện tại (Instructor, phân trang)
    getTransactions: async (params: TransactionsParams): Promise<TransactionsResponse> => {
        const response = await apiService.get<TransactionsResponse>("api/v1/wallets/my-wallet/transactions", convertParamsToQuery(params));
        return response.data;
    },

    //Lấy thông tin ví của một giảng viên cụ thể (Admin/Staff)
    getWalletByInstructorId: async (instructorId: string): Promise<WalletResponse> => {
        const response = await apiService.get<WalletResponse>(`api/v1/wallets/instructor${instructorId}`);
        return response.data;
    },

    //Lấy lịch sử giao dịch ví của một giảng viên cụ thể (Admin/Staff, phân trang)
    getTransactionsByInstructorId: async (instructorId: string, params: TransactionsParams): Promise<TransactionsResponse> => {
        const response = await apiService.get<TransactionsResponse>(`api/v1/wallets/instructor/${instructorId}/transactions`, convertParamsToQuery(params));
        return response.data;
    },

    //Tạo ví cho một giảng viên (Admin/Staff - Internal use)
    createWalletForInstructor: async (instructorId: string): Promise<WalletResponse> => {
        const response = await apiService.post<WalletResponse>(`api/v1/wallets/create/${instructorId}`);
        return response.data;
    },
}