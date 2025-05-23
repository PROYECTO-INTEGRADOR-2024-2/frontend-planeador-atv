"use client"; // This is a client component 👈🏽
import Image from "next/image";
import React from "react";
import logoATV from "../../public/images/logoATV.png";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="bg-[#6f7e91] h-20">
      <div className="px-8 flex items-center justify-between">
        <div className="w-80 items-center justify-center">
          <Image
            src={logoATV}
            alt="Logo ATV"
            style={{ width: "90px", height: "auto" }}
          />
        </div>
        <div>
          <p className="text-white font-bold text-center flex-auto text-xl">
            ANTIVIRUS PARA LA DESERCIÓN
            <br />
            SOLICITUD DE TUTORÍAS ACADÉMICAS
          </p>
        </div>
        <div className="flex mt-2">
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => router.push("../login")}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => router.push("../register")}
          >
            Registrarme
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
