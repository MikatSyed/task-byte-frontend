import LoginPage from '@/components/page/LoginPage';
import { Metadata } from 'next';
import React from 'react';


export const metadata: Metadata = {
    title: "TB | Login",
  };

const page = () => {
    return (
        <>
            <LoginPage />
        </>
    );
};

export default page;