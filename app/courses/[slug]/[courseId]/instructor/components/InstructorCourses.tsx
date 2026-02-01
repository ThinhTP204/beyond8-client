'use client'

import CourseCard from '@/app/courses/components/CourseCard'
import { Course } from '@/lib/data/mockCourses'

interface InstructorCoursesProps {
  courses: Course[]
}

export default function InstructorCourses({ courses }: InstructorCoursesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold border-l-4 border-brand-pink pl-3">Các khóa học ({courses.length})</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(course => (
          <div key={course.id} className="h-full">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  )
}
