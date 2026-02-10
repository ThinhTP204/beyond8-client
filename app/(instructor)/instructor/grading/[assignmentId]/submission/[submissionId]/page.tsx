"use client"

import { useParams, useRouter } from "next/navigation"
import { useGetAssignmentById, useGetSubmissionSumaryBySection } from "@/hooks/useAssignment"
import { useUserById } from "@/hooks/useUserProfile"
import { formatImageUrl } from "@/lib/utils/formatImageUrl"
import { GradingInterface } from "@/app/(instructor)/instructor/grading/components/GradingInterface"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft } from "lucide-react"

export default function GradingSubmissionPage() {
    const params = useParams()
    const router = useRouter()
    const assignmentId = params.assignmentId as string
    const submissionId = params.submissionId as string

    // Fetch assignment to get sectionId
    const { assignment, isLoading: isLoadingAssignment } = useGetAssignmentById(assignmentId)
    const sectionId = assignment?.sectionId

    // Fetch submissions using sectionId (this fetches all submissions for the section)
    const { submissions: sectionData, isLoading: isLoadingSubmissions } = useGetSubmissionSumaryBySection(sectionId || "")

    // Find the specific submission
    const assignmentsList = sectionData || []
    const assignmentData = Array.isArray(assignmentsList) ? assignmentsList.find(a => a.assignmentId === assignmentId) : null
    const submission = assignmentData?.submissions.find(s => s.id === submissionId)

    // Fetch student profile
    const { user: student } = useUserById(submission?.studentId)

    // Navigation logic
    const submissions = assignmentData?.submissions || []
    const currentIndex = submissions.findIndex(s => s.id === submissionId)
    const prevSubmission = currentIndex > 0 ? submissions[currentIndex - 1] : null
    const nextSubmission = currentIndex < submissions.length - 1 ? submissions[currentIndex + 1] : null

    // Loading State
    if (isLoadingAssignment || (sectionId && isLoadingSubmissions)) {
        return (
            <div className="h-screen w-full flex items-center justify-center p-8 bg-gray-50/50">
                <div className="w-full max-w-7xl space-y-6">
                    <Skeleton className="h-12 w-1/3" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Skeleton className="h-[600px] rounded-xl" />
                        <Skeleton className="h-[600px] rounded-xl" />
                        <Skeleton className="h-[600px] rounded-xl" />
                    </div>
                </div>
            </div>
        )
    }

    // Error / Not Found State
    if (!assignment) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <p>Không tìm thấy bài tập</p>
                <Button onClick={() => router.back()}>Quay lại</Button>
            </div>
        )
    }

    if (!submission) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <p>Không tìm thấy bài nộp hoặc bạn không có quyền truy cập.</p>
                <Button onClick={() => router.back()}>Quay lại</Button>
            </div>
        )
    }

    return (
        <div className="bg-gray-50/50 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="font-semibold text-lg">{assignment.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground mr-2">Bài nộp của:</span>
                            {student ? (
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={formatImageUrl(student.avatarUrl)}
                                            alt={student.fullName}
                                            referrerPolicy="no-referrer"
                                        />
                                        <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                                            {student.fullName?.charAt(0).toUpperCase() || "S"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{student.fullName}</span>
                                        <span className="text-xs text-muted-foreground">{student.email}</span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-sm font-medium">{submission.studentId}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (prevSubmission) {
                                router.push(`/instructor/grading/${assignmentId}/submission/${prevSubmission.id}`)
                            }
                        }}
                        disabled={!prevSubmission}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (nextSubmission) {
                                router.push(`/instructor/grading/${assignmentId}/submission/${nextSubmission.id}`)
                            }
                        }}
                        disabled={!nextSubmission}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Main Grading Interface */}
            <div className="flex-1 p-6 lg:overflow-hidden overflow-auto">
                <GradingInterface
                    submission={submission}
                    assignment={assignment}
                    onGraded={() => {
                        // Invalidate queries handled by hook
                    }}
                />
            </div>
        </div>
    )
}
