import React from 'react'
import UI_IMG from "../../assets/images/auth-img.png"

const AuthLayout = ({ children }) => {
  return (
    <div className="flex w-screen h-screen">
      {/* Left Side: Form Section */}
      <div className="w-full md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-xl font-bold text-black ">Task Manager</h2>
        {children}
      </div>

      {/* Right Side: Background Image with UI Image */}
      <div className="hidden md:flex w-[40vw] h-full items-center justify-center bg-blue-50 bg-[url('/bg-img.jpg')] bg-cover bg-no-repeat bg-center overflow-hidden p-8">
        {/*<img src="/ui-img.png" alt="UI" className="w-64 lg:w-[90%]" />*/}
      </div>
    </div>
  );
};


export default AuthLayout