'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useGetCourseDetails, useGetCourseSummary } from '@/hooks/useCourse'
import type { CourseDetail, CourseSummary, LessonSummary, SectionSummary, SectionDetail } from '@/lib/api/services/fetchCourse'
import type { Lesson } from '@/lib/api/services/fetchLesson'
import { useAuth } from '@/hooks/useAuth'
import { useCheckEnrollment } from '@/hooks/useEnroll'
import VideoLesson from './components/VideoLesson'
import TextLesson from './components/TextLesson'
import LessonInfo from './components/LessonInfo'
import { Skeleton } from '@/components/ui/skeleton'
import { formatHls, getHlsVariants } from '@/lib/utils/formatHls'
import { useUserById } from '@/hooks/useUserProfile'


export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.courseId as string
  const slug = params?.slug as string
  const sectionId = params?.sectionId as string
  const lessonId = params?.lessonId as string
  const { isAuthenticated } = useAuth()
  // 1. Kiểm tra enrollment
  const {
    isEnrolled,
    isLoading: isCheckingEnroll
  } = useCheckEnrollment(courseId, {
    enabled: !!courseId && isAuthenticated,
  })

  // 2. Xác định mode tương tự layout
  const shouldFetchDetails = isAuthenticated && !isCheckingEnroll && isEnrolled
  const shouldFetchSummary = !isAuthenticated || (!isCheckingEnroll && !isEnrolled)

  // 3. Fetch data tương ứng
  const {
    courseDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useGetCourseDetails(courseId || "", {
    enabled: !!courseId && shouldFetchDetails,
  })

  const {
    courseSummary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useGetCourseSummary(courseId || "", {
    enabled: !!courseId && shouldFetchSummary,
  })

  // Check if params exist
  if (!courseId || !slug || !sectionId || !lessonId) {
    router.push('/courses')
    return null
  }

  // 4. Determine final state
  const mode = shouldFetchDetails ? 'details' : 'summary'
  const isLoading = isCheckingEnroll || (shouldFetchDetails ? isLoadingDetails : isLoadingSummary)
  const isError = shouldFetchDetails ? isErrorDetails : isErrorSummary
  const course = (shouldFetchDetails ? courseDetails : courseSummary) as CourseDetail | CourseSummary

  if (isLoading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-0 lg:p-6">
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full h-64" />
      </div>
    )
  }

  if (isError || !course) {
    router.push('/courses')
    return null
  }

  // Find current section and lesson
  type AnySection = SectionSummary | SectionDetail
  type AnyLesson = LessonSummary | Lesson

  const section = (course.sections as AnySection[]).find((s) => s.id === sectionId)
  const lesson = section?.lessons.find((l) => l.id === lessonId) as AnyLesson | undefined

  if (!section || !lesson) {
    router.push(`/courses/${slug}/${courseId}`)
    return null
  }

  if (mode === 'details' && (!isAuthenticated || !isEnrolled) && !lesson.isPreview) {
    router.push(`/courses/${slug}/${courseId}`)
    return null
  }

  // Resolve video URL from lesson (support hlsVariants & original URL, nhiều dạng dữ liệu)
  const resolveVideoUrlFromLesson = (lesson: AnyLesson): { url: string | undefined; variants: ReturnType<typeof getHlsVariants> } | undefined => {
    // Chỉ xử lý cho bài học video
    if (lesson.type !== 'Video') return undefined

    // Ưu tiên dùng hlsVariants nếu có
    let rawHlsVariants: string | null | undefined = null
    if ('hlsVariants' in lesson) {
      rawHlsVariants = lesson.hlsVariants
    }

    // Fallback sang videoOriginalUrl nếu có
    let originalUrl: string | undefined
    if ('videoOriginalUrl' in lesson && lesson.videoOriginalUrl) {
      originalUrl = lesson.videoOriginalUrl
    }

    const resolvedFromHls = formatHls(rawHlsVariants ?? null)
    const variants = getHlsVariants(rawHlsVariants ?? null)

    const final = resolvedFromHls ?? originalUrl

    return { url: final, variants }
  }

  const { url: videoUrl, variants } = resolveVideoUrlFromLesson(lesson) || {}

  return (
    <div className="w-full max-w-[1450px] mx-auto p-0 lg:p-6">
      {lesson.type === 'Video' && (
        <>
          <VideoLesson
            title={lesson.title}
            description={lesson.description}
            videoUrl={videoUrl}
            thumbnailUrl={'videoThumbnailUrl' in lesson ? lesson.videoThumbnailUrl : null}
            variants={variants}
            durationSeconds={
              'durationSeconds' in lesson ? lesson.durationSeconds : null
            }
          />
          <LessonInfo
            course={course}
            currentLesson={lesson as Lesson}
            slug={slug}
            courseId={courseId}
          />
        </>
      )}
      {lesson.type === 'Text' && (
        <>
          <LessonInfo
            course={course}
            currentLesson={lesson as Lesson}
            slug={slug}
            courseId={courseId}
          />
          <TextLesson
            title={lesson.title}
            content={'textContent' in lesson ? lesson.textContent : null}
          />
        </>
      )}
    </div>
  )
}
