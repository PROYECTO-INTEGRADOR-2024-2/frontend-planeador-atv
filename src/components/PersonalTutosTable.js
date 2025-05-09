"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:8081/api/v1/session/personalTutos";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PersonalTutosTable = ({ title }) => {
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");

    if (token && userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user cookie:", err);
        router.push("/landing");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("token");
      if (!user || !token) return;

      try {
        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al obtener las sesiones");
        }

        const data = await res.json();
        const sortedData = data.sort((a, b) => new Date(a.classDate) - new Date(b.classDate));
        setSessions(sortedData);
        toast.success("Sesiones cargadas correctamente");
      } catch (err) {
        setError(err.message || "Ocurrió un error al cargar las sesiones");
        toast.error(err.message || "Ocurrió un error al cargar las sesiones");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const renderTable = () => {
    if (loading) {
      return <div className="text-center py-4">Cargando sesiones...</div>;
    }

    if (error) {
      return <div className="text-center py-4 text-red-600">{error}</div>;
    }

    if (sessions.length === 0) {
      return <div className="text-center py-4">No hay sesiones disponibles</div>;
    }

    return (
      <table className="min-w-full divide-y divide-gray-200 border border-slate-400">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-4 border border-slate-300">Fecha y hora</th>
          <th className="px-6 py-4 border border-slate-300">Materia</th>
          <th className="px-6 py-4 border border-slate-300">Temas</th>
          <th className="px-6 py-4 border border-slate-300">Estado</th>
          <th className="px-6 py-4 border border-slate-300">Tutor</th>
          <th className="px-6 py-4 border border-slate-300">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {sessions
          .sort((a, b) => a.classDate - b.classDate)
          .map((session) => (
            <tr key={session.classDate}>
              <td className="px-6 py-4 border border-slate-300 text-center">
                {new Date(session.classDate).toLocaleString()}
              </td>
              <td className="px-6 py-4 border border-slate-300 text-center">
                {session.subjectName}
              </td>
              <td className="px-6 py-4 border border-slate-300 text-center">
                {session.classTopics}
              </td>
              <td className="px-6 py-4 border border-slate-300 text-center">
                {session.canceledBy !== "NONE"
                  ? "Cancelada"
                  : session.registered
                  ? "Realizada"
                  : "Pendiente"
                }
              </td>
              <td className="px-6 py-4 border border-slate-300 text-center">
                {`${session.tutorName} ${session.tutorLastname}`}
              </td>
              <td className="px-6 py-4 border border-slate-300 text-center space-y-2">
                <div className="flex flex-col items-center space-y-2">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                    onClick={() => handleCancel(session)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                    onClick={() => handlePerfilTutor(session)}
                  >
                    Ver perfil de tutor
                  </button>
                </div>
              </td>

              
            </tr>
          ))}
      </tbody>
    </table>
    );
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="bg-gray-200 mx-auto border border-slate-400">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">{title}</h1>
      </div>

      <div className="p-8">{renderTable()}</div>
    </div>
  );
};

export default PersonalTutosTable;
