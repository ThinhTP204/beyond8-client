"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { GradingView } from "./GradingView"

export function GradingExplorer() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const selectedCourseId = searchParams.get('courseId')
    const selectedAssignmentId = searchParams.get('assignmentId')

    // URL sync logic can go here if needed, similar to QuestionBankExplorer

    const handleCourseClick = (courseId: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('courseId', courseId)
        // Reset assignment when changing course
        if (params.has('assignmentId')) params.delete('assignmentId')
        router.push(`?${params.toString()}`)
    }

    const handleAssignmentClick = (assignmentId: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('assignmentId', assignmentId)
        router.push(`?${params.toString()}`)
    }

    const handleBackToCourses = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('courseId')
        params.delete('assignmentId')
        router.push(`?${params.toString()}`)
    }

    const handleBackToAssignments = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('assignmentId')
        router.push(`?${params.toString()}`)
    }

    return (
        <GradingView
            selectedCourseId={selectedCourseId}
            selectedAssignmentId={selectedAssignmentId}
            onCourseClick={handleCourseClick}
            onAssignmentClick={handleAssignmentClick}
            onBackToCourses={handleBackToCourses}
            onBackToAssignments={handleBackToAssignments}
        />
    )
}
