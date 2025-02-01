import {  IMeta } from "@/types";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const  URL = "/invitation";

export const InvitationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    invitations: build.query({
      query: () => {
        return {
          url: URL,
          method: "GET",      
        };
      },
    
      providesTags: [tagTypes.invitation,tagTypes.user],
    }),

    invitation: build.query({
      query: (id) => ({
        url : `${URL}/${id}`,
        method: "GET"
       
      }),
      providesTags:[tagTypes.invitation]
    }),

    addInvitation: build.mutation({
        query: (data) => ({
          url : `${URL}`,
          method: "POST",
          data
        }),
        invalidatesTags:[tagTypes.invitation]
      }),

    updateInvitation: build.mutation({
      query: (data) => ({
        url : `${URL}/${data.id}/status`,
        method: "PATCH",
        data:data.body
      }),
      invalidatesTags:[tagTypes.invitation]
    }),

    
    deleteInvitation: build.mutation({
      query: (id) => ({
        url : `${URL}/${id}`,
        method: "DELETE"
       
      }),
      invalidatesTags:[tagTypes.invitation]
    }),

  }),
});

export const { useInvitationsQuery,useInvitationQuery,useAddInvitationMutation,useUpdateInvitationMutation,useDeleteInvitationMutation } = InvitationApi;
