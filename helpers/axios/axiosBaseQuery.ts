
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

import type { AxiosRequestConfig, AxiosError } from 'axios'
import { instance as axiosInstance } from './axiosInstance'
import { IMeta } from '@/types';

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
      meta?: IMeta
      contentType?: string;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, contentType }) => {
    try {
      const result: any = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          "Content-Type": contentType || "application/json",
        },
      });
      // console.log(result);
      return { data: result.data }; // Return the successful response data
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      // console.log(err);
      return {
        // Return error object for error responses
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
