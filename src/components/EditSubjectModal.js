import React from "react";
import Modal from "react-modal";
import { useState, useEffect } from "react";

function EditSubjectModal({ open, id, onClose }) {
  const [subject, setSubject] = useState({
    subject_name: "",
    degree_id: "",
    degree_name: "",
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
          throw new Error("Error al obtener los datos de la carrera");
        }
        const degreeData = await degreeResponse.json();

        setSubject({
          subject_name: subjectData.subject_name,
          degree_id: subjectData.degree_id,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "degree_id" ? Number(value) : value;
    setSubject((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    console.log(subject);
  };

  const editSubject = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/subject/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject_name: subject.subject_name,
            degree_id: subject.degree_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Respuesta no válida");
      }

      const result = await response.json();
      console.log("Asignatura editada:", result);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error al editar asignatura:", error.message);
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
            Editar asignatura
          </h1>
          <div className="flex justify-center flex-col pt-8">
            <label className="block text-black font-bold md:text-right mb-1 md:mb-0 pr-4">
              Nombre:
              <input
                type="text"
                name="subject_name"
                value={subject.subject_name}
                onChange={handleChange}
                className="bg-white appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-600 leading-tight focus:outline-none focus:bg-white focus:border-black"
              />
            </label>
            <label className="mt-5 block text-black font-bold md:text-right mb-1 md:mb-0 pr-4">
              Id de la carrera:
              <input
                type="text"
                name="degree_id"
                value={subject.degree_id}
                onChange={handleChange}
                className="bg-gray appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-600 leading-tight focus:outline-none focus:bg-white focus:border-black"
                disabled
              />
            </label>
            <label className="mt-5 block text-black font-bold md:text-right mb-1 md:mb-0 pr-4">
              Nombre de la carrera:
              <input
                type="text"
                name="degree_name"
                value={subject.degree_name}
                className="bg-gray appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-600 leading-tight focus:outline-none focus:bg-white focus:border-black"
                disabled
              />
            </label>
            <div className="flex flex-row justify-center pt-8">
              <button
                onClick={editSubject}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Editar asignatura
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

export default EditSubjectModal;
