"use client"; // This is a client component
import { Menu, X } from "lucide-react";
import { React } from "react";
import { useState } from "react";
import logoATV from "../../public/images/logoATV.png";
import Image from "next/image";

const NavbarHome = ({ name, rol, admin }) => {
  const [MenuOpen, setMenuOpen] = useState(false);

  const abrirMenu = () => setMenuOpen(!MenuOpen);

  return (
    <nav className="bg-slate-500 px-8 h-[80px]">
      <div className="flex justify-between content-center ">
        <div className="text-white ">
          <Image
            src={logoATV}
            alt="Logo ATV"
            style={{ width: "90px", height: "auto" }}
          />
        </div>

        <div className={`flex items-center text-xl`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#ffffff"
            className={`${admin ? "hidden" : "block"} size-8`}
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
          <span
            className={`${admin ? "block" : "hidden"} mr-2 px-2 text-white`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.867 19.125h.008v.008h-.008v-.008Z"
              />
            </svg>
          </span>
          <span className="mr-2 px-2 text-white">Hola, {name}</span>
          <span className="mr-2 px-2 text-white">{rol ? rol : ""}</span>

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
