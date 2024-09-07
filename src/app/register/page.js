import Image from "next/image";
import React from "react";

const register = () => {
  return (
    <div className="flex flex-row">
      <div className="basis-0 h-[100vh] bg-[url('/images/bg-registro.jpeg')] bg-cover md:basis-3/5"></div>
      <div className="basis-full h-[100vh] md:basis-2/5">
        <div className="px-[5vw] 2xl:mt-[15vh] sm:mt-[10vh] min-[300px]:mt-[10vh]">
          <div className="text-center pb-[3vh]">
            <div className="flex justify-center h-[50px]">
              <Image
                src={"/images/logo-lock.png"}
                alt={"lock"}
                height={50}
                width={50}
              />
            </div>
            <h1 className="font-bold text-2xl">Registro</h1>
          </div>
          <form className="space-y-4 md:space-y-2" action="#">
            <div>
              <label
                for="tipo_documento"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Seleccione su tipo de documento
              </label>
              <select
                id="tipo_documento"
                class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-2"
              >
                <option>Cédula de ciudadanía</option>
                <option>Documento de Identidad</option>
                <option>Opción 3</option>
                <option>Opción 4</option>
              </select>
            </div>
            <div>
              <label
                for="numero_documento"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Digite su número de documento
              </label>
              <input
                type="text"
                id="numero_documento"
                inputMode="numeric"
                pattern="[0-9]{9,15}"
                placeholder="Número de documento"
                title="Utiliza solo números"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
              />
            </div>
            <div>
              <label
                for="nombre"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Nombre (Sin apellidos)
              </label>
              <input
                type="text"
                id="nombre"
                pattern="\D+"
                placeholder="Nombres"
                title="Utiliza solo letras"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
              />
            </div>
            <div>
              <label
                for="apellido"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Apellidos
              </label>
              <input
                type="text"
                id="apellido"
                pattern="\D+"
                placeholder="Apellidos"
                title="Utiliza solo letras"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
              />
            </div>
            <div>
              <label
                for="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full 2xl:p-2.5 md:p-1"
                placeholder="name@udea.edu.co"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full 2xl:p-2.5 md:p-1"
                required=""
              />
            </div>
            <div>
              <label
                for="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Confirme su contraseña
              </label>
              <input
                type="password"
                name="confirm-pasword"
                id="confirm-password"
                placeholder="••••••••"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full 2xl:p-2.5 md:p-1"
                required=""
              />
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded focus:ring-3 focus:ring-primary-300"
                  required=""
                />
              </div>
              <div className="ml-3 text-sm">
                <label for="terms" className="font-light text-gray-500">
                  Acepto los{" "}
                  <a
                    className="font-medium text-blue-700 hover:underline"
                    href="#"
                  >
                    términos y condiciones.
                  </a>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 2xl:py-2.5 text-center md:p-1"
            >
              Crear cuenta
            </button>
            <p className="text-sm font-light text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Inicia Sesión aqui.
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default register;
