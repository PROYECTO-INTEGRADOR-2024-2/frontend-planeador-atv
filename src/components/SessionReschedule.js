import React from "react";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SessionReschedule({ open, id, onClose }) {
  const [tutors, setTutors] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
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

  const handleDateChange = (date) => {
    setStartDate(date);

    // Mantener la hora actual cuando se cambia la fecha
    const currentDate = new Date(tutorial.classDate);
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    // Establecer la misma hora en la nueva fecha
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    setTutorial({
      ...tutorial,
      classDate: formatDateForBackend(date),
    });
  };

  const getTime = (event) => {
    // Crear una nueva fecha basada en la fecha seleccionada en el DatePicker
    const selectedDate = new Date(startDate);

    // Obtener las horas y minutos del input de hora
    const [hours, minutes] = event.target.value.split(":");

    // Establecer las horas y minutos en la fecha
    selectedDate.setHours(parseInt(hours, 10));
    selectedDate.setMinutes(parseInt(minutes, 10));
    selectedDate.setSeconds(0);

    // Actualizar el estado con la fecha completa en formato ISO
    setTutorial({
      ...tutorial,
      classDate: formatDateForBackend(selectedDate),
    });
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
          body: JSON.stringify(tutorial),
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
            Reprogramar Tutoría
          </h1>

          <form className="space-y-4 md:space-y-2" onSubmit={""}>
            <div className="py-8">
              <div className="flex justify-between bg-white p-2 px-8 pb-4">
                <div>
                  <label
                    htmlFor="datePicker"
                    className="block text-sm font-bold text-gray-900"
                  >
                    Fecha
                  </label>
                  <div className="flex border-b-2">
                    <DatePicker
                      id="datePicker"
                      name="classDate"
                      selected={startDate}
                      onChange={handleDateChange}
                      className="w-[95px] pb-1"
                      dateFormat="dd/MM/yyyy"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6 left-20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="timePicker"
                    className="block text-sm font-bold text-gray-900"
                  >
                    Hora
                  </label>
                  <div className="border-b-2">
                    <input
                      id="timePicker"
                      name="timePicker"
                      aria-label="Time"
                      type="time"
                      onChange={getTime}
                    />
                  </div>
                </div>
              </div>
            </div>
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
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default SessionReschedule;
