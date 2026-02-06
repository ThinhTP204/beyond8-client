'use client'

import Link from 'next/link'
import { MyEnrollmentData } from '@/lib/api/services/fetchEnroll'
import SafeImage from '@/components/ui/SafeImage'
import { Progress } from '@/components/ui/progress'

interface MyEnrollmentCardProps {
  enrollment: MyEnrollmentData
}

export default function MyEnrollmentCard({ enrollment }: MyEnrollmentCardProps) {
  const courseUrl = `/courses/${enrollment.slug}/${enrollment.courseId}`

  return (
    <Link href={courseUrl} className="block h-full">
      <div className="group cursor-pointer h-full flex flex-col">
        {/* Image - Square aspect ratio */}
        <div className="relative w-full aspect-square mb-2 rounded-xl overflow-hidden">
          <SafeImage
            src={enrollment.courseThumbnailUrl || '/bg-web.jpg'}
            alt={enrollment.courseTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col group-hover:text-primary transition-colors duration-300">
          <h3 className="font-semibold text-base mb-1.5 line-clamp-2 min-h-[2.5rem]">
            {enrollment.courseTitle}
          </h3>
          <p className="text-xs text-muted-foreground mb-2 group-hover:text-primary/80 transition-colors duration-300">
            {enrollment.instructorName}
          </p>

          {/* Progress */}
          <div className="mt-auto pt-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tiến độ</span>
              <span className="font-medium text-primary">{Math.round(enrollment.progressPercent)}%</span>
            </div>
            <Progress value={enrollment.progressPercent} className="h-2" />
          </div>
        </div>
      </div>
    </Link>
  )
}
