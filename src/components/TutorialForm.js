"use client"; // This is a client component 👈🏽

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TutorialForm = () => {
  const [dataTutor, setDataTutor] = useState([]);
  const [errorTutor, setErrorTutor] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  // const routerr = useRouter();
  const [dataSubject, setDataSubject] = useState([]);
  const [errorSubject, setErrorSubject] = useState(null);

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

  //"2da petición"

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

  return (
    <div className="w-[30vw] bg-[#d9d9d9] px-8 pb-8 rounded-[50px] p-2 mb-8">
      <div className="w-full text-center my-[3vh]">
        <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-black">
          Información del espacio
        </h1>
      </div>
      <form className="space-y-4 md:space-y-2" action="/landing">
        <div>
          <label
            htmlFor="asignatura"
            class="block my-2 text-sm font-bold text-gray-900"
          >
            Asignatura
          </label>
          <select
            id="asignatura"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-2"
          >
            {dataSubject.map((item, index) => (
              <option key={index}>{item[1]}</option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="tematica"
            className="block my-2 text-sm font-bold text-gray-900"
          >
            Temática
          </label>
          <textarea
            id="tematica"
            placeholder="Escriba los temas que le gustaría desarrollar en la tutoría."
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
            rows="3"
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
                  name="datePicker"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="w-[95px] pb-1"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  class="size-6 left-20"
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
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="tutor"
            class="block my-2 text-sm font-bold text-gray-900 text-center"
          >
            Seleccione el tutor disponible
          </label>
          <select
            id="tutor"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-2"
          >
            {dataTutor.map((item, index) => (
              <option key={index}>{item[2] + " " + item[3]}</option>
            ))}
            {/* <option>Jonathan Granda</option>
            <option>Cristian Muñoz</option>
            <option>Brandon Duque</option> */}
          </select>
        </div>
        <div className="flex justify-center pt-8">
          <button
            type="submit"
            className="w-[50%] text-white bg-[#6f7e91] hover:bg-[#4d5866] focus:ring-4 focus:outline-none font-medium rounded-3xl text-xl px-5 2xl:py-2.5 text-center md:p-1"
            // onClick={routerr.push("/landing")}
          >
            Confirmar tutoria
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorialForm;
