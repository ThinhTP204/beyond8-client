'use client'

import { MapPin, Calendar, Briefcase, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InstructorProfileResponse } from '@/lib/api/services/fetchInstructorRegistration'

interface InstructorBioProps {
  instructor: InstructorProfileResponse
}

export default function InstructorBio({ instructor }: InstructorBioProps) {
  return (
    <div className="space-y-8">
      {/* Bio */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold border-l-4 border-brand-purple pl-3">Giới thiệu</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
            {instructor.bio || "Chưa có thông tin giới thiệu."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 not-prose">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h4 className="font-semibold flex items-center gap-2 mb-2 text-brand-purple">
                <MapPin className="w-4 h-4" /> Đến từ
              </h4>
              <p className="text-sm text-muted-foreground">Hanoi, Vietnam</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h4 className="font-semibold flex items-center gap-2 mb-2 text-brand-purple">
                <Calendar className="w-4 h-4" /> Tham gia từ
              </h4>
              <p className="text-sm text-muted-foreground">
                {instructor.createdAt ? new Date(instructor.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' }) : 'Unknown'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience & Education */}
      <div className="grid grid-cols-1 gap-6">
        {instructor.workExperience.length > 0 && (
           <Card className="border-none shadow-md">
             <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                   <Briefcase className="w-5 h-5 text-brand-purple" /> Kinh nghiệm làm việc
                </CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                {instructor.workExperience.map((exp, index) => (
                   <div key={index} className="relative pl-6 border-l-2 border-brand-purple/20 last:border-0 pb-6 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-purple/20 border-2 border-brand-purple" />
                      <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">{exp.role}</h4>
                      <p className="font-medium text-brand-pink">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                         {exp.from} - {exp.to || (exp.isCurrentJob ? 'Hiện tại' : 'Unknown')}
                      </p>
                      {exp.description && <p className="text-slate-600 dark:text-slate-400">{exp.description}</p>}
                   </div>
                ))}
             </CardContent>
           </Card>
        )}

        {instructor.education.length > 0 && (
           <Card className="border-none shadow-md">
             <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                   <GraduationCap className="w-5 h-5 text-brand-purple" /> Học vấn
                </CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                {instructor.education.map((edu, index) => (
                   <div key={index} className="relative pl-6 border-l-2 border-brand-purple/20 last:border-0 pb-6 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-purple/20 border-2 border-brand-purple" />
                      <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">{edu.school}</h4>
                      <p className="font-medium text-brand-pink">{edu.degree} - {edu.fieldOfStudy}</p>
                      <p className="text-sm text-muted-foreground">
                         {edu.start} - {edu.end}
                      </p>
                   </div>
                ))}
             </CardContent>
           </Card>
        )}
      </div>
    </div>
  )
}
