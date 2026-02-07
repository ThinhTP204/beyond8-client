import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Trash2,
    FolderOpen,
    CheckCircle2,
    Clock,
    Loader2,
    Eye
} from 'lucide-react'
import { Course, CourseStatus } from '@/lib/api/services/fetchCourse'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import SafeImage from '@/components/ui/SafeImage'
import { useApproveCourse, useRejectCourse } from '@/hooks/useCourse'
import { CourseActionDialog } from './CourseActionDialog'

interface CourseGridItemProps {
    course: Course
    onPreview?: () => void
}

export default function CourseGridItem({ course, onPreview }: CourseGridItemProps) {
    // Format currency
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(course.price)

    const { approveCourse, isPending: isApproving } = useApproveCourse()
    const { rejectCourse, isPending: isRejecting } = useRejectCourse()

    const [actionDialog, setActionDialog] = useState<{
        open: boolean;
        type: 'approve' | 'reject' | null;
    }>({
        open: false,
        type: null
    })

    const handleApproveClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setActionDialog({ open: true, type: 'approve' })
    }

    const handleRejectClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setActionDialog({ open: true, type: 'reject' })
    }

    const handleConfirmAction = async (note: string | null) => {
        if (actionDialog.type === 'approve') {
            await approveCourse({ id: course.id, notes: note })
        } else if (actionDialog.type === 'reject') {
            await rejectCourse({ id: course.id, reason: note })
        }
        setActionDialog({ open: false, type: null })
    }

    // Status Badge Logic
    const getStatusBadge = (status: CourseStatus) => {
        switch (status) {
            case CourseStatus.PendingApproval:
                return <Badge className="bg-yellow-500/90 hover:bg-yellow-500 text-white border-0 backdrop-blur-sm">Chờ duyệt</Badge>
            case CourseStatus.Published:
                return <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 backdrop-blur-sm">Đang hoạt động</Badge>
            case CourseStatus.Draft:
                return <Badge className="bg-slate-500/90 hover:bg-slate-500 text-white border-0 backdrop-blur-sm">Nháp</Badge>
            case CourseStatus.Rejected:
                return <Badge className="bg-red-500/90 hover:bg-red-500 text-white border-0 backdrop-blur-sm">Đã từ chối</Badge>
            case CourseStatus.Approved:
                return <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 backdrop-blur-sm">Đã duyệt</Badge>
            case CourseStatus.Archived:
                return <Badge className="bg-slate-500/90 hover:bg-slate-500 text-white border-0 backdrop-blur-sm">Đã khóa</Badge>
            case CourseStatus.Suspended:
                return <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white border-0 backdrop-blur-sm">Tạm ngưng</Badge>
            default:
                return <Badge variant="secondary" className="backdrop-blur-sm">{status}</Badge>
        }
    }

    return (
        <>
            <div
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer border border-slate-200/60 hover:border-primary/30 hover:-translate-y-1"
                onClick={onPreview}
            >
                {/* Image Section */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                    <SafeImage
                        src={formatImageUrl(course.thumbnailUrl) || ''}
                        alt={course.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {getStatusBadge(course.status)}
                    </div>

                    <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="backdrop-blur-lg bg-white/95 text-primary font-semibold shadow-lg border border-white/50">
                            {course.categoryName}
                        </Badge>
                    </div>

                    {/* Preview Button - Bottom Left */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onPreview?.()
                        }}
                        className="absolute bottom-3 left-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-5 gap-4 bg-gradient-to-b from-white to-slate-50/30">

                    {/* Price & Title */}
                    <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {formattedPrice}
                            </h3>
                            <div className="flex items-center gap-1.5 text-slate-600 bg-gradient-to-br from-slate-100 to-slate-50 px-3 py-1.5 rounded-lg shadow-sm border border-slate-200/50">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-semibold">{course.totalDurationMinutes} phút</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 w-fit px-3 py-1 rounded-full border border-emerald-200/50 shadow-sm">
                                <FolderOpen className="w-3.5 h-3.5" />
                                <span>{course.level}</span>
                                <span className="mx-1 text-emerald-400">•</span>
                                <span className="truncate max-w-[120px]">{course.instructorName}</span>
                            </div>
                            <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] text-slate-800 group-hover:text-primary transition-colors leading-snug">
                                {course.title}
                            </h3>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-3 grid grid-cols-2 gap-2 items-center border-t border-slate-100">
                        {course.status === CourseStatus.PendingApproval && (
                            <>
                                <Button
                                    variant="secondary"
                                    className="w-full h-9 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 hover:text-black border border-emerald-200 shadow-sm hover:shadow-md transition-all"
                                    onClick={handleApproveClick}
                                    disabled={isApproving || isRejecting}
                                >
                                    {isApproving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                    Duyệt
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="w-full h-9 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 text-red-700 hover:from-red-100 hover:to-rose-100 hover:text-black border border-red-200 shadow-sm hover:shadow-md transition-all"
                                    onClick={handleRejectClick}
                                    disabled={isApproving || isRejecting}
                                >
                                    {isRejecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                    Từ chối
                                </Button>
                            </>
                        )}
                        <div className="col-span-2">
                            <Button variant="outline" className="w-full h-9 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-primary/30 transition-all shadow-sm">
                                Xem chi tiết
                            </Button>
                        </div>
                    </div>

                </div>
            </div>

            <CourseActionDialog
                open={actionDialog.open}
                onOpenChange={(open) => setActionDialog(prev => ({ ...prev, open }))}
                title={actionDialog.type === 'approve' ? "Phê duyệt khóa học" : "Từ chối khóa học"}
                description={actionDialog.type === 'approve'
                    ? "Bạn có chắc chắn muốn phê duyệt khóa học này? Bạn có thể để lại ghi chú (không bắt buộc)."
                    : "Bạn có chắc chắn muốn từ chối khóa học này? Vui lòng nhập lý do từ chối (không bắt buộc)."
                }
                confirmLabel={actionDialog.type === 'approve' ? "Phê duyệt" : "Từ chối"}
                variant={actionDialog.type === 'reject' ? "destructive" : "default"}
                isLoading={isApproving || isRejecting}
                onConfirm={handleConfirmAction}
                placeholder={actionDialog.type === 'approve' ? "Nhập ghi chú..." : "Nhập lý do từ chối..."}
            />
        </>
    )
}
