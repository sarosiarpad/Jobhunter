import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3030',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
    }),
    authenticateUser: builder.mutation({
      query: (authData) => ({
        url: '/authentication/authenticate',
        method: 'POST',
        body: authData,
      }),
    }),
    getUserInfo: builder.query({
      query: (userId) => `/users/${userId}`,
    }),
    getUserExperiences: builder.query({
      query: () => `/experiences`,
    }),
    addExperience: builder.mutation({
      query: (experience) => ({
        url: '/experiences/add',
        method: 'POST',
        body: experience,
      }),
    }),
    modifyExperience: builder.mutation({
      query: ({ id, experience }) => ({
        url: `/experiences/${id}`,
        method: 'PATCH',
        body: experience,
      }),
    }),
    deleteExperience: builder.mutation({
      query: (id) => ({
        url: `/experiences/${id}`,
        method: 'DELETE',
      }),
    }),
    getAllJobs: builder.query({
      query: (filters) => ({
        url: '/jobs',
        params: filters,
      }),
    }),
    getJobById: builder.query({
      query: (id) => ({
        url: `/jobs/${id}`
      })
    }),
    createJob: builder.mutation({
      query: (jobData) => ({
        url: '/jobs/create',
        method: 'POST',
        body: jobData,
      }),
    }),
    modifyJob: builder.mutation({
      query: ({ id, jobData }) => ({
        url: `/jobs/${id}`,
        method: 'PATCH',
        body: jobData,
      }),
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'DELETE',
      }),
    }),
    applyForJob: builder.mutation({
      query: (applicationData) => ({
        url: '/applicants/apply',
        method: 'POST',
        body: applicationData,
      }),
    }),
    removeApplication: builder.mutation({
      query: (id) => ({
        url: `/applicants?jobId=${id}`,
        method: 'DELETE'
      }),
    }),
    getApplicantsForJob: builder.query({
      query: (jobId) => `/applicants?jobId=${jobId}`,
    }),
    getJobsForApplicant: builder.query({
      query: (userId) => `/applicants?userId=${userId}`,
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useAuthenticateUserMutation,
  useGetUserInfoQuery,
  useGetUserExperiencesQuery,
  useAddExperienceMutation,
  useModifyExperienceMutation,
  useDeleteExperienceMutation,
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useModifyJobMutation,
  useDeleteJobMutation,
  useApplyForJobMutation,
  useRemoveApplicationMutation,
  useGetApplicantsForJobQuery,
  useGetJobsForApplicantQuery,
} = api;
