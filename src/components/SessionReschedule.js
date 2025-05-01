import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formatDateForBackend = (date) => {
  const pad = (n) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

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
    classDate: formatDateForBackend(new Date()),
    classRate: 0,
  });

  // Cargar tutores
  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/v1/persons/tutor"
        );
        if (!response.ok) throw new Error("Error al obtener los tutores");
        const data = await response.json();
        setTutors(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (id) fetchTutorData();
  }, [id]);

  // Cargar datos de la tutoría
  useEffect(() => {
    const fetchTutorialData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/v1/session/${id}`
        );
        if (!response.ok) throw new Error("Error al obtener la tutoría");
        const data = await response.json();

        const fecha = new Date(data.classDate);
        setStartDate(fecha);
        setTutorial({ ...data, classDate: formatDateForBackend(fecha) });
      } catch (error) {
        console.error(error.message);
      }
    };

    if (id) fetchTutorialData();
  }, [id]);

  const handleDateChange = (date) => {
    const updatedDate = new Date(date);
    const current = new Date(startDate);
    updatedDate.setHours(current.getHours(), current.getMinutes(), 0);

    setStartDate(updatedDate);
    setTutorial({ ...tutorial, classDate: formatDateForBackend(updatedDate) });
  };

  const getTime = (event) => {
    const [hours, minutes] = event.target.value.split(":").map(Number);
    const updatedDate = new Date(startDate);
    updatedDate.setHours(hours, minutes, 0);

    setStartDate(updatedDate);
    setTutorial({ ...tutorial, classDate: formatDateForBackend(updatedDate) });
  };

  const editTutorial = async (event) => {
    event.preventDefault(); // CORRECTO: evita recarga del formulario

    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/session/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tutorial),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar la tutoría");

      await response.json();
      onClose();
      setTimeout(() => window.location.reload(), 500); // DEFER: correcta recarga
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
          <h1 className="mb-4 text-xl font-extrabold text-red-500 md:text-2xl lg:text-4xl dark:text-black">
            Reprogramar Tutoría
          </h1>

          <form className="space-y-4 md:space-y-2" onSubmit={editTutorial}>
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
                      selected={startDate}
                      onChange={handleDateChange}
                      className="w-[95px] pb-1"
                      dateFormat="dd/MM/yyyy"
                    />
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
                      type="time"
                      value={`${String(startDate.getHours()).padStart(
                        2,
                        "0"
                      )}:${String(startDate.getMinutes()).padStart(2, "0")}`}
                      onChange={getTime}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
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
