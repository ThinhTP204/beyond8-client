'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { useIsMobile } from '@/hooks/useMobile'
import CourseList from './components/CourseList'
import CourseFilter from './components/CourseFilter'
import {
  topRatedCourses,
  newCourses,
  languageCourses,
  technologyCourses,
  aiCourses,
  designCourses,
  marketingCourses,
  type Course,
} from '@/lib/data/mockCourses'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Combine all courses
const allCourses: Course[] = [
  ...topRatedCourses,
  ...newCourses,
  ...languageCourses,
  ...technologyCourses,
  ...aiCourses,
  ...designCourses,
  ...marketingCourses,
]

export default function CoursesPage() {
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()

  const filteredCourses = useMemo(() => {
    let filtered = [...allCourses]

    // Search filter
    const search = searchParams.get('search')?.toLowerCase()
    if (search) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(search) ||
          course.instructor.toLowerCase().includes(search) ||
          course.description?.toLowerCase().includes(search) ||
          course.shortDescription?.toLowerCase().includes(search)
      )
    }

    // Category filter
    const category = searchParams.get('category')
    if (category && category !== 'all') {
      filtered = filtered.filter((course) => course.category === category)
    }

    // Level filter
    const level = searchParams.get('level')
    if (level && level !== 'all') {
      filtered = filtered.filter((course) => course.level === level)
    }

    // Price filter
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice) {
      filtered = filtered.filter((course) => course.price >= parseInt(minPrice))
    }
    if (maxPrice) {
      filtered = filtered.filter((course) => course.price <= parseInt(maxPrice))
    }

    // Rating filter
    const minRating = searchParams.get('minRating')
    if (minRating && minRating !== 'all') {
      const rating = parseFloat(minRating)
      filtered = filtered.filter((course) => course.rating >= rating)
    }

    // Language filter
    const language = searchParams.get('language')
    if (language) {
      filtered = filtered.filter((course) => course.language === language)
    }

    // Sort
    const sortBy = searchParams.get('sortBy') || 'createdDate'
    const isDescending = searchParams.get('isDescending') !== 'false'

    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price
          break
        case 'rating':
          comparison = a.rating - b.rating
          break
        case 'students':
          comparison = a.students - b.students
          break
        default:
          // Default sort by title
          comparison = a.title.localeCompare(b.title)
      }
      return isDescending ? -comparison : comparison
    })

    return filtered
  }, [searchParams])

  return (
    <div className="flex flex-col h-full">
       <Header />
      <div className={`space-y-16 py-12 ${
        isMobile ? 'px-4 py-8 space-y-8' : 'px-12 sm:px-16 lg:px-20'
      }`}>

        {/* Filters */}
        <div className="mb-8">
          <CourseFilter />
        </div>

        {/* Course List */}
        <CourseList courses={filteredCourses} />
      </div>
      <Footer />
    </div>
  )
}

