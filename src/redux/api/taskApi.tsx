import {  IMeta } from "@/types";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const  URL = "/task";

export const TaskApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    Tasks: build.query({
      query: () => {
        return {
          url: URL,
          method: "GET",      
        };
      },
    
      providesTags: [tagTypes.task,tagTypes.user],
    }),

    Task: build.query({
      query: (id) => ({
        url : `${URL}/${id}`,
        method: "GET"
       
      }),
      providesTags:[tagTypes.task]
    }),
    TaskByOrganization: build.query({
      query: (data) => ({
        url : `${URL}/organization/${data.id}`,
        method: "GET"
       
      }),
      providesTags:[tagTypes.task]
    }),

    TaskForUser: build.query({
      query: () => ({
        url : `${URL}/user`,
        method: "GET"
       
      }),
      providesTags:[tagTypes.task]
    }),

    addTask: build.mutation({
        query: (data) => ({
          url : `${URL}`,
          method: "POST",
          data
        }),
        invalidatesTags:[tagTypes.task]
      }),

    updateTask: build.mutation({
      query: (data) => ({
        url : `${URL}/${data.id}`,
        method: "PATCH",
        data:data.body
      }),
      invalidatesTags:[tagTypes.task]
    }),

    
    deleteTask: build.mutation({
      query: (id) => ({
        url : `${URL}/${id}`,
        method: "DELETE"
       
      }),
      invalidatesTags:[tagTypes.task]
    }),

  }),
});

export const { useTasksQuery,useTaskForUserQuery,useTaskByOrganizationQuery,useTaskQuery,useAddTaskMutation,useUpdateTaskMutation,useDeleteTaskMutation } = TaskApi;
