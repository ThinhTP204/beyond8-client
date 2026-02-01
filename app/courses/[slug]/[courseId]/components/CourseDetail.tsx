'use client'

import type { CourseDetail as CourseDetailType } from '@/lib/data/mockCourseDetail'
import CourseHero from './CourseHero'
import CourseSidebar from './CourseSidebar'
import CourseCurriculum from './CourseCurriculum'
import CourseDescription from './CourseDescription'
import InstructorSection from './InstructorSection'

interface CourseDetailProps {
  courseDetail: CourseDetailType
}

export default function CourseDetail({ courseDetail }: CourseDetailProps) {
  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Section - Full Width */}
      <CourseHero course={courseDetail} />

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description & Outcomes */}
            <div id="description">
               <CourseDescription course={courseDetail} />
            </div>

            {/* Curriculum */}
            <div id="curriculum" className="scroll-mt-24">
               <CourseCurriculum course={courseDetail} />
            </div>

            {/* Instructor */}
            <div id="instructor" className="scroll-mt-24">
               <InstructorSection instructor={courseDetail.instructor} />
            </div>
            
            {/* Reviews (Placeholder for now, or could reuse existing simpler review logic) */}
            {/* <ReviewsSection ... /> */}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 relative">
             {/* This inner div is handled by the sticky logic inside CourseSidebar, 
                 but we place it here in the grid. 
                 Actually, CourseSidebar itself has 'sticky' class. */}
             <CourseSidebar course={courseDetail} />
          </div>
        </div>
      </div>
    </div>
  )
}
