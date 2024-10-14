import React, { useState, useEffect } from "react";
import Modal from "react-modal";

function AddSubjectModal({ open, onClose, subjectToEdit }) {
  const [subject, setSubject] = useState({
    subject_id: "",
    subject_name: "",
    degree_id: "",
  });

  const [degrees, setDegrees] = useState([]);

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/degree");
        if (!response.ok) {
          throw new Error("Error al obtener las carreras");
        }
        const data = await response.json();
        setDegrees(data);
      } catch (error) {
        console.error("Error al cargar carreras:", error.message);
      }
    };

    if (open) {
      fetchDegrees();

      // If editing, set the subject state with the provided subject data
      if (subjectToEdit) {
        setSubject({
          subject_id: subjectToEdit.subject_id,
          subject_name: subjectToEdit.subject_name,
          degree_id: subjectToEdit.degree_id,
        });
      } else {
        // Reset the subject state for adding a new subject
        setSubject({
          subject_id: "",
          subject_name: "",
          degree_id: "",
        });
      }
    }
  }, [open, subjectToEdit]); // Add subjectToEdit as a dependency

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubject((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addOrUpdateSubject = async () => {
    const method = subjectToEdit ? "PUT" : "POST"; // Determine method based on editing
    const endpoint = subjectToEdit
      ? `http://localhost:8080/api/v1/subject/${subject.subject_id}` // Use the subject_id for editing
      : "http://localhost:8080/api/v1/subject"; // For adding

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subject),
      });

      if (!response.ok) {
        throw new Error("Respuesta no válida");
      }

      const result = await response.json();
      console.log("Asignatura guardada:", result);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error al agregar o editar asignatura:", error.message);
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
            {subjectToEdit ? "Editar asignatura" : "Agregar asignatura"}
          </h1>
          <div className="flex justify-center flex-col pt-8">
            <label className="mt-5 block text-black font-bold md:text-right mb-1 md:mb-0 pr-4">
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
              Facultad:
              <select
                name="degree_id"
                value={subject.degree_id}
                onChange={handleChange}
                className="bg-white appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-600 leading-tight focus:outline-none focus:bg-white focus:border-black"
              >
                <option value="">Seleccione una carrera</option>
                {degrees.map((degree) => (
                  <option key={degree.degree_id} value={degree.degree_id}>
                    {degree.degree_name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-row justify-center pt-8">
              <button
                onClick={addOrUpdateSubject}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {subjectToEdit ? "Guardar cambios" : "Agregar asignatura"}
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

export default AddSubjectModal;
