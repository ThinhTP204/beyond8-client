"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Badge } from "@/components/ui/badge"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { User } from "@/lib/api/services/fetchUsers"
import Link from "next/link"

export const getInstructorWalletColumns = (): ColumnDef<User>[] => [
    {
        accessorKey: "fullName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Giảng viên" />
        ),
        cell: ({ row }) => {
            const user = row.original
            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={formatImageUrl(user.avatarUrl)}
                            alt={user.fullName}
                            referrerPolicy="no-referrer"
                        />
                        <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">{user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{user.fullName}</span>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "phoneNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="SĐT" />
        ),
        cell: ({ row }) => {
            const phone = row.original.phoneNumber
            return <span>{phone || "-"}</span>
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Trạng thái" />
        ),
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge
                    className={
                        status === "Active"
                            ? "bg-green-600 hover:bg-green-700 whitespace-nowrap"
                            : status === "Inactive"
                                ? "bg-red-600 hover:bg-red-700 whitespace-nowrap"
                                : "bg-gray-500 whitespace-nowrap"
                    }
                >
                    {status === "Active" ? "Hoạt động" : status === "Inactive" ? "Ngừng hoạt động" : status}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-end">
                    <Link href={`/admin/instructor-wallet/${row.original.id}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-600"
                        >
                            <Wallet className="h-4 w-4" />
                            Xem ví
                        </Button>
                    </Link>
                </div>
            )
        },
    },
]
