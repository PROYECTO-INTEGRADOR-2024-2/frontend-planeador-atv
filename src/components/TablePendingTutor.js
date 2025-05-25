"use client";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaCheck, FaMixer, FaAddressBook, FaStar, FaTimes } from "react-icons/fa";
import DataTable from "react-data-table-component";
import moment from "moment";


export default function TablePendingTutor() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchedOnce = useRef(false);

  const URLS = {
    REGISTER: "http://localhost:8081/api/v1/session/registerClass/",
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

      toast.success("Sesión aceptada correctamente");
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

      toast.success("Sesión rechazada correctamente");
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

      toast.success("Sesión cancelada correctamente");
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
    if (!studentId || studentId === "0") {
      setStudentData({
        mensaje: "Ningún estudiante ha solicitado esta tutoría aún",
      });
      setShowModal(true);
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
      });
      setShowModal(true);
    } catch (err) {
      toast.error(err.message || "Error al cargar perfil del estudiante");
    }
  };

  const handleRegisterSubmit = async (classId) => {
    const token = Cookies.get("token");
    if (!token) return;
  
    try {
      const res = await fetch(`${URLS.REGISTER}${classId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classId }),
      });
  
      if (!res.ok) throw new Error("Error al registrar la sesión");
  
      toast.success("Sesión registrada correctamente");
    } catch (err) {
      toast.error("Error al registrar sesión");
    }
  };
  

  const getEstado = (row) => {
    if (!row.registered && row.canceledBy === "NONE" && !row.accepted) return "Pendiente";
    if (!row.registered && row.canceledBy === "NONE" && row.accepted) return "Aceptada";
    if (row.registered && row.canceledBy === "NONE" && row.accepted && row.classRate == 0.0) return "Registrada por tutor";
    if (row.registered && row.canceledBy === "NONE" && row.accepted && row.classRate !== 0) return "Finalizada";
    if (row.canceledBy !== "NONE") return `Cancelada por ${row.canceledBy}`;
    return "Estado desconocido";
  };

  const customStyles = {
    rows: {
      style: {
        minHeight: '60px',
        fontSize: '14px',
        borderBottom: '1px solid #ddd', // línea divisoria entre filas
      },
    },
    headCells: {
      style: {
        paddingLeft: '12px',
        paddingRight: '12px',
        fontWeight: 'bold',     
        fontSize: '15px',            
        backgroundColor: '#f4f4f4', 
        color: '#333',               
        textTransform: 'uppercase',  
        borderBottom: '2px solid #ccc',
      },
    },
    cells: {
      style: {
        paddingLeft: '12px',
        paddingRight: '12px',
        fontSize: '14px',
        color: '#444',
      },
    },
  };
  
  

  const columns = [
    {
      name: "Fecha",
      selector: (row) =>
        moment(row.classDate).format("YYYY/MM/DD  |  hA"),
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
      name: "Estudiante",
      cell: (row) => `${row.studentName} ${row.studentLastname}`,
    },
    {
      name: "Acciones",
      cell: (row) => {
        const estado = getEstado(row);
        return (
          <div className="flex gap-2">
            {estado === "Pendiente" && (
              <>
                <button onClick={() => handleAccept(row.classId)} title="Aceptar">
                  <FaCheck className="text-green-600" />
                </button>
                <button onClick={() => handleReject(row.classId)} title="Rechazar">
                  <FaTimes className="text-red-600" />
                </button>
              </>
            )}
            {estado === "Aceptada" && (
              <>
                <button onClick={() => handleCancel(row.classId)} title="Cancelar">
                  <FaMixer className="text-yellow-600" />
                </button>
                <button onClick={() => handleRegisterSubmit(row.classId)} title="Registrar">
                  <FaStar className="text-purple-600" />
                </button>
              </>
            )}
            {(estado === "Pendiente" || estado === "Aceptada" || estado.includes("Registrada") || estado.includes("Finalizada") || estado.includes("Cancelada")) && (
              <button onClick={() => handlePerfilStudent(row.studentId)} title="Perfil">
                <FaAddressBook className="text-blue-600" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="px-4 py-4">
      <DataTable columns={columns} data={sessions} progressPending={loading} pagination customStyles={customStyles}/>

      {showModal && studentData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Perfil del Estudiante</h2>
              <button onClick={() => setShowModal(false)} className="text-red-500 text-xl">
                &times;
              </button>
            </div>
            {studentData.mensaje ? (
              <p>{studentData.mensaje}</p>
            ) : (
              <div className="space-y-2">
                <p><strong>Nombre:</strong> {studentData.Nombre} {studentData.Apellido}</p>
                <p><strong>Correo:</strong> {studentData.Correo}</p>
                <p><strong>Teléfono:</strong> {studentData.Teléfono}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
