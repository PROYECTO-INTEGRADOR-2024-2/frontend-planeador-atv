"use client";
import React from "react";
import CompleteRegisterPersonForm from "@/components/CompleteRegisterPersonForm";
import Image from "next/legacy/image";
import Footer from "../../components/Footer";

function Page() {
    return (
        <div className="flex flex-row ">
          <div className="basis-0  bg-no-repeat md:basis-3/5 bg-cover bg-slate-500 h-screen relative">
            <Image
              src="/images/bg-login.png"
              alt="Background login image"
              className="object-full shadow-blue-500/50 Sw-[50%]"
              layout="fill"
            />
          </div>
          <div className="flex-grow">
            <CompleteRegisterPersonForm />
          </div>
        </div>
      );
};

export default Page;
