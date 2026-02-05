import apiService, { RequestParams } from '../core'
import type { ApiResponse } from '@/types/api'

export enum SubmissionType {
    Text = 'Text',
    File = 'File',
    Both = 'Both',
}

export enum GradingMode {
    AiAssisted = 'AiAssisted',
}

export interface Attachment {
    name: string
    url: string
}

export interface CreateAssignmentRequest {
    courseId: string | null
    sectionId: string | null
    title: string
    description: string
    attachmentUrls: Attachment[]
    submissionType: SubmissionType | string
    allowedFileTypes: string[]
    maxTextLength: number | null
    gradingMode: GradingMode | string
    totalPoints: number
    rubricUrl: string | null
    timeLimitMinutes: number | null
}

export interface UpdateAssignmentRequest {
    courseId: string | null
    sectionId: string | null
    title: string
    description: string
    attachmentUrls: Attachment[]
    submissionType: SubmissionType | string
    allowedFileTypes: string[]
    maxTextLength: number | null
    gradingMode: GradingMode | string
    totalPoints: number
    rubricUrl: string | null
    timeLimitMinutes: number | null
}

export interface Assignment {
    id: string
    instructorId: string
    courseId: string | null
    sectionId: string | null
    title: string
    totalSubmissions: number
    averageScore: number | null
    createdAt: string
    updatedAt: string
    rubricUrl: string | null
    totalPoints: number
    timeLimitMinutes: number | null
    maxTextLength: number | null
    allowedFileTypes: string[]
    description: string
    attachmentUrls: Attachment[]
    submissionType: SubmissionType | string
    gradingMode: GradingMode | string

}

export interface ParamsAssignment {
    courseId: string
    sectionId: string
    pageNumber: number
    pageSize: number
    isDescending: boolean
}

export interface CreateAssignmentResponse extends ApiResponse<Assignment> {
    isSuccess: boolean
    message: string
    data: Assignment
    metadata: null | unknown
}

export interface UpdateAssignmentResponse extends ApiResponse<Assignment> {
    isSuccess: boolean
    message: string
    data: Assignment
    metadata: null | unknown
}

export interface GetAssignmentResponse {
    isSuccess: boolean
    message: string
    data: Assignment[]
    metadata: null | unknown
}

export interface AssignmentResponse {
    isSuccess: boolean
    message: string
    data: Assignment
    metadata: null | unknown
}


const convertAssignmentParamsToQuery = (params: ParamsAssignment): RequestParams => {
    const query: RequestParams = {}
    if (params.courseId) query.courseId = params.courseId
    if (params.sectionId) query.sectionId = params.sectionId
    if (params.pageNumber) query.pageNumber = params.pageNumber
    if (params.pageSize) query.pageSize = params.pageSize
    if (params.isDescending !== undefined) query.isDescending = params.isDescending
    return query
}


export const assignmentService = {
    createAssignment: async (data: CreateAssignmentRequest): Promise<AssignmentResponse> => {
        const response = await apiService.post<AssignmentResponse, CreateAssignmentRequest>('api/v1/assignments', data)
        return response.data
    },

    updateAssignment: async (id: string, data: UpdateAssignmentRequest): Promise<AssignmentResponse> => {
        const response = await apiService.put<AssignmentResponse, UpdateAssignmentRequest>(`api/v1/assignments/${id}`, data)
        return response.data
    },

    getAssignmentById: async (id: string): Promise<AssignmentResponse> => {
        const response = await apiService.get<AssignmentResponse>(`api/v1/assignments/${id}`)
        return response.data
    },

    getAllAssignment: async (params: ParamsAssignment): Promise<GetAssignmentResponse> => {
        const response = await apiService.get<GetAssignmentResponse>(`api/v1/assignments`, convertAssignmentParamsToQuery(params))
        return response.data
    },

    deleteAssignment: async (id: string): Promise<AssignmentResponse> => {
        const response = await apiService.delete<AssignmentResponse>(`api/v1/assignments/${id}`)
        return response.data
    }
}