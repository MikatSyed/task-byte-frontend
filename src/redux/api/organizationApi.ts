import {  IMeta } from "@/types";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const  URL = "/organization";

export const OrganizationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    organizations: build.query({
      query: () => {
        return {
          url: URL,
          method: "GET",      
        };
      },
    
      providesTags: [tagTypes.organization],
    }),

    Organization: build.query({
      query: (id) => ({
        url : `${URL}/${id}`,
        method: "GET"
       
      }),
      providesTags:[tagTypes.organization]
    }),

    addOrganization: build.mutation({
        query: (data) => ({
          url : `${URL}`,
          method: "POST",
          data
        }),
        invalidatesTags:[tagTypes.organization]
      }),

    updateOrganization: build.mutation({
      query: (data) => ({
        url : `${URL}/${data.id}`,
        method: "PATCH",
        data:data.body
      }),
      invalidatesTags:[tagTypes.organization]
    }),

    
    deleteOrganization: build.mutation({
      query: (id) => ({
        url : `${URL}/${id}`,
        method: "DELETE"
       
      }),
      invalidatesTags:[tagTypes.organization]
    }),

  }),
});

export const { useOrganizationsQuery,useOrganizationQuery,useAddOrganizationMutation,useUpdateOrganizationMutation,useDeleteOrganizationMutation } = OrganizationApi;
