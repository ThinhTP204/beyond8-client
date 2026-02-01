import { redirect } from 'next/navigation'
import { getCourseDetailById } from '@/lib/data/mockCourseDetail'
import VideoLesson from './components/VideoLesson'
import LessonInfo from './components/LessonInfo'

interface LessonPageProps {
  params: Promise<{
    slug: string
    courseId: string
    sectionId: string
    lessonId: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = await params
  const course = getCourseDetailById(resolvedParams.courseId)
  
  if (!course) {
    redirect('/courses')
  }

  // Find current section and lesson
  const section = course.sections.find(s => s.id === resolvedParams.sectionId)
  const lesson = section?.lessons.find(l => l.id === resolvedParams.lessonId)

  if (!section || !lesson) {
    redirect(`/courses/${resolvedParams.slug}/${resolvedParams.courseId}`)
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto p-0 lg:p-6">
      <VideoLesson 
        title={lesson.title}
        videoUrl={lesson.videoUrl}
      />
      <LessonInfo course={course} currentLesson={lesson} />
    </div>
  )
}
