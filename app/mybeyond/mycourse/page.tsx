'use client'

import { useGetMyEnrollments } from '@/hooks/useEnroll'
import MyEnrollmentList from './components/MyEnrollmentList'

export default function MyCoursePage() {
  const { enrollments, isLoading } = useGetMyEnrollments()

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MyEnrollmentList enrollments={enrollments} isLoading={isLoading} />
      </main>
    </div>
  )
}