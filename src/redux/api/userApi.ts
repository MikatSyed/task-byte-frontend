import {  IMeta } from "@/types";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const  USER_URL = "/users";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    users: build.query({
        query: () => {
          return {
            url: USER_URL,
            method: "GET"
          };
        },
        providesTags: [tagTypes.user],
      }),

    loggedUser: build.query({
      query: () => {
        return {
          url: `${USER_URL}/my-profile`,
          method: "GET"
        };
      },
      providesTags: [tagTypes.user],
    }),

    userById: build.query({
      query: (id) => ({
        url : `${USER_URL}/${id}`,
        method: "GET"
       
      }),
      providesTags:[tagTypes.user]
    }),

    updateUser: build.mutation({
      query: (data) => ({
        url : `${USER_URL}/${data.id}`,
        method: "PATCH",
        data:data.body
      }),
      invalidatesTags:[tagTypes.user]
    }),

    
    deleteUser: build.mutation({
      query: (id) => ({
        url : `${USER_URL}/${id}`,
        method: "DELETE"
       
      }),
      invalidatesTags:[tagTypes.user]
    }),

  }),
});

export const { useUsersQuery,useUserByIdQuery,useUpdateUserMutation,useDeleteUserMutation,useLoggedUserQuery } = adminApi;
