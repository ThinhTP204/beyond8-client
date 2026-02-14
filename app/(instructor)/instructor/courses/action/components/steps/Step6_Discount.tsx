'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Percent, DollarSign, X } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useUpdateCourseDiscount } from '@/hooks/useCourse'

interface Step6DiscountProps {
    courseId: string
    initialData?: {
        discountPercent: number | null
        discountAmount: number | null
        discountEndsAt: string | null
    }
}

export default function Step6Discount({ courseId, initialData }: Step6DiscountProps) {
    const [discountType, setDiscountType] = useState<'percent' | 'amount' | null>(
        initialData?.discountPercent ? 'percent' : initialData?.discountAmount ? 'amount' : null
    )
    const [discountPercent, setDiscountPercent] = useState<number>(initialData?.discountPercent || 0)
    const [discountAmount, setDiscountAmount] = useState<number>(initialData?.discountAmount || 0)
    const [discountEndsAt, setDiscountEndsAt] = useState<Date | undefined>(
        initialData?.discountEndsAt ? new Date(initialData.discountEndsAt) : undefined
    )

    const { updateCourseDiscount, isPending } = useUpdateCourseDiscount()

    const handleSave = async () => {
        try {
            await updateCourseDiscount({
                id: courseId,
                data: {
                    discountPercent: discountType === 'percent' ? discountPercent : null,
                    discountAmount: discountType === 'amount' ? discountAmount : null,
                    discountEndsAt: discountEndsAt ? discountEndsAt.toISOString() : null,
                },
            })
        } catch (error) {
            console.error('Error updating discount:', error)
        }
    }

    const handleClearDiscount = async () => {
        try {
            await updateCourseDiscount({
                id: courseId,
                data: {
                    discountPercent: null,
                    discountAmount: null,
                    discountEndsAt: null,
                },
            })
            setDiscountType(null)
            setDiscountPercent(0)
            setDiscountAmount(0)
            setDiscountEndsAt(undefined)
        } catch (error) {
            console.error('Error clearing discount:', error)
        }
    }

    return (
        <div className="flex flex-col flex-1 max-w-5xl w-full mx-auto transition-all duration-700 ease-in-out justify-center min-h-[calc(100vh-300px)]">
            <div className="w-full space-y-10 pb-12">
                {/* Header with gradient */}
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200">
                        <Percent className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">Quản lý giảm giá</span>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Giảm giá khóa học
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Thiết lập chương trình giảm giá để thu hút học viên. Bạn có thể chọn giảm theo phần trăm hoặc số tiền cố định.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Discount Type Selection */}
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold text-gray-900">Chọn loại giảm giá</Label>
                        <div className="grid grid-cols-2 gap-6">
                            <button
                                onClick={() => setDiscountType('percent')}
                                className={cn(
                                    "group relative flex items-center gap-4 p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden",
                                    discountType === 'percent'
                                        ? "border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg shadow-purple-100"
                                        : "border-gray-200 hover:border-purple-300 hover:shadow-md bg-white"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-lg transition-all duration-300",
                                    discountType === 'percent'
                                        ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
                                        : "bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600"
                                )}>
                                    <Percent className="w-6 h-6" />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="font-bold text-lg">Phần trăm</div>
                                    <div className="text-sm text-muted-foreground">Giảm theo tỷ lệ %</div>
                                </div>
                                {discountType === 'percent' && (
                                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                )}
                            </button>
                            <button
                                onClick={() => setDiscountType('amount')}
                                className={cn(
                                    "group relative flex items-center gap-4 p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden",
                                    discountType === 'amount'
                                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg shadow-blue-100"
                                        : "border-gray-200 hover:border-blue-300 hover:shadow-md bg-white"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-lg transition-all duration-300",
                                    discountType === 'amount'
                                        ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                                        : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                                )}>
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="font-bold text-lg">Số tiền</div>
                                    <div className="text-sm text-muted-foreground">Giảm cố định VND</div>
                                </div>
                                {discountType === 'amount' && (
                                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Discount Value Input */}
                    {discountType && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <Label className="text-lg font-semibold text-gray-900">
                                {discountType === 'percent' ? 'Phần trăm giảm giá' : 'Số tiền giảm giá'}
                            </Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    min="0"
                                    max={discountType === 'percent' ? 100 : undefined}
                                    value={discountType === 'percent' ? discountPercent : discountAmount}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value) || 0
                                        if (discountType === 'percent') {
                                            setDiscountPercent(Math.min(100, Math.max(0, value)))
                                        } else {
                                            setDiscountAmount(Math.max(0, value))
                                        }
                                    }}
                                    className="text-lg h-14 pr-16 border-2 focus:border-purple-500 focus:ring-purple-500"
                                    placeholder={discountType === 'percent' ? 'Nhập phần trăm (0-100)' : 'Nhập số tiền'}
                                />
                                <div className={cn(
                                    "absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-lg",
                                    discountType === 'percent' ? "text-purple-600" : "text-blue-600"
                                )}>
                                    {discountType === 'percent' ? '%' : 'VND'}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Discount End Date */}
                    {discountType && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
                            <Label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-purple-600" />
                                Thời hạn giảm giá
                                <span className="text-sm font-normal text-muted-foreground">(Tùy chọn)</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-medium h-14 border-2 hover:border-purple-400 transition-colors",
                                            !discountEndsAt && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-3 h-5 w-5" />
                                        {discountEndsAt ? (
                                            <span className="text-base">{format(discountEndsAt, 'PPP', { locale: vi })}</span>
                                        ) : (
                                            <span>Chọn ngày kết thúc</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={discountEndsAt}
                                        onSelect={setDiscountEndsAt}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {discountEndsAt && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDiscountEndsAt(undefined)}
                                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Xóa thời hạn
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                        <Button
                            onClick={handleSave}
                            disabled={!discountType || isPending}
                            className="flex-1 h-14 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-200"
                        >
                            {isPending ? 'Đang lưu...' : 'Lưu giảm giá'}
                        </Button>
                        {discountType && (
                            <Button
                                variant="outline"
                                onClick={handleClearDiscount}
                                disabled={isPending}
                                className="h-14 px-6 border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                            >
                                <X className="w-5 h-5 mr-2" />
                                Xóa giảm giá
                            </Button>
                        )}
                    </div>

                    {/* Info Note */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-2 border-blue-200 rounded-xl p-6 text-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30" />
                        <div className="relative">
                            <p className="font-bold text-base mb-3 text-blue-900 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                Lưu ý quan trọng
                            </p>
                            <ul className="space-y-2.5 text-blue-900">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Giảm giá sẽ được áp dụng ngay lập tức sau khi lưu</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Nếu không đặt thời hạn, giảm giá sẽ có hiệu lực vô thời hạn</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Bạn chỉ có thể chọn một trong hai loại giảm giá: phần trăm hoặc số tiền</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
