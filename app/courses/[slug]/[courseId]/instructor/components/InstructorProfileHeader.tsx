'use client'

import {
  Star,
  Users,
  PlayCircle,
  Globe,
  Linkedin,
  Facebook
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatNumber } from '@/lib/utils/formatCurrency'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import { InstructorProfileResponse } from '@/lib/api/services/fetchInstructorRegistration'

interface InstructorProfileHeaderProps {
  instructor: InstructorProfileResponse
  courseCount: number
}

export default function InstructorProfileHeader({ instructor, courseCount }: InstructorProfileHeaderProps) {
  return (
    <div className="relative bg-brand-dark overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-brand-dark to-brand-dark z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      
      <div className="container relative z-10 px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start text-center md:text-left">
          {/* Large Avatar */}
          <div className="relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-br from-brand-pink via-brand-magenta to-brand-purple rounded-full blur opacity-70" />
            <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-brand-dark relative bg-brand-dark">
              <AvatarImage src={formatImageUrl(instructor.user.avatarUrl)} alt={instructor.user.fullName} className="object-cover" />
              <AvatarFallback className="text-4xl bg-brand-purple/20 text-brand-pink">{instructor.user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-green-500 w-4 h-4 md:w-6 md:h-6 rounded-full border-4 border-brand-dark shadow-sm" title="Online" />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 md:pt-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                {instructor.user.fullName}
              </h1>
              <p className="text-xl text-brand-pink font-medium flex items-center justify-center md:justify-start gap-2">
                 {instructor.headline}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 py-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-lg">{instructor.avgRating || 5.0}</div>
                  <div className="text-xs text-zinc-400">Đánh giá chung</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="p-2 bg-brand-purple/20 rounded-lg">
                  <Users className="w-5 h-5 text-brand-purple" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-lg">{formatNumber(instructor.totalStudents || 0)}</div>
                  <div className="text-xs text-zinc-400">Học viên</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="p-2 bg-brand-pink/20 rounded-lg">
                  <PlayCircle className="w-5 h-5 text-brand-pink" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-lg">{instructor.totalCourses || courseCount}</div>
                  <div className="text-xs text-zinc-400">Khóa học</div>
                </div>
              </div>
            </div>

            {/* Social & Contact */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
               {instructor.socialLinks?.website && (
                  <Button size="sm" variant="outline" className="border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-brand-purple/50 bg-transparent" asChild>
                     <a href={instructor.socialLinks.website} target="_blank" rel="noopener noreferrer">
                       <Globe className="w-4 h-4 mr-2" /> Website
                     </a>
                  </Button>
               )}
               {instructor.socialLinks?.linkedIn && (
                  <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-[#0077b5] hover:bg-white/10" asChild>
                     <a href={instructor.socialLinks.linkedIn} target="_blank" rel="noopener noreferrer">
                       <Linkedin className="w-5 h-5" />
                     </a>
                  </Button>
               )}
               {instructor.socialLinks?.facebook && (
                  <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-[#1877F2] hover:bg-white/10" asChild>
                     <a href={instructor.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                       <Facebook className="w-5 h-5" />
                     </a>
                  </Button>
               )}
               <div className="w-px h-6 bg-white/10 mx-1" />
               <Button className="bg-white text-brand-dark hover:bg-zinc-200 font-semibold rounded-full">
                  Theo dõi giảng viên
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
