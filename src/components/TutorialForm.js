"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const TUTORIAL_API_BASE_URL = "http://localhost:8081/api/v1/session/";
const TutorialForm = () => {
  //mapear la info en los componentes
  const [dataTutor, setDataTutor] = useState([]);
  const [errorTutor, setErrorTutor] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [tutorSelected, setTutorSelected] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [dataSubject, setDataSubject] = useState([]);
  const [errorSubject, setErrorSubject] = useState(null);
  const [user, setUser] = useState(null);
  const [tutorial, setTutorial] = useState({
    registered: false,
    canceledBy: "NONE",
    studentId: "",
    tutorId: "",
    subjectId: 0,
    classTopics: "",
    classDate: formatDateForBackend(new Date()), // Inicializamos con la fecha actual formateada
    classRate: 0,
  });

  // Función para formatear la fecha correctamente para el backend
  function formatDateForBackend(date) {
    // Formato ISO estándar YYYY-MM-DDTHH:MM:SSZ
    return date.toISOString();
  }

  const handleChangeItem = () => {
    setIsDisabled(True);
  };

  useEffect(() => {
    const token = Cookies.get("token");
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setTutorial((prev) => ({ ...prev, studentId: decoded.user_id }));
    } catch (error) {
      console.error("Token inválido", error);
    }
  }, []);

  const fetchDataTutor = async (fechaISO) => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/v1/listarTutores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(procesarFecha(fechaISO)),
        }
      );
      if (!response.ok) {
        throw new Error("Respuesta no valida");
      }
      const result = await response.json();
      if (result.length > 0) {
        setIsDisabled(false);
      }
      setDataTutor(result.map((item) => Object.values(item)));
    } catch (error) {
      setErrorTutor(error.message);
    }
  };

  useEffect(() => {
    const fetchDataSubject = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/v1/subject/");
        if (!response.ok) {
          throw new Error("Respuesta no valida");
        }
        const result = await response.json();
        setDataSubject(result.map((item) => Object.values(item)));
      } catch (error) {
        setErrorSubject(error.message);
      }
    };
    fetchDataSubject();
  }, []);

  const handleChange = (event, number) => {
    setIsDisabled(true);
    const value = event.target.value;
    let value2 = "";
    value.includes("-")
      ? (value2 = value.split("-").shift().trim())
      : (value2 = value);

    if (number) {
      setTutorial({ ...tutorial, [event.target.name]: parseInt(value2) });
    } else {
      setTutorial({ ...tutorial, [event.target.name]: value2 });
    }
  };

  const handleChange2 = (event, number) => {
    const { name, value } = event.target;

    if (name === "tutorId") {
      if (event.target.value === "Seleccione un tutor") {
        setIsDisabled(true);
      }
      const tutorId = value.split("-")[0];
      setTutorial((prev) => ({
        ...prev,
        [name]: tutorId,
      }));
    } else if (number) {
      const cleanValue = value.includes("-")
        ? value.split("-")[0].trim()
        : value;
      setTutorial((prev) => ({
        ...prev,
        [name]: parseInt(cleanValue),
      }));
    } else {
      setTutorial((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const getTime = (event) => {
    setIsDisabled(true);
    const selectedHour = event.target.value; // Solo la hora: "08", "09", etc.
    const selectedDate = new Date(startDate);

    // Establecer la hora seleccionada, minutos siempre en 00
    selectedDate.setHours(parseInt(selectedHour, 10));
    selectedDate.setMinutes(0);
    selectedDate.setSeconds(0);

    setTutorial({
      ...tutorial,
      classDate: formatDateForBackend(selectedDate),
    });
  };

  //Formatear fechas
  function procesarFecha(fechaISO) {
    const fechaObj = new Date(fechaISO);

    // Obtener componentes
    const fecha = fechaObj.toISOString().split("T")[0];
    const hora24 = fechaObj.toTimeString().split(" ")[0];

    // Días de la semana en español
    const diasSemana = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];
    const diaSemana = diasSemana[fechaObj.getDay()];

    // Convertir a formato 12 horas
    let horas = fechaObj.getHours();

    const periodo = horas >= 12 ? "PM" : "AM";
    horas = horas % 12 || 12; // Convertir 0 a 12 para formato 12h
    const hora12 = horas < 10 ? `0${horas}` : `${horas}`;
    console.log("Fecha formateada mamapollas");

    const fechaForm = {
      subjectId: tutorial.subjectId,
      date: fecha,
      hour: `${hora12}:00`,
      dayWeek: diaSemana,
      period: periodo,
    };
    console.log(fechaForm);
    return fechaForm;
  }

  const handleDateChange = (date) => {
    setIsDisabled(true);
    setStartDate(date);

    // Mantener la hora actual cuando se cambia la fecha
    const currentDate = new Date(tutorial.classDate);
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    // Establecer la misma hora en la nueva fecha
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setTutorial({ ...tutorial, classDate: formatDateForBackend(newDate) });
  };

  const saveTutorial = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(TUTORIAL_API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tutorial),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const _tutor = await response.json();
      alert("Tutoría creada exitosamente");

      // Resetear el formulario o redirigir
    } catch (error) {
      console.error("Error al guardar la tutoría:", error);
      alert("Error al guardar la tutoría");
    }
  };

  return (
    <div className="w-[30vw] bg-[#d9d9d9] px-8 pb-8 rounded-[50px] p-2 mb-8">
      <div className="w-full text-center my-[3vh]">
        <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-black">
          Información del espacio
        </h1>
      </div>
      <form className="space-y-4 md:space-y-2" onSubmit={saveTutorial}>
        <div>
          <label
            htmlFor="asignatura"
            className="block my-2 text-sm font-bold text-gray-900"
          >
            Asignatura
          </label>
          <select
            id="asignatura"
            name="subjectId"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-2"
            onChange={(e) => handleChange(e, true)}
          >
            <option value="">Seleccione una asignatura</option>
            {dataSubject.map((item) => (
              <option key={item[0]} value={`${item[0]}-${item[2]}`}>
                {item[2]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="classTopics"
            className="block my-2 text-sm font-bold text-gray-900"
          >
            Temática
          </label>
          <textarea
            id="tematica"
            name="classTopics"
            placeholder="Escriba los temas que le gustaría desarrollar en la tutoría."
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
            rows="3"
            onChange={(e) => handleChange(e)}
            value={tutorial.classTopics}
          />
        </div>
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
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fetchDataTutor(tutorial.classDate)}
            className="w-[50%] text-white bg-[#6f7e91] hover:bg-[#4d5866] focus:ring-4 focus:outline-none font-medium rounded-3xl text-xl px-5 2xl:py-2.5 text-center md:p-1"
          >
            Buscar tutores disponibles
          </button>
        </div>
        <div>
          <label
            htmlFor="tutor"
            className="block my-2 text-sm font-bold text-gray-900 text-center"
          >
            Seleccione el tutor disponible
          </label>

          <select
            id="tutor"
            name="tutorId"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-2"
            onChange={(e) => handleChange2(e, false)}
          >
            <option value="">Seleccione un tutor</option>
            {dataTutor.map((item) => (
              <option key={item[0]} value={`${item[0]}-${item[1]} ${item[2]}`}>
                {item[1]} {item[2]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={isDisabled}
            className="w-[50%] text-white bg-[#6f7e91] hover:bg-[#4d5866] disabled:hover:bg-[#6f7e91] focus:ring-4 focus:outline-none font-medium rounded-3xl text-xl px-5 2xl:py-2.5 text-center md:p-1"
          >
            Confirmar tutoría
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorialForm;
