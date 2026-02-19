"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Coupon, CouponType, CreateCouponRequest, UpdateCouponRequest } from "@/lib/api/services/fetchCoupon";
import { useCreateCoupon, useUpdateCoupon } from "@/hooks/useCoupon";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

// Schema validation
const formSchema = z.object({
    code: z.string().min(3, "Mã phải có ít nhất 3 ký tự").max(20, "Mã tối đa 20 ký tự"),
    description: z.string().nullable(),
    type: z.nativeEnum(CouponType),
    value: z.coerce.number().min(0, "Giá trị phải lớn hơn hoặc bằng 0"),
    minOrderAmount: z.coerce.number().min(0).nullable().optional(),
    maxDiscountAmount: z.coerce.number().min(0).nullable().optional(),
    usageLimit: z.coerce.number().min(0).nullable().optional(),
    usagePerUser: z.coerce.number().min(0).nullable().optional(),
    validFrom: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Ngày bắt đầu không hợp lệ",
    }),
    validTo: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Ngày kết thúc không hợp lệ",
    }),
    isActive: z.boolean(),
}).refine((data) => {
    const from = new Date(data.validFrom);
    const to = new Date(data.validTo);
    return to > from;
}, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["validTo"],
});

type FormValues = z.infer<typeof formSchema>;

interface CouponDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "add" | "edit";
    initialData?: Coupon | null;
}

export function CouponDialog({ open, onOpenChange, mode, initialData }: CouponDialogProps) {
    const { createCoupon, isPending: isCreating } = useCreateCoupon();
    const { updateCoupon, isPending: isUpdating } = useUpdateCoupon();

    const isPending = isCreating || isUpdating;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            description: "",
            type: CouponType.Percentage,
            value: 0,
            minOrderAmount: null,
            maxDiscountAmount: null,
            usageLimit: null,
            usagePerUser: null,
            validFrom: "", // Set in useEffect
            validTo: "",   // Set in useEffect
            isActive: true,
        },
    });

    useEffect(() => {
        if (open) {
            if (mode === "edit" && initialData) {
                form.reset({
                    code: initialData.code,
                    description: initialData.description || "",
                    type: initialData.type as CouponType,
                    value: initialData.value,
                    minOrderAmount: initialData.minOrderAmount,
                    maxDiscountAmount: initialData.maxDiscountAmount,
                    usageLimit: initialData.usageLimit,
                    usagePerUser: initialData.usagePerUser,
                    validFrom: new Date(initialData.validFrom).toISOString().slice(0, 16),
                    validTo: new Date(initialData.validTo).toISOString().slice(0, 16),
                    isActive: initialData.isActive,
                });
            } else {
                const now = new Date();
                const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                form.reset({
                    code: "",
                    description: "",
                    type: CouponType.Percentage,
                    value: 0,
                    minOrderAmount: 0,
                    maxDiscountAmount: 0,
                    usageLimit: 100,
                    usagePerUser: 1,
                    validFrom: now.toISOString().slice(0, 16),
                    validTo: nextWeek.toISOString().slice(0, 16),
                    isActive: true,
                });
            }
        }
    }, [open, mode, initialData, form]);

    const onSubmit = async (values: FormValues) => {
        try {
            const payload = {
                ...values,
                validFrom: new Date(values.validFrom).toISOString(),
                validTo: new Date(values.validTo).toISOString(),
                // Ensure nulls are sent if 0 and optional, or handle based on backend requirement.
                // Based on schema, backend accepts nulls.
                minOrderAmount: values.minOrderAmount || 0, // Defaulting to 0 if null/undefined for safety or check API
                maxDiscountAmount: values.maxDiscountAmount || 0,
                usageLimit: values.usageLimit || 0,
                usagePerUser: values.usagePerUser || 0,
                description: values.description || null,
            }

            if (mode === "add") {
                await createCoupon(payload as CreateCouponRequest);
            } else if (mode === "edit" && initialData) {
                await updateCoupon({ id: initialData.id, coupon: payload as UpdateCouponRequest });
            }
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            // Toast handled in hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Tạo mã giảm giá mới" : "Chỉnh sửa mã giảm giá"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add"
                            ? "Điền thông tin chi tiết để tạo mã khuyến mãi mới cho hệ thống."
                            : "Cập nhật thông tin chi tiết của mã khuyến mãi hiện tại."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Basic Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mã giảm giá <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="VD: SUMMER2024" {...field} disabled={mode === "edit"} className="uppercase font-mono" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Kích hoạt</FormLabel>
                                                <FormDescription className="text-xs">
                                                    Cho phép sử dụng mã này ngay sau khi tạo
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Mô tả ngắn về chương trình khuyến mãi (tùy chọn)" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            <h3 className="text-lg font-medium">Giá trị & Điều kiện</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Loại giảm giá</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn loại mã" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={CouponType.Percentage}>Phần trăm (%)</SelectItem>
                                                    <SelectItem value={CouponType.FixedAmount}>Số tiền cố định (VND)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Giá trị giảm <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type="number" {...field} className="pr-8" />
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground text-sm">
                                                        {form.watch("type") === CouponType.Percentage ? "%" : "đ"}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="minOrderAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Đơn hàng tối thiểu</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type="number" {...field} value={field.value ?? ''} className="pr-8" />
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground text-sm">
                                                        đ
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="maxDiscountAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Giảm tối đa</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type="number" {...field} value={field.value ?? ''} disabled={form.watch("type") !== CouponType.Percentage} className="pr-8" />
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground text-sm">
                                                        đ
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs">Chỉ áp dụng cho loại Phần trăm</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            <h3 className="text-lg font-medium">Giới hạn sử dụng</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="usageLimit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tổng số lần dùng</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} value={field.value ?? ''} placeholder="Không giới hạn nếu để trống" />
                                            </FormControl>
                                            <FormDescription className="text-xs">Tổng số mã phát hành</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="usagePerUser"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Giới hạn mỗi người</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} value={field.value ?? ''} />
                                            </FormControl>
                                            <FormDescription className="text-xs">Số lần 1 người được dùng</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            <h3 className="text-lg font-medium">Thời gian hiệu lực</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="validFrom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ngày bắt đầu</FormLabel>
                                            <FormControl>
                                                <Input type="datetime-local" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="validTo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ngày kết thúc</FormLabel>
                                            <FormControl>
                                                <Input type="datetime-local" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>


                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Hủy bỏ
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {mode === "add" ? "Tạo mã giảm giá" : "Lưu thay đổi"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
