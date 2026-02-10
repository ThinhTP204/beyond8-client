"use client"

import { useGetCourseByInstructor } from "@/hooks/useCourse"
import { useAuth } from "@/hooks/useAuth"
import { Course, CourseLevel, CourseStatus } from "@/lib/api/services/fetchCourse"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users } from "lucide-react"
import Image from "next/image"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"
import { motion } from "framer-motion"

interface GradingCourseListProps {
    onSelectCourse: (courseId: string) => void
}

export function GradingCourseList({ onSelectCourse }: GradingCourseListProps) {
    const { user } = useAuth()

    // Fetch all courses for the instructor
    const { courses, isLoading } = useGetCourseByInstructor({
        instructorId: user?.id,
        pageNumber: 1,
        pageSize: 100, // Fetch more to show relevant ones
        isDescending: true,
        level: 'All' as CourseLevel // Cast to satisfy type
    })

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton key={i} className="h-[320px] rounded-2xl" />
                ))}
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            {courses.length > 0 ? (
                courses.map((course, index) => {
                    const imageUrl = formatImageUrl((course as Course).thumbnailUrl);
                    return (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectCourse(course.id)}
                            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-brand-magenta/20 bg-white/80 shadow-lg shadow-brand-magenta/5 backdrop-blur-xl transition-all duration-300 hover:border-brand-magenta/40 hover:shadow-xl hover:shadow-brand-magenta/10 flex flex-col h-full"
                        >
                            <div className="relative h-48 w-full overflow-hidden shrink-0 bg-secondary/20">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={course.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-magenta/5 to-brand-purple/5">
                                        <BookOpen className="h-12 w-12 text-brand-magenta/20" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <Badge variant={course.status === CourseStatus.Approved ? "default" : "secondary"} className="shadow-sm backdrop-blur-md bg-white/90 text-black hover:bg-white/100">
                                        {course.status === CourseStatus.Approved ? "Đã duyệt" : course.status === CourseStatus.Draft ? "Bản nháp" : "Chờ duyệt"}
                                    </Badge>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="flex flex-col flex-grow p-5 space-y-4">
                                <div className="space-y-2 flex-grow">
                                    <h3 className="line-clamp-2 text-lg font-semibold leading-tight group-hover:text-brand-magenta transition-colors">
                                        {course.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{course.level}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4" />
                                            <span>{course.totalStudents || 0} học viên</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full rounded-xl bg-brand-magenta text-white shadow-lg shadow-brand-magenta/20 hover:bg-brand-magenta/90 mt-auto"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onSelectCourse(course.id)
                                    }}
                                >
                                    Chấm bài ngay
                                </Button>
                            </div>
                        </motion.div>
                    )
                })
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted/50 p-6 mb-4">
                        <BookOpen className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Không tìm thấy khóa học nào</h3>
                    <p className="text-muted-foreground mt-1">Bạn chưa được phân công khóa học nào để giảng dạy.</p>
                </div>
            )}
        </motion.div>
    )
}
