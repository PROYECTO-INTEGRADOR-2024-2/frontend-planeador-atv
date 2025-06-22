"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { signIn, useSession } from "next-auth/react";
import logoGoogle from "/public/images/google.png";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const [person, setPerson] = useState({
    user_email: "",
    user_password: "",
  });

  const PERSON_API_BASE_URL = "http://localhost:8081/api/v1/auth/login";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPerson((prev) => ({ ...prev, [name]: value }));
  };

  const validateLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(PERSON_API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });

      if (!response.ok) {
        const message = await response.text();
        toast.error(message || "Credenciales inválidas.");
        return;
      }

      const res = await response.json();
      const token = res.token;
      const user = jwtDecode(token);

      Cookies.set("token", token);
      Cookies.set("user", JSON.stringify(user));

      toast.success("Inicio de sesión correcto.");
      console.log(`Token: ${token}`);
      switch (user.user_role) {
        case "ROLE_STUDENT":
          router.push("/student/landing");
          break;
        case "ROLE_TUTOR":
          router.push("/maintutor");
          break;
        case "ROLE_ADMIN":
          router.push("/admin");
          break;
        default:
          toast.error("Usuario desconectado, por favor iniciar sesión.");
          router.push("/landing");
          return;
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      toast.error("Ocurrió un error inesperado.");
    }
  };

  const { data: session } = useSession();
  console.log(session);

  return (
    <div className="grid grid-cols-2">
      <div className="bg-slate-500 h-screen flex items-center justify-center">
        <img src="/images/bg-login.png" alt="Background" />
      </div>

      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-md px-8">
          <div className="flex flex-col items-center mb-6">
            <Image
              src={"/images/logo-lock.png"}
              alt="lock"
              height={50}
              width={50}
            />
            <h1 className="font-bold text-2xl mt-4">Iniciar Sesión</h1>
          </div>
          <form className="space-y-4" onSubmit={validateLogin}>
            <input
              type="email"
              name="user_email"
              id="user_email"
              placeholder="Correo electrónico"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              required
              value={person.user_email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="user_password"
              id="user_password"
              placeholder="Contraseña"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              required
              value={person.user_password}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="w-full text-white bg-gray-600 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => signIn("google")}
              className="w-full mt-2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center gap-2"
            >
              <Image src={logoGoogle} alt="Google" width={20} height={20} />
              Inicia sesión con Google
            </button>
            <p className="text-sm font-light text-gray-500 text-center">
              ¿Aún no tienes una cuenta?{" "}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:underline"
              >
                Regístrate aquí.
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
