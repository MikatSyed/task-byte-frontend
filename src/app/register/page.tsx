
import RegisterPage from '@/components/page/RegisterPage';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: "TB | Signup",
  };

  
const page = () => {
    return (
        <>
            <RegisterPage/>
        </>
    );
};

export default page;