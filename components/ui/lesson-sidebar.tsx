'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize, CheckCircle2, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ReactPlayer from 'react-player'
import { Button } from '@/components/ui/button'
import { CourseDetail, Section, Lesson } from '@/lib/data/mockCourseDetail'
import { cn } from '@/lib/utils'

// Dynamic import for SSR
const DynamicReactPlayer = dynamic(() => Promise.resolve(ReactPlayer), { 
  ssr: false,
  loading: () => <div className="w-full aspect-video bg-black animate-pulse rounded-lg" />
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any

interface LessonSidebarProps {
  course: CourseDetail
  isSidebarOpen: boolean
  isMobile: boolean
  onClose: () => void
  onOpen: () => void
}

export default function LessonSidebar({ course, isSidebarOpen, isMobile, onClose, onOpen }: LessonSidebarProps) {
  const params = useParams() as { slug: string; courseId: string; sectionId?: string; lessonId?: string }
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  
  // Video preview state
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)

  // Find current lesson using useMemo
  const currentLesson = useMemo(() => {
    if (params.sectionId && params.lessonId) {
      const section = course.sections.find(s => s.id === params.sectionId)
      return section?.lessons.find(l => l.id === params.lessonId) || null
    }
    return null
  }, [params.sectionId, params.lessonId, course.sections])

  // Initialize expanded sections - only expand new section, keep existing ones
  useEffect(() => {
    if (currentLesson && params.sectionId) {
      setExpandedSections(prev => ({
        ...prev,
        [params.sectionId!]: true
      }))
    } else if (course.sections.length > 0 && Object.keys(expandedSections).length === 0) {
      // Only set initial if no sections are expanded
      setExpandedSections({ [course.sections[0].id]: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.sectionId, params.lessonId])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const togglePlay = () => {
    setPlaying(!playing)
  }

  const toggleMute = () => {
    setMuted(!muted)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen()
    }
  }

  const getLessonUrl = (section: Section, lesson: Lesson) => {
    return `/courses/${params.slug}/${params.courseId}/${section.id}/${lesson.id}`
  }

  const videoUrl = currentLesson?.videoUrl || "https://d30z0qh7rhzgt8.cloudfront.net/courses/hls/meo_con_lon_ton/meo_con_lon_ton_1080p.m3u8"

  return (
    <>
      <AnimatePresence initial={false}>
        {(isSidebarOpen || !isMobile) && (
          <motion.div
            key="lesson-sidebar-container"
            initial={isMobile && !isSidebarOpen ? { x: '100%' } : false}
            animate={isMobile ? { x: 0 } : { width: 400, opacity: 1 }}
            exit={isMobile ? { x: '100%' } : { width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed inset-y-0 right-0 z-40 bg-[#12121a] border-l border-white/10 w-[85vw] sm:w-[400px] shadow-2xl lg:relative lg:block lg:shadow-none flex flex-col h-full",
              isMobile && "top-[64px]"
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
              <h3 className="font-bold text-lg">Nội dung khóa học</h3>
              {!isMobile && (
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white/50 hover:text-white">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
            </div>
            
            <div 
              className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="space-y-4">
                {/* Video Preview for Current Lesson */}
                {currentLesson?.videoUrl && (
                  <div 
                    ref={containerRef}
                    className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(false)}
                  >
                    <DynamicReactPlayer
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ref={(el: any) => {
                        playerRef.current = el
                      }}
                      url={videoUrl}
                      width="100%"
                      height="100%"
                      playing={playing}
                      muted={muted}
                      loop
                      playsinline
                      controls={false}
                      config={{
                        file: {
                          forceHLS: true,
                          attributes: {
                            crossOrigin: "anonymous",
                            style: { objectFit: 'contain', width: '100%', height: '100%' }
                          }
                        },
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />

                    {/* Custom Controls Overlay */}
                    <div 
                      className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300",
                        showControls ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePlay}
                          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-110 transition-all"
                        >
                          {playing ? (
                            <Pause className="h-6 w-6 text-white" />
                          ) : (
                            <Play className="h-6 w-6 text-white ml-1" />
                          )}
                        </Button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={togglePlay}
                            className="text-white hover:bg-white/10 rounded-full h-8 w-8"
                          >
                            {playing ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMute}
                            className="text-white hover:bg-white/10 rounded-full h-8 w-8"
                          >
                            {muted ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleFullscreen}
                          className="text-white hover:bg-white/10 rounded-full h-8 w-8"
                        >
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sections List */}
                <div className="space-y-2">
                  {course.sections.map((section) => (
                    <div key={section.id} className="border border-white/10 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 text-left">
                          <span className="text-sm font-medium text-white/90">
                            {section.order}. {section.title}
                          </span>
                          <span className="text-xs text-white/50">
                            ({section.lessons.length} bài)
                          </span>
                        </div>
                        <span className={cn(
                          "text-white/50 transition-transform",
                          expandedSections[section.id] && "rotate-90"
                        )}>
                          ▶
                        </span>
                      </button>

                      {expandedSections[section.id] && (
                        <div className="border-t border-white/10">
                          {section.lessons.map((lesson) => {
                            const isActive = params.lessonId === lesson.id
                            const lessonUrl = getLessonUrl(section, lesson)
                            
                            return (
                              <Link
                                key={lesson.id}
                                href={lessonUrl}
                                className={cn(
                                  "block px-4 py-2.5 hover:bg-white/5 transition-colors border-l-2",
                                  isActive 
                                    ? "border-brand-pink bg-white/5" 
                                    : "border-transparent"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="flex-shrink-0">
                                    {lesson.isPreview ? (
                                      <Play className="h-4 w-4 text-white/50" />
                                    ) : (
                                      <Lock className="h-4 w-4 text-white/30" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={cn(
                                      "text-sm truncate",
                                      isActive ? "text-white font-medium" : "text-white/70"
                                    )}>
                                      {lesson.order}. {lesson.title}
                                    </div>
                                    <div className="text-xs text-white/50 mt-0.5">
                                      {lesson.duration}
                                    </div>
                                  </div>
                                  {isActive && (
                                    <CheckCircle2 className="h-4 w-4 text-brand-pink flex-shrink-0" />
                                  )}
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Sidebar Button (Desktop - When Closed) */}
      {!isSidebarOpen && !isMobile && (
        <motion.button
          initial={{ marginRight: -50 }}
          animate={{ marginRight: 0 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-[#12121a] border border-white/10 border-r-0 rounded-l-xl p-2 text-white/70 hover:text-brand-pink shadow-lg hover:pr-4 transition-all"
          onClick={onOpen}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      )}
    </>
  )
}
