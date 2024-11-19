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
      //console.log("1:  " + value2);
      setTutorial({ ...tutorial, [event.target.name]: parseInt(value2) });
    } else {
      //console.log("2  " + value2);
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

      setTutorial((prev) => ({
        ...prev,
        [name]: tutorId,
        class_state: !tutorId.includes("0000")
          ? "pendiente_asignada"
          : "pendiente",
      }));
    } else if (number) {
      // Para otros campos numéricos
      const cleanValue = value.includes("-")
        ? value.split("-")[0].trim()
        : value;
      setTutorial((prev) => ({
        ...prev,
        [name]: parseInt(cleanValue),
      }));
    } else {
      // Para campos de texto
      setTutorial((prev) => ({
        ...prev,
        [name]: value,
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
    //console.log(tutorial);
    e.preventDefault();
    const response = await fetch(TUTORIAL_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tutorial),
    });
    if (!response.ok) {
      throw new Error("Something went wrong");
    } else {
      //console.log("Request sent");
    }
    const _tutor = await response.json();
    //reset(e);
  };

  return (
    <div className="w-[30vw] bg-[#d9d9d9] px-8 pb-8 rounded-[50px] p-2 mb-8">
      <div className="w-full text-center my-[3vh]">
        <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-black">
          Solicitud de Registro Tutor
        </h1>
      </div>
      <form className="space-y-4 md:space-y-2" onSubmit={saveTutorial}>
        <div>
          <label
            htmlFor="asignaturas"
            className="block my-2 text-base font-bold text-gray-900 text-center"
          >
            Asignaturas
          </label>
          <div name="asignaturas" className="grid grid-cols-2 gap-4 py-5">
            {dataSubject.map((item) => (
              <div className="flex gap-4" key={item[0]}>
                <input type="checkbox" id={item[0]} name={item[0]} />
                <label for={item[0]}>{item[0] + "-" + item[2]}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label
            htmlFor="class_topics"
            className="block my-2 text-base font-bold text-gray-900 text-center"
          >
            Semestre
          </label>
          <div className="grid grid-cols-3 ">
            <select className="col-start-2 h-[5vh] rounded-xl bg-[#6f7e91] text-white font-bold">
              <option className="text-center font-bold">2</option>
              <option className="text-center font-bold">3</option>
              <option className="text-center font-bold">4</option>
              <option className="text-center font-bold">5</option>
              <option className="text-center font-bold">6</option>
              <option className="text-center font-bold">7</option>
              <option className="text-center font-bold">8</option>
              <option className="text-center font-bold">9</option>
              <option className="text-center font-bold">10</option>
            </select>
          </div>
        </div>
        <div className="py-4">
          <div class="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-[##D9D9D9] border-gray-600 hover:border-gray-500 hover:bg-[#f2eded]"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  class="w-[8vw] h-[8vh] mb-4 text-blue-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-xl text-slate-950">
                  <span class="font-semibold">
                    Sube tu certificado de matrícula
                  </span>
                  <br />
                  <span className="text-blue-700 font-bold">
                    Seleccionalo
                  </span>{" "}
                  o arrastralo
                </p>
              </div>
              <input id="dropzone-file" type="file" class="hidden" />
            </label>
          </div>
        </div>
        <div>
          <div className="flex gap-4">
            <input type="checkbox" id="terminos" />
            <label for="terminos">Acepto términos y condiciones.</label>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-20">
          <button
            // type="submit"
            type="button"
            onClick={saveTutorial}
            className="w-[50%] text-white bg-[#6f7e91] hover:bg-[#4d5866] focus:ring-4 focus:outline-none font-medium rounded-3xl text-xl 2xl:py-2.5 text-center md:p-1 px-2"
          >
            Cancelar
          </button>
          <button
            // type="submit"
            type="button"
            onClick={saveTutorial}
            className="w-[50%] text-white bg-[#6f7e91] hover:bg-[#4d5866] focus:ring-4 focus:outline-none font-medium rounded-3xl text-xl 2xl:py-2.5 text-center md:p-1 px-2"
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorialForm;
