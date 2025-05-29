import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Función para formatear la fecha igual que en TutorialForm
const formatDateForBackend = (date) => {
  return date.toISOString();
};

function SessionReschedule({ open, tutorialData, onClose, onUpdate }) {
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    if (open && tutorialData?.classDate) {
      setStartDate(new Date(tutorialData.classDate));
    }
  }, [open, tutorialData]);

  const handleDateChange = (date) => {
    // Mantener la hora actual cuando se cambia la fecha
    const currentHours = startDate.getHours();
    const currentMinutes = startDate.getMinutes();
    
    const updated = new Date(date);
    updated.setHours(currentHours, currentMinutes, 0);
    setStartDate(updated);
  };

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const updated = new Date(startDate);
    updated.setHours(hours, minutes, 0);
    setStartDate(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tutorialData) return;

    // Usar el mismo formato que TutorialForm
    const formattedDate = formatDateForBackend(startDate);

    try {
      const updatedTutorial = {
        ...tutorialData,
        classDate: formattedDate,
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

      if (onUpdate) onUpdate();
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

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-2">
            <div className="py-8">
              <div className="flex justify-between bg-white p-2 px-8 pb-4">
                <div>
                  <label htmlFor="datePicker" className="block text-sm font-bold text-gray-900">
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
                  <label htmlFor="timePicker" className="block text-sm font-bold text-gray-900">
                    Hora
                  </label>
                  <div className="border-b-2">
                    <input
                      id="timePicker"
                      type="time"
                      value={`${String(startDate.getHours()).padStart(2, "0")}:${String(
                        startDate.getMinutes()
                      ).padStart(2, "0")}`}
                      onChange={handleTimeChange}
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