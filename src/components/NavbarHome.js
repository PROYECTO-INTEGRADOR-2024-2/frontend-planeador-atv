"use client";

import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logoATV from "../../public/images/logoATV.png";

const ROLE = {
  ADMIN: "ROLE_ADMIN",
  STUDENT: "ROLE_STUDENT",
};

const NavbarHome = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");

    if (token && userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        router.push("/landing");
      }
    } else {
      router.push("/landing");
    }
  }, [router]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/");
  };

  return (
    <nav className="bg-slate-500 px-8 h-[80px]">
      <div className="flex justify-between items-center h-full">
        {/* Logo */}
        <Link href="/">
          <Image src={logoATV} alt="Logo ATV" width={90} height={60} priority />
        </Link>

        {user && (
          <div className="flex items-center gap-3 text-white text-base">
            {/* Icono según rol */}
            {user.userRole === ROLE.ADMIN ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-8 h-8"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
            )}

            {/* Saludo y rol */}
            <span>Hola, {user.sub}</span>
            {user.userRole === ROLE.STUDENT && <span>Estudiante</span>}

            {/* Botón menú */}
            <button onClick={toggleMenu} aria-label="Abrir menú">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        )}
      </div>

      {/* Menú desplegable */}
      {menuOpen && (
        <ul className="absolute top-16 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <li>
            <Link
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Mi Perfil
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Configuración
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Mis Proyectos
            </Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavbarHome;
