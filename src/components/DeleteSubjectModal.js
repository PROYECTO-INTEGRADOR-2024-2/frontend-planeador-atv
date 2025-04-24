import React, { useState, useEffect } from "react";
import Modal from "react-modal";

function DeleteSubjectModal({ open, id, onClose }) {
  const [subject, setSubject] = useState({
    subjectId: "",
    subjectName: "",
    degreeName: "",
  });

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const subjectResponse = await fetch(
          `http://localhost:8081/api/v1/subject/${id}`
        );
        if (!subjectResponse.ok) {
          throw new Error("Error al obtener los datos de la asignatura");
        }
        const subjectData = await subjectResponse.json();

        const degreeResponse = await fetch(
          `http://localhost:8081/api/v1/degree/${subjectData.degree_id}`
        );
        if (!degreeResponse.ok) {
          throw new Error("Error al obtener el nombre de la carrera");
        }
        const degreeData = await degreeResponse.json();

        setSubject({
          ...subjectData,
          degree_name: degreeData.degree_name,
        });
      } catch (error) {
        console.error(error.message);
      }
    };

    if (id) {
      fetchSubjectData();
    }
  }, [id]);

  const deleteSubject = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/subject/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la asignatura");
      }

      console.log("Asignatura eliminada");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar asignatura:", error.message);
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
            Eliminar asignatura
          </h1>
          <p className="text-black mb-4">
            ¿Estás seguro de que deseas eliminar la asignatura{" "}
            <strong>{subject.subject_name}</strong> de la carrera{" "}
            <strong>{subject.degree_name}</strong>?
          </p>
          <div className="flex flex-row justify-center pt-8">
            <button
              onClick={deleteSubject}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Eliminar asignatura
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
    </Modal>
  );
}

export default DeleteSubjectModal;
