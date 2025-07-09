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
  TUTOR: "ROLE_TUTOR",
};

const NavbarHome = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");

    if (token && userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
        setCargando(false); // terminar carga
        console.log(`user ---->>>>>> ${JSON.stringify(parsedUser)}`);
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
  if (cargando) return <p>Cargando...</p>;
  return (
    <nav className="bg-slate-500 px-8 h-[80px]">
      <div className="px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="w-64 items-center justify-center">
          <Link
            href={
              (user.user_role === ROLE.TUTOR && "/tutor/maintutor") ||
              (user.user_role === ROLE.STUDENT && "/student/landing") ||
              (user.user_role === ROLE.ADMIN && "/admin")
            }
          >
            <Image
              src={logoATV}
              alt="Logo ATV"
              width={90}
              height={60}
              priority
            />
          </Link>
        </div>

        <div>
          <p className="text-white font-bold text-center flex-auto text-xl">
            ANTIVIRUS PARA LA DESERCIÓN
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-3 text-white text-base">
            {/* Icono según rol */}
            {user.user_role === ROLE.STUDENT && (
              <svg
                className="w-[30px] h-[30px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {user.user_role === ROLE.ADMIN && (
              <svg
                className="w-[30px] h-[30px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z"
                  clip-rule="evenodd"
                />
              </svg>
            )}
            {user.user_role === ROLE.TUTOR && (
              <svg
                className="w-[30px] h-[30px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.4472 2.10557c-.2815-.14076-.6129-.14076-.8944 0L5.90482 4.92956l.37762.11119c.01131.00333.02257.00687.03376.0106L12 6.94594l5.6808-1.89361.3927-.13363-5.6263-2.81313ZM5 10V6.74803l.70053.20628L7 7.38747V10c0 .5523-.44772 1-1 1s-1-.4477-1-1Zm3-1c0-.42413.06601-.83285.18832-1.21643l3.49538 1.16514c.2053.06842.4272.06842.6325 0l3.4955-1.16514C15.934 8.16715 16 8.57587 16 9c0 2.2091-1.7909 4-4 4-2.20914 0-4-1.7909-4-4Z" />
                <path d="M14.2996 13.2767c.2332-.2289.5636-.3294.8847-.2692C17.379 13.4191 19 15.4884 19 17.6488v2.1525c0 1.2289-1.0315 2.1428-2.2 2.1428H7.2c-1.16849 0-2.2-.9139-2.2-2.1428v-2.1525c0-2.1409 1.59079-4.1893 3.75163-4.6288.32214-.0655.65589.0315.89274.2595l2.34883 2.2606 2.3064-2.2634Z" />
              </svg>
            )}

            {/* Saludo y rol */}
            <span>Hola, {user.sub}&nbsp; | </span>
            {user.user_role === ROLE.STUDENT && <span>Estudiante</span>}
            {user.user_role === ROLE.ADMIN && <span>Admin</span>}
            {user.user_role === ROLE.TUTOR && <span>Tutor</span>}

            {/* Botón menú */}
            <button onClick={toggleMenu} aria-label="Abrir menú">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        )}
      </div>

      {/* Menú desplegable */}
      {menuOpen && (
        <ul className="absolute top-16 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ">
          <li>
            <Link
              href="/perfil"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Mi Perfil
            </Link>
          </li>
          
          
          {user.user_role === ROLE.TUTOR && (
            <li>
              <Link
                href="/student/landing"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mis Tutorías
              </Link>
            </li>
          )}
          {user.user_role === ROLE.TUTOR && (
            <li>
              <Link
                href="/tutor/pool"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Pool de Tutorías
              </Link>
            </li>
          )}
          {user.user_role === ROLE.TUTOR && (
            <li>
              <Link
                href="/tutor/availability"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Disponibilidad
              </Link>
            </li>
          )}
          {user.user_role === ROLE.ADMIN && (
            <li>
              <Link
                href="/admin/degree"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Gestión de Carreras
              </Link>
            </li>
          )}
          {user.user_role === ROLE.ADMIN && (
            <li>
              <Link
                href="/admin/subject"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Gestión de Asignaturas
              </Link>
            </li>
          )}
          {user.user_role === ROLE.ADMIN && (
            <li>
              <Link
                href="/admin/adminTutos"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Gestión de Tutorías
              </Link>
            </li>
          )}
          {user.user_role === ROLE.ADMIN && (
            <li>
              <Link
                href="/admin/users"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Gestión de Usuarios
              </Link>
            </li>
          )}
          
           {user.user_role === ROLE.ADMIN && (
            <li>
              <Link
                href="/admin/activationRequest"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Gestión de aplicaciones
              </Link>
            </li>
          )}
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
