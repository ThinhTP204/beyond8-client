'use client'

import { CourseSummary, CourseDetail as CourseDetailType } from '@/lib/api/services/fetchCourse'
import CourseHero from './CourseHero'
import CourseSidebar from './CourseSidebar'
import CourseCurriculum from './CourseCurriculum'
import CourseDescription from './CourseDescription'
interface CourseDetailProps {
  courseData: CourseSummary | CourseDetailType
  /**
   * summary: dùng cho trang public (useGetCourseSummary)
   * preview: dùng cho instructor preview (useGetCourseDetailsPreview)
   */
  mode: 'summary' | 'details' | 'preview'
  onLessonSelect?: (sectionId: string, lessonId: string) => void
  instructor?: {
    name: string
    avatar?: string
    bio?: string
  }
}

export default function CourseDetail({ courseData, mode, onLessonSelect, instructor }: CourseDetailProps) {
  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Section - Full Width */}
      <CourseHero course={courseData} instructor={instructor} />

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">

            {/* Description & Outcomes */}
            <div id="description">
              <CourseDescription course={courseData} />
            </div>

            {/* Curriculum */}
            <div id="curriculum" className="scroll-mt-24">
              <CourseCurriculum course={courseData} mode={mode} onLessonSelect={onLessonSelect} />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 relative">
            <CourseSidebar course={courseData} preview={mode === 'preview'} />
          </div>
        </div>
      </div>
    </div>
  )
}
