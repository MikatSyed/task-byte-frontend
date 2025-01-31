"use client"
import { authOptions } from "@/lib/AuthOptions";
import { IGenericErrorResponse, ResponseSuccessType } from "@/types";
import { getFromLocalStorage } from "@/utils/local-storage";
import axios from "axios";
import { getSession } from "next-auth/react";



const instance = axios.create()
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 30000;

// Add a request interceptor
instance.interceptors.request.use(async function (config) {
    // Do something before request is sent
    const accessToken = getFromLocalStorage("accessToken")
    if(accessToken){
        config.headers.Authorization = accessToken;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });


//@ts-ignore
instance.interceptors.response.use(function (response) {
 
   
    const responseObject : ResponseSuccessType = {

        data: response?.data,
        meta: response?.data?.meta,
        
    }
    return responseObject;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const responseObject:IGenericErrorResponse = {
        statusCode: error?.response?.status || 500,
        message: error?.response?.data?.message || error?.message || "Something went wrong...",
        errorMessages: error?.response?.data?.errorMessages || [],
    }
    return Promise.reject(responseObject);
  });

export {instance};