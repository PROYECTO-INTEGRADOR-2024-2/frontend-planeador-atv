'use client';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function TablePendingTutor() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(1);

  const fetchedOnce = useRef(false);

  const URLS = {
    REGISTER: "http://localhost:8080/api/v1/session/registerClass/",
    STUDENT: "http://localhost:8081/api/v1/persons/",
    CANCEL: "http://localhost:8081/api/v1/session/cancelTutoTutor/",
    SESSIONS: "http://localhost:8081/api/v1/session/sessionstutor",
  };

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchSessions = async () => {
      const token = Cookies.get('token');
      if (!token) return toast.error('Token no encontrado en cookies');

      try {
        const response = await fetch(URLS.SESSIONS, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al obtener las sesiones');

        const data = await response.json();
        setSessions(data);
        toast.success('Sesiones cargadas correctamente');
      } catch (error) {
        toast.error(error.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

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
        prev.map((s) => (s.classId === sessionId ? { ...s, canceledBy: "TUTOR" } : s))
      );
    } catch (err) {
      toast.error(err.message || "Error al cancelar la sesión");
    }
  };

  const handlePerfilStudent = async (studentId) => {
    const token = Cookies.get("token");
    if (!token) return toast.error("Token no encontrado");

    try {
      const res = await fetch(`${URLS.STUDENT}${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("No se pudo obtener el perfil del estudiante");

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

  const renderTable = () => {
    if (loading) return <div className="text-center py-4">Cargando sesiones...</div>;
    if (sessions.length === 0) return <div className="text-center py-4">No hay sesiones disponibles</div>;

    return (
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
          {sessions.map((session) => (
            <tr key={session.classId}>
              <td className="px-6 py-4 border text-center">{new Date(session.classDate).toLocaleString()}</td>
              <td className="px-6 py-4 border text-center">{session.subjectName}</td>
              <td className="px-6 py-4 border text-center">{session.classTopics}</td>
              <td className="px-6 py-4 border text-center">
                {session.canceledBy !== "NONE"
                  ? "Cancelada"
                  : session.registered && session.classRate !== 0
                  ? "Cerrada"
                  : session.registered
                  ? "Realizada"
                  : "Pendiente"}
              </td>
              <td className="px-6 py-4 border text-center">
                {`${session.studentName} ${session.studentLastname}`}
              </td>
              <td className="px-6 py-4 border text-center">
                <div className="flex flex-col items-center space-y-2">
                  {session.canceledBy === "NONE" && !session.registered && (
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                      onClick={() => handleCancel(session.classId)}>Cancelar</button>
                  )}
                  {session.registered && session.classRate === 0 && (
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                      onClick={() => setSelectedSession(session)}>Valorar tutoría</button>
                  )}
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                    onClick={() => handlePerfilStudent(session.studentId)}>Ver perfil del estudiante</button>
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
      <div className="bg-gray-200 mx-auto border border-slate-400">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">Tutorías asignadas</h1>
      </div>
      <div className="p-8">{renderTable()}</div>

      {studentData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Perfil del Estudiante</h2>
            <ul className="space-y-2">
              {Object.entries(studentData).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <button onClick={() => setStudentData(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cerrar</button>
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
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setSelectedSession(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancelar</button>
              <button onClick={handleRegisterSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
