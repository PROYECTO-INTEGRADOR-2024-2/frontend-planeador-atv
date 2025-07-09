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
  const [timeSelected, setTimeSelected] = useState("");
  const [tutorial, setTutorial] = useState({
      registered: false,
      canceledBy: "NONE",
      studentId: "",
      tutorId: "",
      subjectId: 0,
      classTopics: "",
      classDate: formatDateForBackend(getTwoDaysLaterDate()),
      classRate: 0,
    });

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

   function getTwoDaysLaterDate() {
    const date = new Date();
    date.setDate(date.getDate() );
    return date;
  }

  const getTime = (event) => {
    
    const selectedHour = event.target.value; // Solo la hora: "08", "09", etc.
    if(selectedHour === ""){
      setTimeSelected("");
      return;
    }

    const updatedDate = new Date(startDate)

    updatedDate.setHours(parseInt(selectedHour, 10), 0, 0)
    setStartDate(updatedDate);

    setTimeSelected(formatDateForBackend(updatedDate));

    setTutorial((prev) =>({
      ...prev,
      classDate: formatDateForBackend(updatedDate),
    }));
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
                      minDate={new Date(new Date().setDate(new Date().getDate()))}
                    />
                  </div>
                </div>

                {/* <div>
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
                </div> */}
                <div>
                  <label
                    htmlFor="hourPicker"
                    className="block text-sm font-bold text-gray-900"
                  >
                    Hora
                  </label>
                  <div className="border-b-2">
                    <select
                      id="hourPicker"
                      name="hourPicker"
                      onChange={getTime}
                      className="bg-transparent border-none outline-none text-gray-900 text-sm py-1"
                    >
                      <option value="">Seleccionar hora</option>
                      <option value="6">06:00 AM</option>
                      <option value="7">07:00 AM</option>
                      <option value="8">08:00 AM</option>
                      <option value="9">09:00 AM</option>
                      <option value="10">10:00 AM</option>
                      <option value="11">11:00 AM</option>
                      <option value="12">12:00 PM</option>
                      <option value="13">01:00 PM</option>
                      <option value="14">02:00 PM</option>
                      <option value="15">03:00 PM</option>
                      <option value="16">04:00 PM</option>
                      <option value="17">05:00 PM</option>
                      <option value="18">06:00 PM</option>
                      <option value="19">07:00 PM</option>
                      <option value="20">08:00 PM</option>
                    </select>
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