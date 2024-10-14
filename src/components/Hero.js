"use client"; // This is a client component 👈🏽
import React from "react";

const Hero = () => {
  return (
    <div className="relative">
      <img
        src={"/images/bg-landing.jpg"}
        alt="imagen de fondo landing"
        className="w-full h-[70.5vh] object-cover relative brightness-75"
      />
      <div className="flex justify-center absolute top-8 w-full">
        <img
          src={"/images/bannerAV.jpg"}
          alt="imagen de banner landing"
          className=" rounded-3xl"
        />
      </div>
      <div className="absolute top-[42vh] left-1/4 bg-[#3f5d84] text-white rounded-3xl p-8 font-bold text-xl text-center">
        ¿Eres estudiante de la Universidad de Antioquia?
      </div>
      <div className="absolute top-[55vh] left-1/2 bg-[#3f5d84] text-white rounded-3xl p-8 font-bold text-xl text-center">
        ¡Solicita ya las tutorías académicasque necesites y revienta el
        semestre!
      </div>
    </div>
  );
};

export default Hero;
