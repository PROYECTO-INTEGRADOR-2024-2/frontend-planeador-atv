"use client"; // This is a client component 👈🏽
import React from "react";

const Hero = () => {
  return (
    <div className="relative min-[320px]:max-sm:w-full">
      <img
        src={"/images/bg-landing.jpg"}
        alt="imagen de fondo landing"
        className="w-full h-[70.5vh] object-cover relative"
      />
      <div className="flex justify-center absolute top-8 w-full min-[320px]:px-2">
        <img
          src={"/images/bannerAV.jpg"}
          alt="imagen de banner landing"
          className=" rounded-3xl"
        />
      </div>
      <div className="absolute top-[42vh] left-1/4 bg-[#3f5d84] text-white rounded-3xl p-8 font-bold text-xl text-center min-[320px]:text-sm min-[320px]:top-[20vh] min-[320px]:mx-2 min-[320px]:left-0 md:text-lg md:top-[25vh] md:mx-2 md:left-0 lg:text-2xl lg:top-[30vh] lg:mx-20 lg:left-0 xl:text-2xl xl:top-[40vh] xl:mx-20 xl:left-[20vw]">
        ¿Eres estudiante de la Universidad de Antioquia?
      </div>
      <div className="absolute top-[55vh] left-1/2 bg-[#3f5d84] text-white rounded-3xl p-8 font-bold text-xl text-center min-[320px]:text-sm min-[320px]:top-[40vh] min-[320px]:mx-2 min-[320px]:left-0 md:text-lg md:top-[45vh] md:mx-24 md:right-0 lg:text-2xl lg:top-[50vh] lg:mx-32 lg:right-0 xl:text-2xl xl:top-[55vh] xl:mx-32 xl:left-[40vw]">
        ¡Solicita ya las tutorías académicasque necesites y revienta el
        semestre!
      </div>
    </div>
  );
};

export default Hero;
