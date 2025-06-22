import NavbarHome from "@/components/NavbarHome";
import TutorialForm from "@/components/TutorialForm";
import Image from "next/legacy/image";
import React from "react";
import Footer from "/src/components/Footer";

const page = () => {
  return (
    <>
      <NavbarHome />
      <div className="relative flex justify-center items-center">
        <div className="flex flex-col items-center z-10">
          <h1 className="text-white lg:text-5xl font-bold p-4 md:text-xl">
            Solicitud de tutorías académicas
          </h1>
          <TutorialForm />
        </div>
        <div className="h-[100vh]">
          <Image
            src={"/images/bg-tutorial.png"}
            alt="Bg Tutorial"
            layout={"fill"}
            // width={200}
            // height={200}
            className="absolute object-cover -z-10"
          />
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default page;
