import Image from "next/image";
import React from "react";
import logoATV from "../public/images/logoATV.png";

const Navbar = () => {
  return (
    <div className="bg-[#6f7e91]">
      <div className="h-40 px-8 flex items-center">
        <Image src={logoATV} alt="Logo ATV" width={159} height={129} />
        <p className="text-white font-bold text-center flex-auto text-3xl">
          ANTIVIRUS PARA LA DESERCIÓN
          <br />
          SOLICITUD DE TUTORÍAS ACADÉMICAS
        </p>
        <button
          type="button"
          class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Registrarme
        </button>
      </div>
    </div>
  );
};

export default Navbar;
