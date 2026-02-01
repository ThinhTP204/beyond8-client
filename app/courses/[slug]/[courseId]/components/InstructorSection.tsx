'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import {
  Star,
  Users,
  PlayCircle,
  Globe,
  Linkedin,
  Twitter,
  Youtube,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatNumber } from '@/lib/utils/formatCurrency'

import type { CourseDetail } from '@/lib/data/mockCourseDetail'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'

interface InstructorSectionProps {
  instructor: CourseDetail['instructor']
}

export default function InstructorSection({ instructor }: InstructorSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const params = useParams()
  
  const profileUrl = `/courses/${params.slug}/${params.courseId}/instructor/${instructor.id}`

  return (
    <div className="space-y-4">
       <h2 className="text-2xl font-bold">Giảng viên</h2>
       <Card className="overflow-hidden border-brand-purple/10 hover:border-brand-purple/30 transition-colors">
         <div className="h-24 bg-gradient-to-r from-brand-pink/20 to-brand-purple/20" />
         <CardContent className="px-6 pb-6 -mt-12">
            <div className="flex flex-col md:flex-row gap-6">
               {/* Avatar */}
               <div className="flex flex-col items-center md:items-start shrink-0">
                  <Link href={profileUrl}>
                     <Avatar className="w-24 h-24 ring-4 ring-background border-2 border-brand-purple/20 cursor-pointer hover:ring-brand-purple/30 transition-all">
                        <AvatarImage src={formatImageUrl(instructor.avatarUrl)} alt={instructor.fullName} />
                        <AvatarFallback className="text-2xl">{instructor.fullName.charAt(0)}</AvatarFallback>
                     </Avatar>
                  </Link>
                  <div className="mt-4 flex gap-2">
                     {instructor.socialLinks?.website && (
                        <a href={instructor.socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-brand-purple hover:text-white transition-colors">
                           <Globe className="w-4 h-4" />
                        </a>
                     )}
                     {instructor.socialLinks?.linkedin && (
                        <a href={instructor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-brand-purple hover:text-white transition-colors">
                           <Linkedin className="w-4 h-4" />
                        </a>
                     )}
                     {instructor.socialLinks?.twitter && (
                        <a href={instructor.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-brand-purple hover:text-white transition-colors">
                           <Twitter className="w-4 h-4" />
                        </a>
                     )}
                      {instructor.socialLinks?.youtube && (
                        <a href={instructor.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-brand-purple hover:text-white transition-colors">
                           <Youtube className="w-4 h-4" />
                        </a>
                     )}
                  </div>
               </div>

               {/* Info */}
               <div className="flex-1 space-y-4 text-center md:text-left pt-2 md:pt-12">
                  <div>
                     <Link href={profileUrl}>
                        <h3 className="text-xl font-bold hover:text-brand-purple cursor-pointer transition-colors inline-block">
                           {instructor.fullName}
                        </h3>
                     </Link>
                     {instructor.title && (
                        <p className="text-brand-pink font-medium">{instructor.title}</p>
                     )}
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8">
                      <div className="flex items-center gap-2 text-sm">
                         <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                         <span className="font-bold">{instructor.rating}</span>
                         <span className="text-muted-foreground">Đánh giá</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                         <Users className="w-4 h-4 text-brand-purple" />
                         <span className="font-bold">{formatNumber(instructor.totalStudents || 1234)}</span>
                         <span className="text-muted-foreground">Học viên</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                          <PlayCircle className="w-4 h-4 text-brand-purple" />
                          <span className="font-bold">12</span>
                          <span className="text-muted-foreground">Khóa học</span>
                      </div>
                  </div>
                  
                  {instructor.bio && (
                     <div className="relative">
                        <div className={`text-muted-foreground leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                           {instructor.bio}
                        </div>
                        <Button 
                           variant="ghost" 
                           size="sm" 
                           onClick={() => setIsExpanded(!isExpanded)}
                           className="mt-2 text-brand-purple hover:text-brand-pink hover:bg-transparent p-0 h-auto font-medium"
                        >
                           {isExpanded ? (
                              <span className="flex items-center gap-1">Thu gọn <ChevronUp className="w-4 h-4" /></span>
                           ) : (
                              <span className="flex items-center gap-1">Xem thêm <ChevronDown className="w-4 h-4" /></span>
                           )}
                        </Button>
                     </div>
                  )}
               </div>
            </div>
         </CardContent>
       </Card>
    </div>
  )
}
