"use client";
import Image from "next/legacy/image";
import { React, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {signIn, useSession} from "next-auth/react";
import logoGoogle from "../../../public/images/google.png";

const login = () => {
  const router = useRouter();
  const [person, setPerson] = useState({
    user_email: "",
    user_password: "",
  });
  const PERSON_API_BASE_URL = "http://localhost:8081/api/v1/auth/login";
  let token = "";

  const handleChange = (event) => {
    const value = event.target.value;
    setPerson({ ...person, [event.target.name]: value });
  };
  //---------------------------------------VERIFICAR LOGIN------------------------------

  const validateLogin = async (e) => {
    e.preventDefault();
    const response = await fetch(PERSON_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const res = await response.json();
    token = res.token;
    const user = jwtDecode(token);

    console.log("--------------------------------------------------");
    console.log(res);
    console.log(token);
    localStorage.setItem("token", token);
    console.log(JSON.stringify(user));
    // decode your token here
    localStorage.setItem("user", JSON.stringify(user));
    //(token);
    if (token != null) {
      router.push("../landing");
    }
    //reset(e);
  };

  const {data: session} = useSession();
    console.log(session);
  //---------------------------------------VERIFICAR LOGIN------------------------------

  return (
    <div className="grid grid-cols-2 ">
      <div className="bg-slate-500 h-screen">
        <div className="flex items-center justify-center h-screen">
          <img src="/images/bg-login.png"></img>
        </div>
      </div>

      <div className="items-center">
        <div className="basis-full h-[100vh] md:basis-2/5 overflow-auto">
          <div className="px-[5vw] 2xl:mt-[15vh] sm:mt-[25vh] min-[300px]:mt-[30vh] items-center">
            <div className="text-center pb-[3vh]">
              <div className="flex justify-center h-[50px]">
                <Image
                  src={"/images/logo-lock.png"}
                  alt={"lock"}
                  height={50}
                  width={50}
                />
              </div>
              <h1 className="font-bold text-2xl">Iniciar Sesión</h1>
            </div>
            <form className="space-y-4 md:space-y-2" onSubmit={validateLogin}>
              <div>
                <label
                  htmlFor="user_email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                ></label>
                <input
                  type="email"
                  name="user_email"
                  id="user_email"
                  placeholder="Correo electronico"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full 2xl:p-2.5 md:p-1"
                  required=""
                  value={person.user_email}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div>
                <label
                  htmlFor="user_password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                ></label>
                <input
                  type="password"
                  name="user_password"
                  id="user_password"
                  placeholder="Contraseña"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full 2xl:p-2.5 md:p-1"
                  required=""
                  value={person.user_password}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 2xl:py-2.5 text-center md:p-1"
              >
                Iniciar Sesión
              </button>
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="w-full mt-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center gap-2"
                  >
                  <Image src={logoGoogle} alt="Google" width={20} height={20} />
                  Inicia sesión con Google
                </button>
              </div>
              <p className="text-sm font-light text-gray-500">
                ¿Aun no tienes una cuenta?{" "}
                <a
                  href="../register"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Registrate aqui.
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
