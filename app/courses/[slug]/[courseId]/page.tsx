'use client'

import { useParams } from 'next/navigation'
import CourseDetail from './components/CourseDetail'
import NotFound from './not-found'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getCourseDetailById } from '@/lib/data/mockCourseDetail'
import {
  topRatedCourses,
  newCourses,
  languageCourses,
  technologyCourses,
  aiCourses,
  designCourses,
  marketingCourses,
} from '@/lib/data/mockCourses'

// Combine all courses to find by ID
const allCourses = [
  ...topRatedCourses,
  ...newCourses,
  ...languageCourses,
  ...technologyCourses,
  ...aiCourses,
  ...designCourses,
  ...marketingCourses,
]

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params?.courseId as string
  const slug = params?.slug as string

  // Check if params exist
  if (!courseId || !slug) {
    return <NotFound />
  }

  // Find course by ID to verify it exists
  const course = allCourses.find((c) => c.id === courseId)
  
  // Verify slug matches (optional check)
  if (course && course.slug && course.slug !== slug) {
    // Slug doesn't match, but we'll still show the course if ID matches
    // In production, you might want to redirect to correct slug
  }

  if (!course) {
    return <NotFound />
  }

  // Get course detail data (this always returns something, but we merge with course data)
  const courseDetail = getCourseDetailById(courseId)
  
  // Update courseDetail with course data to ensure consistency
  const finalCourseDetail = {
    ...courseDetail,
    id: course.id,
    title: course.title,
    price: course.price,
    rating: course.rating,
    students: course.students,
    category: course.category,
    level: course.level,
    duration: course.duration,
    thumbnailUrl: course.thumbnailUrl,
    language: course.language,
    description: course.description || courseDetail.description,
    shortDescription: course.shortDescription || courseDetail.shortDescription,
    outcomes: course.outcomes || courseDetail.outcomes,
    requirements: course.requirements || courseDetail.requirements,
    targetAudience: course.targetAudience || courseDetail.targetAudience,
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 w-full">
        <CourseDetail courseDetail={finalCourseDetail} />
      </div>
      <Footer />
    </div>
  )
}
