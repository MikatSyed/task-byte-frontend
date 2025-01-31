"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import FormInput from "../Forms/FormInput"
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../schemas/authSchema';
import Form from "../Forms/Form"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)



  const onSubmit = async (values: any) => {
    console.log(values)
    try {
      // Handle form submission
    } catch (err: any) {
      console.error('Error adding task:', err.message);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6 sm:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-xl "
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-600">TASK BYTE</h1>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <Form submitHandler={onSubmit} resolver={yupResolver(loginSchema)}>
          <div className="space-y-3">
            <FormInput name="email" label="Email" className="w-full" />
            <FormInput type="password" name="password" label="Password" className="w-full" />
          </div>

          <div className="text-sm mt-2">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </Form>
      </motion.div>
    </div>
  )
}
