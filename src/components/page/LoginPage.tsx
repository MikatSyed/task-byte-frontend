"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FormInput from "../Forms/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../schemas/authSchema";
import Form from "../Forms/Form";
import toast from "react-hot-toast";
import { useUserLoginMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { storeUserInfo } from "../../../services/auth.service";

export default function LoginPage() {

  const {push} = useRouter();
  const [loading, setLoading] = useState(false);
  const [userLogin] = useUserLoginMutation();

  const onSubmit = async (data: any) => {
    console.log(data,'22')
    setLoading(true); 

    try {
      const res = await userLogin({ ...data }).unwrap();
      console.log(res);
      if (res?.data?.accessToken) {
        storeUserInfo({ accessToken: res?.data?.accessToken });
        push("/");    
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-xl"
        >
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-blue-600">TASK BYTE</h1>
            <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                create a new account
              </Link>
            </p>
          </div>

          <Form submitHandler={onSubmit} resolver={yupResolver(loginSchema)}>
            <div className="space-y-3">
              <FormInput name="email" label="Email" className="w-full" />
              <FormInput
                type="password"
                name="password"
                label="Password"
                className="w-full"
              />
            </div>

            <div className="text-sm mt-2">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </Form>
        </motion.div>
      </div>
    </>
  );
}
