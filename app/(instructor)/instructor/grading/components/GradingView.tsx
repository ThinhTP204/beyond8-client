
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Home, BookOpen, FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradingCourseList } from "./GradingCourseList"
import { GradingCourseDetail } from "./GradingCourseDetail"
import { GradingAssignmentDetail } from "./GradingAssignmentDetail"

interface GradingViewProps {
    selectedCourseId: string | null
    selectedAssignmentId: string | null
    onCourseClick: (courseId: string) => void
    onAssignmentClick: (assignmentId: string) => void
    onBackToCourses: () => void
    onBackToAssignments: () => void
}

export function GradingView({
    selectedCourseId,
    selectedAssignmentId,
    onCourseClick,
    onAssignmentClick,
    onBackToCourses,
    onBackToAssignments
}: GradingViewProps) {

    return (
        <div className="space-y-6 py-3 relative">
            {/* Header: Breadcrumb Navigation */}
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 py-2 -mx-2 px-2 border-b border-transparent transition-all data-[scrolled=true]:border-border/50 rounded-lg">
                <div className="flex items-center gap-2 text-md">
                    <Link href="/instructor/courses">
                        <Button variant="ghost" className="h-8 hover:bg-black/5 mr-2 gap-2 text-muted-foreground hover:text-foreground" title="Quản lý khóa học">
                            <ArrowLeft className="h-4 w-4" />
                            Quản lý khóa học
                        </Button>
                    </Link>
                    <div className="h-4 w-px bg-border mx-2" />
                    <button
                        onClick={onBackToCourses}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-black font-semibold cursor-pointer hover:bg-black/5"
                    >
                        <Home className="h-4 w-4" />
                        <span>Danh sách khóa học</span>
                    </button>

                    {selectedCourseId && (
                        <>
                            <ChevronRight className="h-4 w-4 text-black font-semibold" />
                            <div
                                onClick={selectedAssignmentId ? onBackToAssignments : undefined}
                                className={`flex items-center gap-2 rounded-lg transition-all font-medium ${selectedAssignmentId
                                    ? 'px-3 py-2 cursor-pointer hover:bg-black/5 text-black'
                                    : 'text-brand-magenta'}`}
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Chi tiết khóa học</span>
                            </div>
                        </>
                    )}

                    {selectedAssignmentId && (
                        <>
                            <ChevronRight className="h-4 w-4 text-black font-semibold" />
                            <div className="flex items-center gap-2 rounded-lg text-brand-magenta transition-all font-medium px-3 py-2">
                                <FileText className="h-4 w-4" />
                                <span>Danh sách bài nộp</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {!selectedCourseId ? (
                    <motion.div
                        key="course-list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <GradingCourseList onSelectCourse={onCourseClick} />
                    </motion.div>
                ) : !selectedAssignmentId ? (
                    <motion.div
                        key="course-detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <GradingCourseDetail
                            courseId={selectedCourseId}
                            onSelectAssignment={onAssignmentClick}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="assignment-detail"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <GradingAssignmentDetail
                            assignmentId={selectedAssignmentId}
                            onBack={onBackToAssignments}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
