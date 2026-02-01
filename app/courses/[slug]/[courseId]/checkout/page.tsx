"use client";

import { useParams, useRouter } from "next/navigation";
import { getCourseDetailById } from "@/lib/data/mockCourseDetail";
import { topRatedCourses, newCourses, languageCourses, technologyCourses, aiCourses, designCourses, marketingCourses } from "@/lib/data/mockCourses";
import OrderSummary from "./components/OrderSummary";
import CheckoutForm from "./components/CheckoutForm";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QrCode } from "lucide-react";

// Combine all courses to find match
const allCourses = [
  ...topRatedCourses,
  ...newCourses,
  ...languageCourses,
  ...technologyCourses,
  ...aiCourses,
  ...designCourses,
  ...marketingCourses,
];

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  
  // Fetch course data
  const courseBasic = allCourses.find((c) => c.id === courseId);
  const courseDetail = getCourseDetailById(courseId);
  
  // Merge data
  const course = courseBasic ? {
     ...courseDetail,
     title: courseBasic.title,
     thumbnailUrl: courseBasic.thumbnailUrl,
     price: courseBasic.price
  } : null;

  if (!course) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
           <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Khóa học không tồn tại</h1>
              <Button onClick={() => router.back()} className="mt-4">Quay lại</Button>
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen font-sans">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Form */}
            <div className="lg:col-span-8 space-y-8">
               <div className="p-6 md:p-8 rounded-lg border border-brand-magenta/20 shadow-xl shadow-brand-magenta/5 backdrop-blur-xl bg-white/80 dark:bg-black/80">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-magenta/5 text-brand-magenta font-semibold text-sm mb-2 border border-brand-magenta/10">
                    <QrCode className="w-4 h-4" />
                    <span>Cổng thanh toán VNPay</span>
                 </div>                  
                  <CheckoutForm />
               </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4">
               <OrderSummary course={{
                  title: course.title,
                  thumbnailUrl: course.thumbnailUrl,
                  price: course.price
               }} />
            </div>
         </div>
      </main>

      <Footer />
    </div>
  );
}
