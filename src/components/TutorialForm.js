"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { jwtDecode } from "jwt-decode";

const TUTORIAL_API_BASE_URL = "http://localhost:8080/api/v1/session/";
const TutorialForm = () => {
  //mapear la info en los componentes
  const [dataTutor, setDataTutor] = useState([]);
  const [errorTutor, setErrorTutor] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [dataSubject, setDataSubject] = useState([]);
  const [errorSubject, setErrorSubject] = useState(null);
  const [user, setUser] = useState(null);
  const [tutorial, setTutorial] = useState({
    class_state: "",
    student_id: "",
    tutor_id: "",
    subject_id: 0,
    class_topics: "",
    class_date: "",
    class_rate: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      setUser(user);
      setTutorial({ ...tutorial, student_id: user.user_id });
    }
  }, []);

  useEffect(() => {
    const fetchDataTutor = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/persons/tutor"
        );
        if (!response.ok) {
          throw new error("Respuesta no valida");
        }
        const result = await response.json();
        setDataTutor(result.map((item) => Object.values(item)));
      } catch (error) {
        setErrorTutor(error.message);
      }
    };
    fetchDataTutor();
  }, []);

  useEffect(() => {
    const fetchDataSubject = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/subject/");
        if (!response.ok) {
          throw new error("Respuesta no valida");
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
    const value = event.target.value;
    let value2 = "";
    value.includes("-")
      ? (value2 = value.split("-").shift().trim())
      : (value2 = value);

    if (number) {
      console.log("1:  " + value2);
      setTutorial({ ...tutorial, [event.target.name]: parseInt(value2) });
    } else {
      console.log("2  " + value2);
      setTutorial({ ...tutorial, [event.target.name]: value2 });

    }

    if (event.target.name == "tutor_id") {
      if (!event.target.value.includes("0000")) {
        setTutorial({ ...tutorial, class_state: "pendiente_asignada" });

      } else {
        setTutorial({ ...tutorial, class_state: "pendiente" });

      }
    }

  };

  const handleChange2 = (event, number) => {
    const { name, value } = event.target;

    if (name === "tutor_id") {
      // Obtener el ID del tutor directamente del valor seleccionado
      const tutorId = value.split("-")[0]; // Toma el primer valor antes del guión que es el ID

      setTutorial(prev => ({
        ...prev,
        [name]: tutorId,
        class_state: !tutorId.includes("0000") ? "pendiente_asignada" : "pendiente"
      }));
    } else if (number) {
      // Para otros campos numéricos
      const cleanValue = value.includes("-") ? value.split("-")[0].trim() : value;
      setTutorial(prev => ({
        ...prev,
        [name]: parseInt(cleanValue)
      }));
    } else {
      // Para campos de texto
      setTutorial(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const getTime = (event) => {
    let seconds = "00";
    let value = tutorial.class_date;
    let value2 = event.target.value + ":" + seconds + "Z";
    value = value.split("T").shift() + "T" + value2;

    setTutorial({ ...tutorial, class_date: value });
  };

  const saveTutorial = async (e) => {
    console.log(tutorial);
    // e.preventDefault();
    // const response = await fetch(TUTORIAL_API_BASE_URL, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(tutorial),
    // });
    // if (!response.ok) {
    //   throw new Error("Something went wrong");
    // } else {
    //   console.log("Request sent");
    // }
    // const _tutor = await response.json();
    //reset(e);
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
            name="subject_id"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-2"
            onChange={(e) => handleChange(e, true)}
          >
            {dataSubject.map((item) => (
              <option key={item[0]}>{item[0] + "-" + item[2]}</option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="class_topics"
            className="block my-2 text-sm font-bold text-gray-900"
          >
            Temática
          </label>
          <textarea
            id="tematica"
            name="class_topics"
            placeholder="Escriba los temas que le gustaría desarrollar en la tutoría."
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
            rows="3"
            onChange={(e) => handleChange(e)}
            value={tutorial.class_topics}
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
                  name="class_date"
                  selected={startDate}
                  onChange={(startDate, e) => {
                    let alterDate = "";
                    let day = 0;
                    let month = 0;
                    let year = 0;

                    setStartDate(startDate);
                    alterDate = startDate
                      .toLocaleString()
                      .split(",")
                      .shift()
                      .trim();

                    day =
                      alterDate.split("/")[0] / 10 < 1
                        ? "0" + alterDate.split("/")[0]
                        : alterDate.split("/")[0];
                    month =
                      alterDate.split("/")[1] / 10 < 1
                        ? "0" + alterDate.split("/")[1]
                        : alterDate.split("/")[1];
                    year = alterDate.split("/")[2];

                    console.log(alterDate);

                    let value = tutorial.class_date.split("T").pop();
                    alterDate = year + "-" + month + "-" + day + "T" + value;
                    setTutorial({
                      ...tutorial,
                      class_date: alterDate,
                    });
                  }}
                  on
                  className="w-[95px] pb-1"
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
        <div>
          <label
            htmlFor="tutor"
            className="block my-2 text-sm font-bold text-gray-900 text-center"
          >
            Seleccione el tutor disponible
          </label>

          <select
            id="tutor"
            name="tutor_id"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-2"
            onChange={(e) => handleChange2(e, false)}
          >
            <option value="">Seleccione un tutor</option>
            {dataTutor.map((item) => (
              <option key={item[0]} value={`${item[0]}-${item[2]}-${item[3]}`}>
                {item[2]} - {item[3]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center pt-8">
          <button
            // type="submit"
            type="button"
            onClick={saveTutorial}
            className="w-[50%] text-white bg-[#6f7e91] hover:bg-[#4d5866] focus:ring-4 focus:outline-none font-medium rounded-3xl text-xl px-5 2xl:py-2.5 text-center md:p-1"
          >
            Confirmar tutoría
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorialForm;
