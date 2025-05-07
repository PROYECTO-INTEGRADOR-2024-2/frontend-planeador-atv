"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:8081/api/v1/session/personalTutos";

const TABS = {
  PENDING: "PENDIENTE_ASIGNADA",
  ACCEPTED: "ASISTIDA",
  REJECTED: "CANCELADA",
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0];
};

const PersonalTutosTable = ({ title }) => {
  const [sessions, setSessions] = useState([]);
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
        setSessions(data);
        toast.success("Sesiones cargadas correctamente");
      } catch (err) {
        toast.error(err.message || "Ocurrió un error al cargar las sesiones");
      }
    };

    fetchSessions();
  }, [user]);

  const filteredSessions = sessions.filter((s) => {
    const state = s.classState.toUpperCase();
    if (activeTab === "pending") return state === TABS.PENDING;
    if (activeTab === "accepted") return state === TABS.ACCEPTED;
    return state === TABS.REJECTED;
  });

  const renderTable = () => {
    if (filteredSessions.length === 0) {
      return <div className="text-center py-4">No hay sesiones disponibles</div>;
    }

    return (
      <table className="min-w-full divide-y divide-gray-200 border border-slate-400">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 border border-slate-300">Fecha</th>
            <th className="px-6 py-4 border border-slate-300">Materia</th>
            <th className="px-6 py-4 border border-slate-300">Estado</th>
            <th className="px-6 py-4 border border-slate-300">Tutor</th>
          </tr>
        </thead>
        <tbody>
          {filteredSessions.map((session, idx) => (
            <tr key={idx}>
              <td className="px-6 py-4 border border-slate-300 text-center">
                {formatDate(session.classDate)}
              </td>
              <td className="px-6 py-4 border border-slate-300 text-center">
                {session.subjectName}
              </td>
              <td className="px-6 py-4 border border-slate-300 text-center">
                {session.classState.toUpperCase()}
              </td>
              <td className="px-6 py-4 border border-slate-300 text-center">
                {`${session.tutorName} ${session.tutorLastname}`}
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

      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 ${
            activeTab === "pending"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pendientes
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "accepted"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("accepted")}
        >
          Asistidas
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "rejected"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("rejected")}
        >
          Canceladas
        </button>
      </div>

      <div className="p-8">{renderTable()}</div>
    </div>
  );
};

export default PersonalTutosTable;
