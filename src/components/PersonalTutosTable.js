"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaAddressBook, FaStar } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import DataTable from "react-data-table-component";
import moment from "moment";

export default function PersonalTutosTable({ title }) {
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tutorData, setTutorData] = useState(null);
  const [rating, setRating] = useState(1);
  const [noTutorMessage, setNoTutorMessage] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

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
      // Actualizar el estado de la sesión en la lista
      setSessions((prev) =>
        prev.map((s) =>
          s.classId === selectedSession.classId
            ? { ...s, classRate: parseFloat(rating) }
            : s
        )
      );
      setSelectedSession(null);
    } catch (err) {
      toast.error(err.message || "Error al enviar valoración");
    }
  };

  // Obtener el estado como texto para mostrarlo en la tabla
  const getEstado = (row) => {
    if (!row.registered && row.canceledBy === "NONE" && !row.accepted)
      return "Pendiente";
    if (!row.registered && row.canceledBy === "NONE" && row.accepted)
      return "Aceptada";
    if (
      row.registered &&
      row.canceledBy === "NONE" &&
      row.accepted &&
      row.classRate == 0.0
    )
      return "Registrada por tutor";
    if (
      row.registered &&
      row.canceledBy === "NONE" &&
      row.accepted &&
      row.classRate !== 0
    )
      return "Finalizada";
    if (row.canceledBy !== "NONE" && row.canceledBy === "STUDENT"){
      return `Cancelada por estudiante`;
    } else if(row.canceledBy !== "NONE" && row.canceledBy === "TUTOR"){
      return `Cancelada por el tutor`;
    } else if(row.canceledBy !== "NONE" && row.canceledBy === "ADMIN"){
      return `Cancelada por el Administrador`;}

    return "Estado desconocido";
  };

  const customStyles = {
    rows: {
      style: {
        minHeight: "60px",
        fontSize: "14px",
        borderBottom: "1px solid #ddd",
      },
    },
    headCells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        fontWeight: "bold",
        fontSize: "15px",
        backgroundColor: "#f4f4f4",
        color: "#333",
        textTransform: "uppercase",
        borderBottom: "2px solid #ccc",
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        fontSize: "14px",
        color: "#444",
      },
    },
  };

  const columns = [
    {
      name: "Fecha",
      selector: (row) => moment(row.classDate).format("YYYY/MM/DD  |  hA"),
    },
    {
      name: "Asignatura",
      selector: (row) => row.subjectName,
    },
    {
      name: "Temas",
      selector: (row) => row.classTopics,
      wrap: true,
    },
    {
      name: "Estado",
      selector: getEstado,
    },
    {
      name: "Tutor",
      cell: (row) => `${row.tutorName} ${row.tutorLastname}`,
    },
    {
      name: "Acciones",
      cell: (row) => {
        const estado = getEstado(row);
        return (
          <div className="flex gap-2">
            {estado === "Pendiente" && (
              <>
                <button
                  onClick={() => handleCancel(row.classId)}
                  title="Cancelar"
                >
                  <MdCancel size={32} className="text-red-600" />
                </button>
                <button
                  onClick={() => handlePerfilTutor(row.tutorId)}
                  title="Perfil Tutor"
                >
                  <FaAddressBook size={32} className="text-blue-600" />
                </button>
              </>
            )}
            {estado === "Registrada por tutor" && (
              <>
                <button
                  onClick={() => handlePerfilTutor(row.tutorId)}
                  title="Perfil Tutor"
                >
                  <FaAddressBook size={32} className="text-blue-600" />
                </button>
                <button onClick={() => setSelectedSession(row)} title="Valorar">
                  <FaStar size={32} className="text-purple-600" />
                </button>
              </>
            )}
            {(estado === "Aceptada" ||
              estado === "Finalizada" ||
              estado.includes("Cancelada")) && (
              <button
                onClick={() => handlePerfilTutor(row.tutorId)}
                title="Perfil Tutor"
              >
                <FaAddressBook size={32} className="text-blue-600" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      {loading ? (
        <div className="text-center py-4">Cargando...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <DataTable
          columns={columns}
          data={sessions}
          customStyles={customStyles}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          noDataComponent="No hay sesiones disponibles"
        />
      )}

      {/* Modal para mostrar perfil del tutor */}
      {tutorData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Perfil del Tutor</h2>
            <div className="space-y-2">
              {Object.entries(tutorData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <strong>{key}:</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
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

      {/* Modal para mostrar mensaje de que no hay tutor asignado aún */}
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

      {/* Modal para valorar tutoría */}
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
                onClick={() => handleRateSubmit()}
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
