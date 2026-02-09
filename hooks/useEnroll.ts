import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchEnroll,
  EnrollmentResponse,
  CheckEnrollmentResponse,
  MyEnrollmentsResponse,
  MyEnrollmentData,
  CurriculumProgressResponse,
  CurriculumProgressData,
} from "@/lib/api/services/fetchEnroll";
import { toast } from "sonner";

interface UseCheckEnrollmentOptions {
  enabled?: boolean;
}

// Hook kiểm tra xem user hiện tại đã enroll khoá học hay chưa
export function useCheckEnrollment(
  courseId?: string,
  options?: UseCheckEnrollmentOptions
) {
  const { data, isLoading, isError, refetch } = useQuery<
    CheckEnrollmentResponse,
    Error,
    boolean
  >({
      queryKey: ["enrollments", "check", courseId],
    queryFn: () => fetchEnroll.checkEnrollment(courseId as string),
    enabled: options?.enabled ?? !!courseId,
    select: (res) => res.data,
  });

  return {
    isEnrolled: data ?? false,
    isLoading,
    isError,
    refetch,
  };
}

// Hook để enroll khoá học cho user hiện tại
export function useEnrollCourse() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    EnrollmentResponse,
    Error,
    string
  >({
    mutationFn: (courseId: string) => fetchEnroll.enrollCourse(courseId),
    onSuccess: (data, courseId) => {
      // Cập nhật lại trạng thái enroll và course summary sau khi tham gia khoá học
      queryClient.invalidateQueries({
        queryKey: ["enrollments", "check", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", "summary", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", "details", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses", "public"],
      });

      if (data.isSuccess) {
        toast.success("Tham gia khóa học thành công!");
      } else {
        toast.error(data.message || "Không thể tham gia khóa học!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Không thể tham gia khóa học!");
    },
  });

  return {
    enrollCourse: mutateAsync,
    isPending,
  };
}

// Hook lấy danh sách các khóa học mà user hiện tại đã đăng ký
export function useGetMyEnrollments(options?: { enabled?: boolean }) {
  const { data, isLoading, isError, refetch } = useQuery<
    MyEnrollmentsResponse,
    Error,
    MyEnrollmentData[]
  >({
    queryKey: ["enrollments", "me"],
    queryFn: () => fetchEnroll.getMyEnrollments(),
    enabled: options?.enabled ?? true,
    select: (res) => res.data,
  });

  return {
    enrollments: data ?? [],
    isLoading,
    isError,
    refetch,
  };
}

// Hook lấy curriculum progress của enrollment
export function useGetCurriculumProgress(
  enrollmentId?: string,
  options?: { enabled?: boolean }
) {
  const { data, isLoading, isError, refetch } = useQuery<
    CurriculumProgressResponse,
    Error,
    CurriculumProgressData
  >({
    queryKey: ["enrollments", "curriculum-progress", enrollmentId],
    queryFn: () => fetchEnroll.getCurriculumProgress(enrollmentId as string),
    enabled: options?.enabled ?? !!enrollmentId,
    select: (res) => res.data,
  });

  return {
    curriculumProgress: data,
    isLoading,
    isError,
    refetch,
  };
}
