"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const TablePendingTutor = ({ title, columns }) => {
  const [tutorials, setTutorials] = useState({
    pending: [],
    accepted: [],
    rejected: [],
    canceled: [],
    completed: [],
  });
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");

    if (token && userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        router.push("/landing");
      }
    } else {
      router.push("/landing");
    }
  }, [router]);

  useEffect(() => {
    const fetchAndSeparateTutorials = async () => {
      if (!user?.user_id) {
        console.log("Esperando ID de usuario...");
        return;
      }

      try {
        const token = Cookies.get("token");

        const response = await fetch(
          `http://localhost:8081/api/v1/session/sessionstutor/tutosTutor`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log("Tutorías obtenidas:", result);

        const categorizedTutorials = {
          pending: [],
          accepted: [],
          rejected: [],
          canceled: [],
          completed: [],
        };

        result.forEach((tutorial) => {
          const tutorialData = Object.values(tutorial);
          const status = tutorialData[3]?.toLowerCase();

          if (status === "pendiente_asignada") {
            categorizedTutorials.pending.push(tutorialData);
          } else if (status === "aceptada") {
            categorizedTutorials.accepted.push(tutorialData);
          } else if (status === "rechazada") {
            categorizedTutorials.rejected.push(tutorialData);
          } else if (status === "cancelada") {
            categorizedTutorials.canceled.push(tutorialData);
          } else if (["valorada_noregistrada", "registrada_novalorada", "registrada_valorada"].includes(status)) {
            categorizedTutorials.completed.push(tutorialData);
          }
        });

        setTutorials(categorizedTutorials);
      } catch (error) {
        console.error("Error al cargar tutorías:", error);
        setError(error.message);
      }
    };

    fetchAndSeparateTutorials();
  }, [user]);

  useEffect(() => {
    const fetchDataSubject = async () => {
      try {
        const token = Cookies.get("token");

        const response = await fetch("http://localhost:8081/api/v1/subject/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

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

  const handleSessionAction = async (id, action) => {
    if (!user?.userId) return;
    try {
      const token = Cookies.get("token");

      const response = await fetch(
        `http://localhost:8081/api/v1/session/${action}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId: id, tutorId: user.userId }),
        }
      );
      if (!response.ok) throw new Error(`Error al ${action} la sesión`);
      window.location.reload();
    } catch (error) {
      setError(error.message);
    }
  };

  const renderActionButtons = (tutorial) => {
    const status = tutorial[3]?.toLowerCase();

    switch (activeTab) {
      case "pending":
        return (
          <div className="flex gap-2 justify-center">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleSessionAction(tutorial[0], "sessionsPoolAccept")}
            >
              Aceptar
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleSessionAction(tutorial[0], "rejectSession")}
            >
              Rechazar
            </button>
          </div>
        );

      case "accepted":
        return (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleSessionAction(tutorial[0], "cancelSession")}
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
                onClick={() => handleSessionAction(tutorial[0], "registerSession")}
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
              <td className="px-6 py-4 whitespace-nowrap">{item[2]}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {subject.find((element) => element[0] === item[4])?.[2] ||
                  "Materia no encontrada"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{item[5]}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item[6]}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderActionButtons(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
          Pendientes ({tutorials.pending.length})
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "accepted"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
            }`}
          onClick={() => setActiveTab("accepted")}
        >
          Aceptadas ({tutorials.accepted.length})
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "rejected"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
            }`}
          onClick={() => setActiveTab("rejected")}
        >
          Rechazadas ({tutorials.rejected.length})
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "canceled"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
            }`}
          onClick={() => setActiveTab("canceled")}
        >
          Canceladas ({tutorials.canceled.length})
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "completed"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
            }`}
          onClick={() => setActiveTab("completed")}
        >
          Completadas ({tutorials.completed.length})
        </button>
      </div>

      <div className="overflow-x-auto">{renderTable(tutorials[activeTab])}</div>
    </div>
  );
};

export default TablePendingTutor;
