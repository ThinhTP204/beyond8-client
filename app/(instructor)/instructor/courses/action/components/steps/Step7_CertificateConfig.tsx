'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Award, Percent } from 'lucide-react'
import { useGetCourseCertificateConfig, useUpdateCourseCertificateConfig } from '@/hooks/useCourse'

interface Step7CertificateConfigProps {
    courseId: string
}

export default function Step7CertificateConfig({ courseId }: Step7CertificateConfigProps) {
    const { courseCertificateConfig, isLoading } = useGetCourseCertificateConfig(courseId)
    const { updateCourseCertificateConfig, isPending } = useUpdateCourseCertificateConfig()

    const [assignmentMinPercent, setAssignmentMinPercent] = useState<number | null>(
        courseCertificateConfig?.assignmentAverageMinPercent ?? null
    )
    const [quizMinPercent, setQuizMinPercent] = useState<number | null>(
        courseCertificateConfig?.quizAverageMinPercent ?? null
    )

    const handleSave = async () => {
        try {
            await updateCourseCertificateConfig({
                courseId,
                data: {
                    assignmentAverageMinPercent: assignmentMinPercent,
                    quizAverageMinPercent: quizMinPercent,
                },
            })
        } catch (error) {
            console.error('Error updating certificate config:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col flex-1 max-w-4xl w-full mx-auto justify-center items-center min-h-[calc(100vh-300px)]">
                <p className="text-muted-foreground">Đang tải cấu hình...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 max-w-5xl w-full mx-auto transition-all duration-700 ease-in-out justify-center min-h-[calc(100vh-300px)]">
            <div className="w-full space-y-10 pb-12">
                {/* Header with gradient */}
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200">
                        <Award className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-900">Cấu hình chứng chỉ</span>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                        Điều kiện cấp chứng chỉ
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Thiết lập điểm tối thiểu để học viên đủ điều kiện nhận chứng chỉ hoàn thành khóa học.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Quiz Average Minimum */}
                    <div className="group relative overflow-hidden space-y-4 p-6 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-20" />
                        <div className="relative flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                                <Percent className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <Label className="text-lg font-bold text-gray-900">Điểm trung bình Quiz tối thiểu</Label>
                                <p className="text-sm text-muted-foreground mt-1.5">
                                    Học viên cần đạt điểm trung bình tối thiểu này cho tất cả các quiz trong khóa học
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={quizMinPercent ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value === '' ? null : parseFloat(e.target.value)
                                    if (value === null || (value >= 0 && value <= 100)) {
                                        setQuizMinPercent(value)
                                    }
                                }}
                                className="text-lg h-14 pr-16 border-2 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                placeholder="Nhập phần trăm (0-100) hoặc để trống"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 font-semibold text-lg">
                                %
                            </div>
                        </div>
                        {quizMinPercent === null && (
                            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Để trống = không yêu cầu điểm quiz tối thiểu
                            </div>
                        )}
                    </div>

                    {/* Assignment Average Minimum */}
                    <div className="group relative overflow-hidden space-y-4 p-6 rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg hover:shadow-green-100 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-300 rounded-full blur-3xl opacity-20" />
                        <div className="relative flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                                <Percent className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <Label className="text-lg font-bold text-gray-900">Điểm trung bình Assignment tối thiểu</Label>
                                <p className="text-sm text-muted-foreground mt-1.5">
                                    Học viên cần đạt điểm trung bình tối thiểu này cho tất cả các assignment trong khóa học
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={assignmentMinPercent ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value === '' ? null : parseFloat(e.target.value)
                                    if (value === null || (value >= 0 && value <= 100)) {
                                        setAssignmentMinPercent(value)
                                    }
                                }}
                                className="text-lg h-14 pr-16 border-2 focus:border-green-500 focus:ring-green-500 bg-white"
                                placeholder="Nhập phần trăm (0-100) hoặc để trống"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 font-semibold text-lg">
                                %
                            </div>
                        </div>
                        {assignmentMinPercent === null && (
                            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Để trống = không yêu cầu điểm assignment tối thiểu
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="pt-6">
                        <Button
                            onClick={handleSave}
                            disabled={isPending}
                            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 shadow-lg shadow-yellow-200"
                            size="lg"
                        >
                            {isPending ? 'Đang lưu...' : 'Lưu cấu hình'}
                        </Button>
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
                                    <span>Nếu để trống cả hai trường, học viên chỉ cần hoàn thành tất cả bài học để nhận chứng chỉ</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Điểm trung bình được tính dựa trên tất cả các quiz/assignment trong khóa học</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Học viên phải đạt cả hai điều kiện (nếu có) để được cấp chứng chỉ</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Cấu hình này áp dụng cho tất cả học viên của khóa học</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
