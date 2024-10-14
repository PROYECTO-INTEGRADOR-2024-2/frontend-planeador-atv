"use client";
import React, { useState } from "react";
import Modal from "react-modal";

const DegreeRegisterForm = ({ open }) => {
  const [showModal, setShowModal] = useState(open);
  return (
    <div>
      <div className="flex items-center blur-md">
        <Modal
          isOpen={open}
          className={"absolute flex flex-col w-[40vw] left-[35vw] top-[15vh]"}
        >
          <div className="w-[30vw] bg-[#d9d9d9] px-8 pb-8 rounded-[50px] p-2 mb-8">
            <div className="w-full text-center my-[3vh]">
              <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-black">
                Información de la Carrera.
              </h1>
            </div>
            <form className="space-y-4 md:space-y-2" action="#">
              <div>
                <label
                  htmlFor="degreeID"
                  className="block my-2 text-sm font-bold text-gray-900"
                >
                  Código de la carrera
                </label>
                <input
                  type="text"
                  id="degreeID"
                  placeholder="Escriba el código de la carrera."
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
                  rows="3"
                />
              </div>
              <div>
                <label
                  htmlFor="degreeName"
                  className="block my-2 text-sm font-bold text-gray-900"
                >
                  Nombre de la carrera
                </label>
                <input
                  type="text"
                  id="degreeName"
                  placeholder="Escriba el nombre de la carrera."
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
                  rows="3"
                />
              </div>
              {/*AQUI SE TIENE QUE IMPLEMENTAR LOS NOMBRES DE TODAS LAS CARRERAS*/}
              <h1 className="text-sm font-bold py-2">Modalidad</h1>
              <div className="grid grid-cols-3">
                <div className="flex items-center mb-4">
                  <input
                    id="modPresencial"
                    type="checkbox"
                    value={"modPresencial"}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="modPresencial"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Modalidad Presencial
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="department"
                    type="checkbox"
                    value={"department"}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="modVirtual"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Modalidad Virtual
                  </label>
                </div>
              </div>
              <div>
                <label
                  htmlFor="deparment"
                  className="block my-2 text-sm font-bold text-gray-900"
                >
                  Facultad a la que pertenece
                </label>
                <input
                  type="text"
                  id="deparment"
                  placeholder="Escriba el nombre de la facultad a la que pertenece la carrera."
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
                  rows="3"
                />
              </div>
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  className="w-[50%] text-white bg-[#6f7e91] hover:bg-[#4d5866] focus:ring-4 focus:outline-none font-medium rounded-3xl text-xl px-5 2xl:py-2.5 text-center md:p-1"
                  onClick={() => setShowModal(false)}
                >
                  Registrar carrera
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DegreeRegisterForm;
