"use client"; // This is a client component
import { Menu, X } from "lucide-react";
import { React } from "react";
import { useState } from "react";
import logoATV from "../../public/images/logoATV.png";
import Image from "next/image";

const NavbarHome = () => {
  const [MenuOpen, setMenuOpen] = useState(false);

  const abrirMenu = () => setMenuOpen(!MenuOpen);

  return (
    <nav className="bg-slate-500 px-8 h-[80px]">
      <div className="flex justify-between content-center ">
        <div className="text-white ">
          <Image src={logoATV} alt="Logo ATV" width={90} height={75} />
        </div>

        <div className="flex items-center text-xl ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#ffffff"
            className="size-8"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>

          <span className="mr-2 px-2 text-white">Hola, Joaquin</span>

          {/*Menu*/}

          <button onClick={abrirMenu} className="text-white ">
            {MenuOpen ? <X /> : <Menu />}
          </button>
          {MenuOpen && (
            <div className="absolute top-16 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mi Perfil
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Configuración
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mis Proyectos
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar Sesión
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default NavbarHome;
