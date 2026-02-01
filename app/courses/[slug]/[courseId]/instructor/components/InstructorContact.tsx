'use client'

import { Mail, Star, Users, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InstructorProfileResponse } from '@/lib/api/services/fetchInstructorRegistration'

interface InstructorContactProps {
  instructor?: InstructorProfileResponse
}

export default function InstructorContact({ instructor }: InstructorContactProps) {
  return (
    <>
      <Card className="sticky top-24 border-brand-purple/20 shadow-xl shadow-brand-purple/5 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-brand-pink via-brand-magenta to-brand-purple" />
        <CardHeader>
          <CardTitle className="text-lg">Liên hệ hợp tác</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Bạn có thắc mắc hoặc muốn hợp tác? Hãy gửi tin nhắn trực tiếp cho giảng viên.
          </p>
          <Button className="w-full bg-gradient-to-r from-brand-purple to-brand-magenta hover:from-brand-purple/90 hover:to-brand-magenta/90 text-white shadow-lg shadow-brand-purple/20">
            <Mail className="w-4 h-4 mr-2" /> Gửi tin nhắn
          </Button>
        </CardContent>
      </Card>

      {/* Badges / Achievements Mockup */}
      <Card className="overflow-hidden mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Thành tích</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="px-3 py-1.5 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">
              <Star className="w-3 h-3 mr-1 fill-current" /> Top Rated
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">
              <Users className="w-3 h-3 mr-1" /> {instructor?.totalStudents ? `${(instructor.totalStudents/1000).toFixed(0)}k+` : '10k+'} Học viên
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5 bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
              <PlayCircle className="w-3 h-3 mr-1" /> {instructor?.totalCourses || 10}+ Khóa học
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
