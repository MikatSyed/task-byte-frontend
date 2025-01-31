import { tagTypes } from '../tag-types';
import { baseApi } from './baseApi'

const AUTH_URL = '/auth'
const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userLogin: build.mutation({
      query: (data) => ({
        url : `${AUTH_URL}/login`,
        method: "POST",
        data
      }),
      invalidatesTags:[tagTypes.user]
    }),
    signup: build.mutation({
      query: (data) => ({
        url : `${AUTH_URL}/signup`,
        method: "POST",
        data
      }),
      invalidatesTags:[tagTypes.user]
    }),
    providerSignup: build.mutation({
      query: (data) => ({
        url : `${AUTH_URL}/provider/signup`,
        method: "POST",
        data
      }),
      invalidatesTags:[tagTypes.provider]
    }),
    changePassword: build.mutation({
      query: (data) => ({
        url : `${AUTH_URL}/change-password/${data.id}`,
        method: "PATCH",
        data:data.body
      }),
      invalidatesTags:[tagTypes.user]
    }),
    forgotPassword: build.mutation({
      query: (data) => ({
        url : `${AUTH_URL}/forgot-password`,
        method: "POST",
        data:data.body
      }),
      invalidatesTags:[tagTypes.user]
    }),
    resetPassword: build.mutation({
      query: (data) => ({
        url : `${AUTH_URL}/reset-password`,
        method: "POST",
        data:data.body
      }),
      invalidatesTags:[tagTypes.user]
    }),
  }),
  overrideExisting: false,

  
})

export const { useUserLoginMutation,useSignupMutation,useProviderSignupMutation,useChangePasswordMutation,useForgotPasswordMutation,useResetPasswordMutation } = authApi;