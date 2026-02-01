'use client'

import Link from 'next/link'
import { Star, Users, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import SafeImage from '@/components/ui/SafeImage'
import { formatCurrency, formatNumber } from '@/lib/utils/formatCurrency'
import { generateSlug } from '@/lib/utils/generateSlug'
import type { Course } from '@/lib/data/mockCourses'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const slug = course.slug || generateSlug(course.title)
  const courseUrl = `/courses/${slug}/${course.id}`

  return (
    <Link href={courseUrl} target="_blank" className="block h-full">
      <div className="group cursor-pointer h-full flex flex-col">
        {/* Image - Square aspect ratio */}
        <div className="relative w-full aspect-square mb-2 rounded-xl overflow-hidden">
          <SafeImage
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 right-2 bg-primary rounded-lg text-xs px-1.5 py-0.5">
            {course.category}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col group-hover:text-primary transition-colors duration-300">
          <h3 className="font-semibold text-base mb-1.5 line-clamp-2 min-h-[2.5rem]">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-2 group-hover:text-primary/80 transition-colors duration-300">
            {course.instructor}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 group-hover:text-primary/70 transition-colors duration-300">
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Users className="w-3 h-3" />
              <span>{formatNumber(course.students)}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              <span>{course.duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <Badge
              variant="outline"
              className="rounded-md text-xs px-1.5 py-0.5 group-hover:border-primary group-hover:text-primary transition-colors duration-300"
            >
              {course.level}
            </Badge>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(course.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
