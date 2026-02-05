"use client";

import { useGetCourseSummary } from "@/hooks/useCourse";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import CourseDetail from "@/app/courses/[slug]/[courseId]/components/CourseDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CoursePreviewDialogProps {
    courseId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CoursePreviewDialog({
    courseId,
    open,
    onOpenChange,
}: CoursePreviewDialogProps) {
    const {
        courseSummary,
        isLoading,
        isError,
    } = useGetCourseSummary(courseId);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[calc(100vh-3rem)] p-0 rounded-t-xl" size="full">
                <SheetHeader className="px-4 py-3 border-b flex flex-row items-center justify-between space-y-0">
                    <SheetTitle>Xem trước khóa học</SheetTitle>

                </SheetHeader>

                <ScrollArea className="h-full max-h-[calc(100vh-8rem)]">
                    {isLoading ? (
                        <div className="container mx-auto px-4 py-8">
                            <Skeleton className="h-96 w-full mb-8" />
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-4">
                                    <Skeleton className="h-64 w-full" />
                                    <Skeleton className="h-64 w-full" />
                                </div>
                                <div className="lg:col-span-1">
                                    <Skeleton className="h-96 w-full" />
                                </div>
                            </div>
                        </div>
                    ) : isError || !courseSummary ? (
                        <div className="flex items-center justify-center h-full min-h-[50vh]">
                            <p className="text-muted-foreground">Không thể tải thông tin khóa học</p>
                        </div>
                    ) : (
                        <div className="pb-10">
                            <CourseDetail courseData={courseSummary} />
                        </div>
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
