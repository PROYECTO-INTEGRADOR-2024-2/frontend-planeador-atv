"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { useRouter } from "next/navigation";
import SessionReschedule from "./SessionReschedule";
import { toast } from "react-toastify";
import { FaRegTrashAlt, FaExchangeAlt, FaRegEdit } from "react-icons/fa";

const TablePool = () => {
  const [allTutorials, setAllTutorials] = useState([]);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleCancel = (classId) => {
    const token = Cookies.get("token");
    const cancelTutoAdmin = async () => {
      try {
        const res = await fetch(
          `http://localhost:8081/api/v1/session/cancelTutoAdmin/${classId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          toast.error("Error al cancelar la tutoría");
        }

        toast.warning("Tutoría cancelada exitosamente");
        window.location.reload();
      } catch (err) {
        toast.error("Error al cancelar la tutoría");
      }
    };
    if (user?.user_id) cancelTutoAdmin();
  };

  const handleChangeTutor = (classId) => {
    toast.warning("Método no implementado aún");
  };

  const handleModalReschedule = (id) => {
    setId(id);
    setOpenReschedule(true);
  };

  const closeModalReschedule = () => {
    setOpenReschedule(false);
    setId(null);
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");

    if (token && userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (err) {
        console.error("Error parsing user cookie:", err);
        router.push("/landing");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const token = Cookies.get("token");
    const fetchAll = async () => {
      try {
        const res = await fetch(
          "http://localhost:8081/api/v1/session/tutosNew",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Error al cargar datos");
        }

        const sessions = await res.json();

        setAllTutorials(
          sessions.sort((a, b) => new Date(a.classDate) - new Date(b.classDate))
        );
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (user?.user_id) fetchAll();
  }, [user]);

  if (!user) return <div className="p-8">Cargando usuario...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-lg font-semibold text-gray-700 mb-4">Tutorías</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-left text-gray-700 border border-gray-300">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-2 py-2 border">Fecha y hora</th>
              <th className="px-2 py-2 border">Materia</th>
              <th className="px-2 py-2 border">Estado</th>
              <th className="px-2 py-2 border">Cancelado por</th>
              <th className="px-2 py-2 border">Temas</th>
              <th className="px-2 py-2 border">Calificación</th>
              <th className="px-2 py-2 border">Estudiante</th>
              <th className="px-2 py-2 border">Tutor</th>
              <th className="px-2 py-2 border">Acciones</th>{" "}
              {/* Nueva columna */}
            </tr>
          </thead>
          <tbody>
            {allTutorials.map((tut) => (
              <tr key={tut.classId} className="border-t">
                <td className="py-4 px-4 border whitespace-nowrap flex items-center justify-between gap-x-8">
                  {format(new Date(tut.classDate), "dd MMMM yyyy HH:mm", {
                    locale: es,
                  })}
                  <FaRegEdit
                    size={20}
                    className="hover:cursor-pointer"
                    color="blue"
                    onClick={() => handleModalReschedule(tut.classId)}
                    title="Reprogramar tutoría"
                  />
                  <SessionReschedule
                    open={openReschedule}
                    id={id}
                    onClose={closeModalReschedule}
                  />
                </td>
                <td className="px-2 py-1 border">{tut.subjectName}</td>
                <td className="px-2 py-1 border">
                  {tut.registered ? "Registrada" : "No registrada"}
                </td>
                <td className="px-2 py-1 border">
                  {tut.canceledBy === "NONE"
                    ? "-"
                    : tut.canceledBy === "STUDENT"
                    ? "Cancelada por estudiante"
                    : tut.canceledBy === "TUTOR"
                    ? "Cancelada por tutor"
                    : tut.canceledBy === "ADMIN"
                    ? "Cancelada por admin"
                    : "-"}
                </td>
                <td className="px-2 py-1 border">{tut.classTopics}</td>
                <td className="px-2 py-1 border">
                  {tut.classRate === 0 ? "..." : tut.classRate}
                </td>
                <td className="px-2 py-1 border">
                  {tut.studentFirstName + " " + tut.studentLastName}
                </td>
                <td className="px-2 py-1 border">
                  {tut.tutorFirstName + " " + tut.tutorLastName}
                </td>
                <td className="px-2 py-1 p-10 flex justify-center gap-x-4">
                  <FaRegTrashAlt
                    size={20}
                    color="red"
                    onClick={() => handleCancel(tut.classId)}
                    className="hover:cursor-pointer"
                    title="Cancelar tutoría"
                  />
                  <FaExchangeAlt
                    size={20}
                    color="blue"
                    className="hover:cursor-pointer"
                    title="Cambiar tutor"
                    onClick={() => handleChangeTutor(tut.classId)}
                  />
                  {/* <button
                    onClick={() => handleCancel(tut.classId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Cancelar
                  </button> */}
                  {/* <button
                    onClick={() => handleChangeTutor(tut.classId)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Cambiar tutor
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePool;
