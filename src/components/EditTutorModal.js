import React from "react";
import Modal from "react-modal";
import { useState, useEffect } from "react";

function EditTutorModal({ open, id, onClose }) {
  const [tutors, setTutors] = useState([]);
  const [tutorial, setTutorial] = useState({
    classId: id,
    classState: "",
    studentId: "",
    tutorId: "",
    subjectId: 0,
    classTopics: "",
    classDate: formatDateForBackend(new Date()), // Inicializamos con la fecha actual formateada
    classRate: 0,
  });

  function formatDateForBackend(date) {
    // Formato ISO estándar YYYY-MM-DDTHH:MM:SSZ
    return date.toISOString();
  }

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const tutorResponse = await fetch(
          `http://localhost:8081/api/v1/persons/tutor`
        );
        if (!tutorResponse.ok) {
          throw new Error("Error al obtener los datos de los tutores");
        }
        const tutorsData = await tutorResponse.json();

        setTutors(tutorsData);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (id) {
      fetchTutorData();
    }
  }, [id]);

  useEffect(() => {
    const fetchTutorialData = async () => {
      try {
        const tutorialResponse = await fetch(
          `http://localhost:8081/api/v1/session/${id}`
        );
        if (!tutorialResponse.ok) {
          throw new Error("Error al obtener los datos de la tutoria");
        }
        const tutorialData = await tutorialResponse.json();

        setTutorial(tutorialData);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (id) {
      fetchTutorialData();
    }
  }, [id]);

  const handleChange = (event, number) => {
    const { name, value } = event.target;

    if (name === "tutor_id") {
      // Obtener el ID del tutor directamente del valor seleccionado
      const tutorId = value.split("-")[0]; // Toma el primer valor antes del guión que es el ID
      setTutorial((prev) => ({
        ...prev,
        [name]: tutorId,
      }));
      console.log("Se agrega en tutorID::: " + tutorId);
      console.log("Tipo de id::: " + typeof tutorId);
      console.log("Este es el tutor:: " + JSON.stringify(tutorial));
      console.log("Este es el tutor:: " + JSON.stringify(tutorial));
    }
  };

  const editTutorial = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/session/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            class_id: tutorial.class_id,
            class_state: tutorial.class_state,
            student_id: tutorial.student_id,
            tutor_id: tutorial.tutor_id,
            subject_id: tutorial.subject_id,
            class_topics: tutorial.class_topics,
            class_date: tutorial.class_date,
            class_rate: tutorial.class_rate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Respuesta no válida");
      }

      const result = await response.json();
      console.log("Tutoría editada:", result);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error al editar la tutoría:", error.message);
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
            Cambiar Tutor
          </h1>
          <div className="flex items-center flex-col pt-8">
            <label className="block text-black font-bold md:text-right mb-1 md:mb-0 pr-4">
              Nombre:
              <select
                name="tutor_id"
                onChange={(e) => handleChange(e, false)}
                className="bg-white appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-600 leading-tight focus:outline-none focus:bg-white focus:border-black"
              >
                <option value="">Seleccione un tutor</option>
                {tutors.map((tutor) => (
                  <option
                    key={tutor.user_id}
                    value={`${tutor.user_id}-${tutor.user_firstname} ${tutor.user_lastname}`}
                  >
                    {tutor.user_firstname} {tutor.user_lastname}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-row justify-center pt-8">
              <button
                onClick={editTutorial}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Guardar
              </button>
              <button
                onClick={onClose}
                className=" text-white bg-[#6f7e91] hover:bg-[#4d5866] focus:ring-4 focus:outline-none font-medium rounded-md text-xl px-1 2xl:py-2.5 text-center md:p-1 ml-4"
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

export default EditTutorModal;
