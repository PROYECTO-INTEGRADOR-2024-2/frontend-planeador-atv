"use client";
import React, { useState } from "react";
import Modal from "react-modal";

const SubjectRegister = ({ useStates }) => {
  const [showModal, setShowModal] = useState();
  return (
    <div>
      <div className="flex items-center blur-md">
        <Modal
          isOpen={showModal}
          className={"absolute flex flex-col w-[40vw] left-[35vw] top-[15vh]"}
        >
          <div className="w-[30vw] bg-[#d9d9d9] px-8 pb-8 rounded-[50px] p-2 mb-8">
            <div className="w-full text-center my-[3vh]">
              <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-black">
                Información de la Asignatura.
              </h1>
            </div>
            <form className="space-y-4 md:space-y-2" action="#">
              <div>
                <label
                  htmlFor="subjectID"
                  className="block my-2 text-sm font-bold text-gray-900"
                >
                  Código de la asignatura
                </label>
                <input
                  type="text"
                  id="subjectID"
                  placeholder="Escriba el código de la asignatura."
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
                  rows="3"
                />
              </div>
              <div>
                <label
                  htmlFor="subjectName"
                  className="block my-2 text-sm font-bold text-gray-900"
                >
                  Nombre de la asignatura
                </label>
                <input
                  type="text"
                  id="subjectName"
                  placeholder="Escriba el nombre de la asignatura."
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
                  rows="3"
                />
              </div>
              {/*AQUI SE TIENE QUE IMPLEMENTAR LOS NOMBRES DE TODAS LAS CARRERAS*/}
              <h1 className="text-sm font-bold py-2">Carreras Asociadas</h1>
              <div className="grid grid-cols-3">
                <div className="flex items-center mb-4">
                  <input
                    id="carrera-1"
                    type="checkbox"
                    value={"carrera-1"}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="carrera-1"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Carrera 1
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="carrera-2"
                    type="checkbox"
                    value={"carrera-2"}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="carrera-2"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Carrera 2
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="carrera-3"
                    type="checkbox"
                    value={"carrera-3"}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="carrera-3"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Carrera 3
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="carrera-4"
                    type="checkbox"
                    value={"carrera-4"}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="carrera-4"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Carrera 4
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="carrera-5"
                    type="checkbox"
                    value={"carrera-5"}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="carrera-5"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Carrera 5
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="carrera-6"
                    type="checkbox"
                    value={"carrera-6"}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="carrera-6"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Carrera 6
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="carrera-7"
                    type="checkbox"
                    value={"carrera-7"}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="carrera-7"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Carrera 7
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="carrera-8"
                    type="checkbox"
                    value={"carrera-8"}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="carrera-8"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Carrera 8
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    value={"carrera-9"}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="carrera-9"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Carrera 9
                  </label>
                </div>
              </div>
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  className="w-[50%] text-white bg-[#6f7e91] hover:bg-[#4d5866] focus:ring-4 focus:outline-none font-medium rounded-3xl text-xl px-5 2xl:py-2.5 text-center md:p-1"
                  onClick={() => setShowModal(false)}
                >
                  Confirmar tutoria
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SubjectRegister;
