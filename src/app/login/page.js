import React from "react";
import Image from "next/image";

//rafce
const login = () => {
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
            <form className="space-y-4 md:space-y-2" action="#">
              <div>
                <label
                  htmlFor="correo-electronico"
                  className="block mb-2 text-sm font-medium text-gray-900"
                ></label>
                <input
                  type="correo-electronico"
                  name="correo-electronico"
                  id="correo-electronico"
                  placeholder="Correo electronico"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full 2xl:p-2.5 md:p-1"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="password-login"
                  className="block mb-2 text-sm font-medium text-gray-900"
                ></label>
                <input
                  type="password"
                  name="password-login"
                  id="password-login"
                  placeholder="Contraseña"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full 2xl:p-2.5 md:p-1"
                  required=""
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 2xl:py-2.5 text-center md:p-1"
              >
                Iniciar Sesión
              </button>
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
