import React from "react";
import Modal from "react-modal";

function DeleteDegreeModal({ open, id, onClose }) {
  const editDegree = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/degree/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Respuesta no válida");
      }

      const result = await response.json();
      console.log("Carrera editada:", result);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar carrera:", error.message);
    }
  };

  return (
    <Modal
      isOpen={open}
      className="absolute flex flex-col w-[40vw] left-[35vw] top-[15vh]"
    >
      <div className="w-[30vw] bg-[#d9d9d9] px-8 pb-8 rounded-[50px] p-2 mb-8">
        <div className="w-full text-center my-[3vh]">
          <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-red-500 md:text-2xl lg:text-4xl dark:text-black">
            Editar carrera
          </h1>
        </div>
        <div className="flex justify-center pt-8">
          <button
            className="w-[50%] text-white bg-yellow-400 hover:bg-yellow-600 focus:ring-4 focus:outline-none font-medium rounded-3xl text-xl px-5 2xl:py-2.5 text-center md:p-1"
            onClick={() => deleteDegree(id)}
          >
            Borrar carrera
          </button>
          <button
            className="w-[50%] text-white bg-[#6f7e91] hover:bg-[#4d5866] focus:ring-4 focus:outline-none font-medium rounded-3xl text-xl px-5 2xl:py-2.5 text-center md:p-1"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteDegreeModal;
