import React, { useState } from "react";
import Modal from "react-modal";

function AddDegreeModal({ open, onClose }) {
  const [degree, setDegree] = useState({
    degreeName: "",
    degreeModality: "",
    degreeDepartment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDegree((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addDegree = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/v1/degree", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(degree),
      });

      if (!response.ok) {
        throw new Error("Respuesta no válida");
      }

      const result = await response.json();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error al agregar carrera:", error.message);
    }
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      className="absolute flex flex-col w-[40vw] left-[35vw] top-[15vh]"
    >
      <div className="w-[30vw] bg-[#d9d9d9] px-8 pb-8 rounded-[50px] p-2 mb-8">
        <div className="w-full text-center my-[3vh]">
          <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-red-500 md:text-2xl lg:text-4xl dark:text-black">
            Agregar carrera
          </h1>
          <div className="flex justify-center flex-col pt-8">
            <label className="block text-black font-bold md:text-right mb-1 md:mb-0 pr-4">
              Nombre:
              <input
                type="text"
                name="degree_name"
                value={degree.degree_name}
                onChange={handleChange}
                className="bg-white appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-600 leading-tight focus:outline-none focus:bg-white focus:border-black"
              />
            </label>
            <label className="mt-5 block text-black font-bold md:text-right mb-1 md:mb-0 pr-4">
              Modalidad:
              <input
                type="text"
                name="degree_modality"
                value={degree.degree_modality}
                onChange={handleChange}
                className="bg-white appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-600 leading-tight focus:outline-none focus:bg-white focus:border-black"
              />
            </label>
            <label className="mt-5 block text-black font-bold md:text-right mb-1 md:mb-0 pr-4">
              Facultad:
              <input
                type="text"
                name="degree_department"
                value={degree.degree_department}
                onChange={handleChange}
                className="bg-white appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-600 leading-tight focus:outline-none focus:bg-white focus:border-black"
              />
            </label>
            <div className="flex flex-row justify-center pt-8">
              <button
                onClick={addDegree}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Agregar carrera
              </button>
              <button
                onClick={onClose}
                className="w-[40%] text-white bg-[#6f7e91] hover:bg-[#4d5866] focus:ring-4 focus:outline-none font-medium rounded-md text-xl px-1 2xl:py-2.5 text-center md:p-1 ml-4"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AddDegreeModal;
