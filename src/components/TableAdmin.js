"use client";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { format } from 'date-fns'
import es from 'date-fns/locale/es';

const TablePool = ({ title, columns }) => {
  const [pendingTutorials, setPendingTutorials] = useState([]);
  const [acceptedTutorials, setAcceptedTutorials] = useState([]);
  const [completedTutorials, setCompletedTutorials] = useState([]);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [person, setPerson] = useState([]);

  //información del token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      setUser(user);
      console.log("Usuario cargado:", user);
    }
  }, []);

  //Data con las tutorias
  useEffect(() => {
    const fetchDataSubject = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/v1/subject/");
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const result = await response.json();
        setSubject(result.map((item) => Object.values(item)));
      } catch (error) {
        console.error("Error al cargar materias:", error);
        setError(error.message);
      }
    };
    fetchDataSubject();
  }, []);  

  //Data de las persons
  useEffect(() => {
    const fetchDataUser = async () => {
      try{
        const resp = await fetch("http://localhost:8081/api/v1/persons");
        if(!resp.ok){
          throw new Error(`Error HTTP: ${resp.status}`);
        }
        const rpta = await resp.json();
        setPerson(rpta.map((item) => Object.values(item)));
      } catch(error) {
        console.error("Error al trear personas", error);
        setError(error.message);
      }
    };
    fetchDataUser();
  })

  //Data de allsesions
  useEffect(() => {
    const fetchAndSeparateTutorials = async () => {
      if (!user?.user_id) {
        console.log("Esperando ID de usuario...");
        return;
      }

      try {
        console.log("Fetching tutorías para usuario:", user.user_id);
        const response = await fetch(
          `http://localhost:8081/api/v1/session/`
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log("Tutorías obtenidas:", result);

        const pending = [];
        const accepted = [];
        const completed = [];

        result.forEach((tutorial) => {
          const tutorialData = Object.values(tutorial);
          console.log("Datos de tutoría:", tutorialData);

          // Actualizar la lógica de clasificación según el estado
          const status = tutorialData[1]?.toLowerCase();
          if (status === "pendiente_asignada") {
            pending.push(tutorialData);
          } else if (status === "aceptada") {
            accepted.push(tutorialData);
          } else if (
            [
              "valorada_noregistrada",
              "registrada_novalorada",
              "registrada_valorada",
            ].includes(status)
          ) {
            completed.push(tutorialData);
          }
        });

        setPendingTutorials(pending);
        setAcceptedTutorials(accepted);
        setCompletedTutorials(completed);
      } catch (error) {
        console.error("Error al cargar tutorías:", error);
        setError(error.message);
      }
    };

    fetchAndSeparateTutorials();
  }, [user]);

const cancelSession = async (id) => {
  if (!user?.user_id) return;
  try {
    const response = await fetch(
      `http://localhost:8081/api/v1/session/cancelTuto/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id, tutorId: user.user_id }),
      }
    );
    if (!response.ok) throw new Error("Error al cancelar la tutoría");
    window.location.reload();
  } catch (error) {
    setError(error.message);
  }
};

  const renderActionButtons = (tutorial) => {
    const status = tutorial[1]?.toLowerCase();

    switch (activeTab) {
      case "pending":
        return (
          <div className="flex gap-2 justify-center">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => acceptSession(tutorial[0])}
            >
              Reprogramar
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => cancelSession(tutorial[0])}
            >
              Cancelar
            </button>
          </div>
        );

      case "accepted":
        return (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => cancelSession(tutorial[0])}
          >
            Cancelar
          </button>
        );

      case "completed":
        switch (status) {
          case "valorada_noregistrada":
            return (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => registerSession(tutorial[0])}
              >
                Registrar
              </button>
            );
          case "registrada_novalorada":
            return (
              <span className="text-gray-500">
                Pendiente de valoración por parte del estudiante
              </span>
            );
          case "registrada_valorada":
            return (
              <span className="text-green-500 font-medium">
                ¡Tutoría realizada con éxito!
              </span>
            );
          default:
            return null;
        }

      default:
        return null;
    }
  };

  const renderTable = (tutorials) => {
    if (tutorials.length === 0) {
      return (
        <div className="text-center py-4">No hay tutorías disponibles</div>
      );
    }

    return (
      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border-solid border-slate-400">
        <thead className="bg-gray-50 border border-gray-400">
          <tr className="border border-slate-500">
            {columns.map((item, rowIndex) => (
              <th
                key={rowIndex}
                className="px-6 py-4 whitespace-nowrap border border-slate-300"
              >
                {item?.toString() || ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="border border-slate-500">
          {tutorials.map((item) => (
            <tr key={item[0]}>
              
              <td className="px-6 py-4 whitespace-nowrap">{item[1]}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {person.find((element) => element[0] === item[2])?.[2] ||
                  "Materia no encontrada"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {person.find((element) => element[0] === item[3])?.[2] ||
                  "Materia no encontrada"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {subject.find((element) => element[0] === item[4])?.[2] ||
                  "Materia no encontrada"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{item[5]}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(item[6]), 'dd MMMM yyyy HH:mm', {locale: es})}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item[7]}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderActionButtons(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  };

  if (!user) {
    return <div className="p-8">Cargando usuario...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2">
      <div className="bg-gray-200 mx-auto border border-slate-400">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">{title}</h1>
      </div>

      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 ${activeTab === "pending"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
            }`}
          onClick={() => setActiveTab("pending")}
        >
          Pendientes ({pendingTutorials.length})
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "accepted"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
            }`}
          onClick={() => setActiveTab("accepted")}
        >
          Aceptadas ({acceptedTutorials.length})
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "completed"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
            }`}
          onClick={() => setActiveTab("completed")}
        >
          Realizadas ({completedTutorials.length})
        </button>
      </div>

      <div className="p-8">
        {activeTab === "pending" && renderTable(pendingTutorials)}
        {activeTab === "accepted" && renderTable(acceptedTutorials)}
        {activeTab === "completed" && renderTable(completedTutorials)}
      </div>
    </div>
  );
};

export default TablePool;