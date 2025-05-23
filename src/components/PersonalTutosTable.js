"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMixer, FaAddressBook } from "react-icons/fa";

export default function PersonalTutosTable({ title }) {
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tutorData, setTutorData] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(1);
  const [noTutorMessage, setNoTutorMessage] = useState(false);
  const [sortedSessions, setSortedSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchedOnce = useRef(false);
  const router = useRouter();

  const URLS = {
    SESSIONS: "http://localhost:8081/api/v1/session/personalTutos",
    CANCEL: "http://localhost:8081/api/v1/session/cancelTutoStudent/",
    TUTOR: "http://localhost:8081/api/v1/persons/",
    RATE: "http://localhost:8081/api/v1/session/rateClass",
  };

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
    if (fetchedOnce.current || !user) return;
    fetchedOnce.current = true;

    const fetchSessions = async () => {
      setLoading(true);
      setError(null);

      const token = Cookies.get("token");
      if (!token)
        return toast.error("Token no encontrado, por favor inicia sesión");

      try {
        const res = await fetch(URLS.SESSIONS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener las sesiones");

        const data = await res.json();
        setSessions(data);
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

  // Ordenar sesiones cada vez que cambien
  useEffect(() => {
    if (sessions.length > 0) {
      // Función para obtener prioridad del estado
      const getStatePriority = (session) => {
        if (!session.accepted && session.canceledBy === "NONE") return 1; // Pendientes
        if (
          session.accepted &&
          !session.registered &&
          session.canceledBy === "NONE"
        )
          return 2; // Aceptadas
        if (session.registered) return 3; // Terminadas o Realizadas
        if (session.canceledBy !== "NONE") return 4; // Canceladas
        return 5; // Otros
      };

      // Ordenar por estado y luego por fecha
      const sorted = [...sessions].sort((a, b) => {
        const priorityA = getStatePriority(a);
        const priorityB = getStatePriority(b);

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        // Si tienen la misma prioridad, ordenar por fecha
        return new Date(a.classDate) - new Date(b.classDate);
      });

      setSortedSessions(sorted);
      setCurrentPage(1); // Resetear a la primera página cuando cambian los datos
    }
  }, [sessions]);

  const handleCancel = async (sessionId) => {
    const token = Cookies.get("token");
    if (!token)
      return toast.error("Token no encontrado, por favor inicia sesión");

    try {
      const res = await fetch(`${URLS.CANCEL}${sessionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error al cancelar la sesión");

      toast.success("Sesión cancelada correctamente");
      setSessions((prev) =>
        prev.map((s) =>
          s.classId === sessionId ? { ...s, canceledBy: "STUDENT" } : s
        )
      );
    } catch (err) {
      toast.error(err.message || "Ocurrió un error al cancelar la sesión");
    }
  };

  const handlePerfilTutor = async (tutorId) => {
    // Verifica si el tutorId es "0"
    if (tutorId === "0" || tutorId === 0) {
      setNoTutorMessage(true);
      setTutorData(null);
      return;
    }

    setNoTutorMessage(false);
    const token = Cookies.get("token");
    if (!token) return toast.error("Token no encontrado");

    try {
      const res = await fetch(`${URLS.TUTOR}${tutorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok)
        throw new Error("No se pudo obtener la información del tutor");

      const data = await res.json();
      setTutorData({
        Nombre: data.userFirstname,
        Apellido: data.userLastname,
        Correo: data.userEmail,
        Teléfono: data.userPhone,
        Departamento: data.userDepartment,
        Ciudad: data.userCity,
      });
    } catch (err) {
      toast.error(err.message || "Error al cargar perfil del tutor");
    }
  };

  const handleRateSubmit = async () => {
    if (!selectedSession) return;

    const token = Cookies.get("token");
    if (!token) return toast.error("Token no encontrado");

    try {
      const res = await fetch(URLS.RATE, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: selectedSession.classId,
          rate: parseFloat(rating),
        }),
      });

      if (!res.ok) throw new Error("Error al enviar valoración");

      toast.success("Valoración enviada correctamente");
      setSelectedSession(null);
    } catch (err) {
      toast.error(err.message || "Error al enviar valoración");
    }
  };

  // Obtener el estado como texto para mostrarlo en la tabla
  const getStateText = (session) => {
    if (session.canceledBy !== "NONE") return "Cancelada";
    if (!session.registered && session.accepted) return "Aceptada";
    if (session.registered && session.classRate !== 0) return "Cerrada";
    if (session.registered) return "Realizada";
    return "Pendiente de aceptar";
  };

  // Calcular paginación
  const totalPages = Math.ceil(sortedSessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = sortedSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderStateLabel = (stateText) => {
    let bgColor = "";
    switch (stateText) {
      case "Pendiente de aceptar":
        bgColor = "bg-yellow-200";
        break;
      case "Aceptada":
        bgColor = "bg-blue-200";
        break;
      case "Realizada":
      case "Cerrada":
        bgColor = "bg-green-200";
        break;
      case "Cancelada":
        bgColor = "bg-red-200";
        break;
      default:
        bgColor = "bg-gray-200";
    }
    return (
      <span className={`inline-block px-2 py-1 rounded ${bgColor}`}>
        {stateText}
      </span>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-200"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Anterior
        </button>
        <span className="px-3 py-1">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-200"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Siguiente
        </button>
      </div>
    );
  };

  const renderTable = () => {
    if (loading)
      return <div className="text-center py-4">Cargando sesiones...</div>;
    if (error)
      return <div className="text-center py-4 text-red-600">{error}</div>;
    if (sortedSessions.length === 0)
      return (
        <div className="text-center py-4">No hay sesiones disponibles</div>
      );

    return (
      <>
        <table className="min-w-full divide-y divide-gray-200 border border-slate-400">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 border">Fecha y hora</th>
              <th className="px-6 py-4 border">Materia</th>
              <th className="px-6 py-4 border">Temas</th>
              <th className="px-6 py-4 border">Estado</th>
              <th className="px-6 py-4 border">Tutor</th>
              <th className="px-6 py-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSessions.map((session) => {
              const stateText = getStateText(session);

              return (
                <tr key={session.classId}>
                  <td className="px-6 py-4 border text-center">
                    {new Date(session.classDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 border text-center">
                    {session.subjectName}
                  </td>
                  <td className="px-6 py-4 border text-center">
                    {session.classTopics}
                  </td>
                  <td className="px-6 py-4 border text-center">
                    {renderStateLabel(stateText)}
                  </td>
                  <td className="px-6 py-4 border text-center">
                    {`${session.tutorName} ${session.tutorLastname}`}
                  </td>
                  <td className="px-6 py-4 border text-center">
                    <div className="py-4 px-4 whitespace-nowrap flex items-center justify-center gap-x-2 select-none">
                      {session.canceledBy === "NONE" && !session.registered && (
                        // <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                        //   onClick={() => handleCancel(session.classId)}>Cancelar</button>
                        <FaMixer
                          size={20}
                          color="red"
                          onClick={() => handleCancel(session.classId)}
                          className="hover:cursor-pointer"
                          title="Cancelar tutoría"
                        />
                      )}
                      {session.registered && session.classRate === 0 && (
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                          onClick={() => setSelectedSession(session)}
                        >
                          Valorar tutoría
                        </button>
                      )}
                      {/* <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                        onClick={() => handlePerfilTutor(session.tutorId)}
                      >
                        Ver perfil de tutor
                      </button> */}
                      <FaAddressBook
                        size={20}
                        color="blue"
                        onClick={() => handlePerfilStudent(session.studentId)}
                        className="hover:cursor-pointer"
                        title="Ver perfil del tutor"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {renderPagination()}
      </>
    );
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="bg-gray-200 mx-auto border border-slate-400">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">{title}</h1>
      </div>
      <div className="p-8">{renderTable()}</div>

      {tutorData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Perfil del Tutor</h2>
            <ul className="space-y-2">
              {Object.entries(tutorData).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <button
                onClick={() => setTutorData(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {noTutorMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Perfil del Tutor</h2>
            <div className="text-center py-4">
              <p>Ningún tutor la ha tomado aún</p>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setNoTutorMessage(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSession && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Valorar Tutoría</h2>
            <label htmlFor="rating" className="block mb-2 font-medium">
              Selecciona una calificación:
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            >
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedSession(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleRateSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
