import {  IMeta } from "@/types";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const  URL = "/faqs";

export const faqApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    faqs: build.query({
      query: () => {
        return {
          url: URL,
          method: "GET",      
        };
      },
    
      providesTags: [tagTypes.faq],
    }),

    faq: build.query({
      query: (id) => ({
        url : `${URL}/${id}`,
        method: "GET"
       
      }),
      providesTags:[tagTypes.faq]
    }),

    addFaq: build.mutation({
        query: (data) => ({
          url : `${URL}`,
          method: "POST",
          data
        }),
        invalidatesTags:[tagTypes.faq]
      }),

    updateFaq: build.mutation({
      query: (data) => ({
        url : `${URL}/${data.id}`,
        method: "PATCH",
        data:data.body
      }),
      invalidatesTags:[tagTypes.faq]
    }),

    
    deleteFaq: build.mutation({
      query: (id) => ({
        url : `${URL}/${id}`,
        method: "DELETE"
       
      }),
      invalidatesTags:[tagTypes.faq]
    }),

  }),
});

export const { useFaqsQuery,useFaqQuery,useAddFaqMutation,useUpdateFaqMutation,useDeleteFaqMutation } = faqApi;
