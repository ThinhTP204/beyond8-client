import { getCourseDetailById } from '@/lib/data/mockCourseDetail'
import { redirect } from 'next/navigation'
import LearningLayoutClient from './components/LearningLayoutClient'

interface SectionLayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
    courseId: string
    sectionId: string
  }>
}

export default async function Layout({ children, params }: SectionLayoutProps) {
  const resolvedParams = await params
  const course = getCourseDetailById(resolvedParams.courseId)

  if (!course) {
    redirect('/courses')
  }

  return (
    <LearningLayoutClient 
      courseId={resolvedParams.courseId} 
      params={resolvedParams}
    >
      {children}
    </LearningLayoutClient>
  )
}
