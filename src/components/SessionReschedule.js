import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formatDateForBackend = (date) => {
  const pad = (n) => n.toString().padStart(2, "0");
  
  // Como el backend espera el formato sin zona horaria y lo interpreta como UTC,
  // necesitamos ajustar la fecha para compensar la diferencia de zona horaria
  const offsetMs = date.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(date.getTime() - offsetMs);
  
  return `${adjustedDate.getFullYear()}-${pad(adjustedDate.getMonth() + 1)}-${pad(
    adjustedDate.getDate()
  )}T${pad(adjustedDate.getHours())}:${pad(adjustedDate.getMinutes())}:00`;
};

function SessionReschedule({ open, tutorialData, onClose, onUpdate }) {
  const [startDate, setStartDate] = useState(new Date());

  // Inicializar la fecha cuando se abra el modal con los datos de la tutoría
  useEffect(() => {
    if (open && tutorialData) {
      const fecha = new Date(tutorialData.classDate);
      setStartDate(fecha);
    }
  }, [open, tutorialData]);

  const handleDateChange = (date) => {
    const updatedDate = new Date(date);
    const current = new Date(startDate);
    updatedDate.setHours(current.getHours(), current.getMinutes(), 0);
    setStartDate(updatedDate);
  };

  const getTime = (event) => {
    const [hours, minutes] = event.target.value.split(":").map(Number);
    const updatedDate = new Date(startDate);
    updatedDate.setHours(hours, minutes, 0);
    setStartDate(updatedDate);
  };

  const editTutorial = async (event) => {
    event.preventDefault();

    if (!tutorialData) return;

    const formattedDate = formatDateForBackend(startDate);
    
    // Debug: verificar qué fecha se está enviando
    console.log("Fecha seleccionada:", startDate);
    console.log("Fecha formateada para backend:", formattedDate);

    try {
      const updatedTutorial = {
        ...tutorialData,
        classDate: formattedDate
      };

      const response = await fetch(
        `http://localhost:8081/api/v1/session/${tutorialData.classId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTutorial),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar la tutoría");

      await response.json();
      
      // Llamar callback para actualizar la tabla
      if (onUpdate) {
        onUpdate();
      }
      
      onClose();
    } catch (error) {
      console.error("Error al editar la tutoría:", error.message);
    }
  };

  if (!tutorialData) return null;

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