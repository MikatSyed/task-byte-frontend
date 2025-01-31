"use client"

import { useState } from "react"
import Link from "next/link"
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"
import { motion } from "framer-motion"
import Form from "../Forms/Form"
import FormInput from "../Forms/FormInput"
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../schemas/authSchema';
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { useSignupMutation } from "@/redux/api/authApi"
import { ShowToast } from "../UI/ShowToast"

export default function RegisterPage() {
  const {push} = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [signup] = useSignupMutation();


  const onSubmit = async (values: any) => {
    const toastId = toast.loading("Posting...")
    console.log(values)
    try {
      setLoading(true);
      const res: any = await signup(values).unwrap();
      console.log(res,'29')
      if (res && res.data) {
        ShowToast({
         message:res?.message
        })
       
         setTimeout(()=>{
         push('/login')
         },2000)
       } else {
         throw new Error("Unexpected response format");
       }
      // Handle form submission
    } catch (err: any) {
      console.error('Error adding task:', err.message);
    } finally {
      toast.dismiss(toastId)
      setLoading(false);
    }
  };

  return (
   <>
   <Toaster position="top-center" reverseOrder={false} />
    <div className="min-h-screen flex items-center justify-center bg-gray-100  py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl "
      >
        <div>
          <h1 className="text-center text-4xl font-extrabold text-blue-600 mb-2">TASK BYTE</h1>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>
        <Form submitHandler={onSubmit} resolver={yupResolver(registerSchema)}>
          <div className="space-y-2">
            <FormInput name="name" label=" Full Name" className="w-full" />
            <FormInput name="email" label="Email" className="w-full" />
            <FormInput type="password" name="password" label="Password" className="w-full" />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
               Create Account
            </button>
          </div>
        </Form>
  
      </motion.div>
    </div>
   </>
  )
}

