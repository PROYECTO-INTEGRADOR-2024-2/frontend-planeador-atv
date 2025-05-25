"use client";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaCheck, FaAddressBook, FaStar } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export default function TablePendingTutor() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedSessions, setSortedSessions] = useState([]);
  const ITEMS_PER_PAGE = 10;

  const fetchedOnce = useRef(false);

  const URLS = {
    REGISTER: "http://localhost:8080/api/v1/session/registerClass/",
    STUDENT: "http://localhost:8081/api/v1/persons/",
    CANCEL: "http://localhost:8081/api/v1/session/cancelTutoTutor/",
    SESSIONS: "http://localhost:8081/api/v1/session/sessionstutor",
    ACCEPT: "http://localhost:8081/api/v1/session/accept/",
    REJECT: "http://localhost:8081/api/v1/session/rejectClass/",
  };

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchSessions = async () => {
      const token = Cookies.get("token");
      if (!token) return toast.error("Token no encontrado en cookies");

      try {
        const response = await fetch(URLS.SESSIONS, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener las sesiones");

        const data = await response.json();
        setSessions(data);
        toast.success("Sesiones cargadas correctamente");
      } catch (error) {
        toast.error(error.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

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
        if (session.registered) return 3; // Terminadas
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

  const handleAccept = async (sessionId) => {
    const token = Cookies.get("token");
    if (!token) return toast.error("Token no encontrado");

    try {
      const res = await fetch(`${URLS.ACCEPT}${sessionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error al aceptar la sesión");

      toast.warning("Sesión aceptada correctamente");
      setSessions((prev) =>
        prev.map((s) =>
          s.classId === sessionId ? { ...s, accepted: true } : s
        )
      );
    } catch (err) {
      toast.error(err.message || "Error al aceptar la sesión");
    }
  };

  const handleReject = async (sessionId) => {
    const token = Cookies.get("token");
    if (!token) return toast.error("Token no encontrado");

    try {
      const res = await fetch(`${URLS.REJECT}${sessionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error al rechazar la sesión");

      toast.warning("Sesión rechazada correctamente");
    } catch (err) {
      toast.error(err.message || "Error al rechazar la sesión");
    }
  };

  const handleCancel = async (sessionId) => {
    const token = Cookies.get("token");
    if (!token) return toast.error("Token no encontrado");

    try {
      const res = await fetch(`${URLS.CANCEL}${sessionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error al cancelar la sesión");

      toast.warning("Sesión cancelada correctamente");
      setSessions((prev) =>
        prev.map((s) =>
          s.classId === sessionId ? { ...s, canceledBy: "TUTOR" } : s
        )
      );
    } catch (err) {
      toast.error(err.message || "Error al cancelar la sesión");
    }
  };

  const handlePerfilStudent = async (studentId) => {
    // Verificar si el studentId es "0"
    if (studentId === "0" || studentId === 0) {
      setStudentData({
        mensaje: "Ningún estudiante ha solicitado esta tutoría aún",
      });
      return;
    }

    const token = Cookies.get("token");
    if (!token) return toast.error("Token no encontrado");

    try {
      const res = await fetch(`${URLS.STUDENT}${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok)
        throw new Error("No se pudo obtener el perfil del estudiante");

      const data = await res.json();
      setStudentData({
        Nombre: data.userFirstname,
        Apellido: data.userLastname,
        Correo: data.userEmail,
        Teléfono: data.userPhone,
        Departamento: data.userDepartment,
        Ciudad: data.userCity,
      });
    } catch (err) {
      toast.error(err.message || "Error al cargar perfil del estudiante");
    }
  };

  const handleRegisterSubmit = async () => {
    const token = Cookies.get("token");
    if (!selectedSession || !token) return;

    try {
      const res = await fetch(URLS.REGISTER, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: selectedSession.classId,
          rate: parseInt(rating),
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
              <th className="px-6 py-4 border">Estudiante</th>
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
                    {`${session.studentName} ${session.studentLastname}`}
                  </td>
                  <td className="px-6 py-4 border text-center">
                    <div className="py-4 px-4 whitespace-nowrap flex items-center justify-center gap-x-2 select-none">
                      {session.canceledBy === "NONE" &&
                        !session.registered &&
                        session.accepted && (
                          <MdCancel
                            size={30}
                            color="red"
                            onClick={() => handleCancel(session.classId)}
                            className="hover:cursor-pointer"
                            title="Rechazar tutoría"
                          />
                          // <button
                          //   className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                          //   onClick={() => handleCancel(session.classId)}
                          // >
                          //   Cancelar
                          // </button>
                        )}
                      {session.registered && session.classRate === 0 && (
                        // <button
                        //   className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                        //   onClick={() => setSelectedSession(session)}
                        // >
                        //   Valorar tutoría
                        // </button>
                        <FaStar
                          size={30}
                          className="hover:cursor-pointer"
                          color="orange"
                          onClick={() => setSelectedSession(session)}
                          title="Valorar tutoría"
                        />
                      )}
                      {!session.registered &&
                        !session.accepted &&
                        session.canceledBy === "NONE" && (
                          <FaCheck
                            size={30}
                            className="hover:cursor-pointer"
                            color="green"
                            onClick={() => handleAccept(session.classId)}
                            title="Aceptar tutoría"
                          />
                          // <button
                          //   className="bg-yellow-700 hover:bg-yellow-600 text-white px-4 py-1 rounded"
                          //   onClick={() => handleAccept(session.classId)}
                          // >
                          //   Aceptar
                          // </button>
                        )}
                      {!session.registered &&
                        !session.accepted &&
                        session.canceledBy === "NONE" && (
                          <MdCancel
                            size={30}
                            color="red"
                            onClick={() => handleReject(session.classId)}
                            className="hover:cursor-pointer"
                            title="Rechazar tutoría"
                          />
                          // <button
                          //   className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                          //   onClick={() => handleReject(session.classId)}
                          // >
                          //   Rechazar
                          // </button>
                        )}
                      <FaAddressBook
                        size={30}
                        color="blue"
                        onClick={() => handlePerfilStudent(session.studentId)}
                        className="hover:cursor-pointer"
                        title="Ver perfil del estudiante"
                      />
                      {/* <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                        onClick={() => handlePerfilStudent(session.studentId)}
                      >
                        Ver perfil del estudiante
                      </button> */}
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
      <div className="bg-gray-200 mx-auto border border-slate-400">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">
          Tutorías asignadas
        </h1>
      </div>
      <div className="p-8">{renderTable()}</div>

      {studentData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Perfil del Estudiante</h2>
            {studentData.mensaje ? (
              <div className="text-center py-4">
                <p>{studentData.mensaje}</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {Object.entries(studentData).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() => setStudentData(null)}
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
                onClick={handleRegisterSubmit}
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
