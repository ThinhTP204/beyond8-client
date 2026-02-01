import { 
  InstructorProfileResponse, 
  VerificationStatus 
} from '@/lib/api/services/fetchInstructorRegistration'
import {
  topRatedCourses,
  newCourses,
  languageCourses,
  technologyCourses,
  aiCourses,
  designCourses,
  marketingCourses,
  type Course
} from '@/lib/data/mockCourses'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import InstructorProfileHeader from '../components/InstructorProfileHeader'
import InstructorBio from '../components/InstructorBio'
import InstructorCourses from '../components/InstructorCourses'
import InstructorContact from '../components/InstructorContact'

// Combine all courses for filtering
const allCourses: Course[] = [
  ...topRatedCourses,
  ...newCourses,
  ...languageCourses,
  ...technologyCourses,
  ...aiCourses,
  ...designCourses,
  ...marketingCourses,
]

// Mock data based on InstructorProfileResponse
const mockInstructorProfile: InstructorProfileResponse = {
  id: 'instructor-001',
  user: {
    id: 'user-001',
    email: 'nguyenvana@example.com',
    fullName: 'Nguyễn Văn A',
    dateOfBirth: '1990-01-01',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    coverUrl: null
  },
  bio: 'Giảng viên với hơn 10 năm kinh nghiệm trong lĩnh vực Machine Learning và Data Science. Đã từng làm việc tại các công ty công nghệ hàng đầu và có nhiều nghiên cứu được công bố trên các tạp chí quốc tế.',
  headline: 'Senior Data Scientist & AI Researcher',
  expertiseAreas: ['Machine Learning', 'Data Science', 'Python', 'AI'],
  education: [
    {
      school: 'Đại học Bách Khoa Hà Nội',
      degree: 'Tiến sĩ',
      fieldOfStudy: 'Khoa học máy tính',
      start: 2008,
      end: 2012
    }
  ],
  workExperience: [
    {
      company: 'Google AI',
      role: 'Senior Researcher',
      from: '2018',
      to: 'Present',
      isCurrentJob: true,
      description: 'Nghiên cứu các mô hình Deep Learning mới.'
    },
    {
      company: 'VinAI',
      role: 'Research Scientist',
      from: '2015',
      to: '2018',
      isCurrentJob: false,
      description: 'Phát triển các ứng dụng AI cho xe tự hành.'
    }
  ],
  socialLinks: {
    website: 'https://nguyenvana.dev',
    linkedIn: 'https://linkedin.com/in/nguyenvana',
    facebook: null
  },
  certificates: [
    {
      name: 'TensorFlow Developer Certificate',
      url: '#',
      issuer: 'Google',
      year: 2020
    }
  ],
  teachingLanguages: ['Tiếng Việt', 'English'],
  introVideoUrl: null,
  totalStudents: 50000,
  totalCourses: 15,
  avgRating: 4.9,
  verificationStatus: VerificationStatus.Verified,
  verifiedAt: '2023-01-01',
  createdAt: '2022-01-01',
  updatedAt: null,
}

interface PageProps {
  params: {
    slug: string
    courseId: string
    instructorId: string
  }
}

export default function InstructorProfilePage({  }: PageProps) {
  // Use the new mock profile
  const instructor = mockInstructorProfile

  // Filter courses logic adjusted for new structure
  const instructorCourses = allCourses.filter(
    (c) => c.instructor === instructor.user.fullName || c.instructor?.includes('Nguyễn Văn')
  )
  const displayCourses = instructorCourses.length > 0 ? instructorCourses : allCourses.slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20">
        <InstructorProfileHeader 
          instructor={instructor} 
          courseCount={instructor.totalCourses || displayCourses.length} 
        />

        <div className="container px-4 md:px-8 max-w-7xl mx-auto -mt-8 relative z-20 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <InstructorBio instructor={instructor} />
               <InstructorCourses courses={displayCourses} />
            </div>

            <div className="space-y-6">
               <InstructorContact instructor={instructor} />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}

