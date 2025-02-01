// src/pages/ProfilePage.tsx

"use client";

import { useLoggedUserQuery } from "@/redux/api/userApi";
import { useState } from "react";

const ProfilePage = () => {
    const { data } = useLoggedUserQuery(undefined);
    const user = data?.data;

    return (
        <div className="flex justify-center items-center mt-12 ">
            <div className="max-w-sm w-full bg-white shadow-lg rounded-lg p-6 space-y-6">
                {/* Profile Card Header */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-600">
                        <img
                            src={ "https://img.freepik.com/premium-photo/man-suit-with-white-shirt-black-tie_1153744-187667.jpg?semt=ais_hybrid"}
                            alt="User Avatar"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div className="text-center space-y-2">
                
                    <h2 className="text-2xl font-semibold text-gray-800">{user?.name || "John Doe"}</h2>
                  
                </div>

            
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        {user?.email || "Passionate about technology, innovation, and building impactful solutions. Always looking to learn new things!"}
                    </p>
                </div>

               
            </div>
        </div>
    );
};

export default ProfilePage;
