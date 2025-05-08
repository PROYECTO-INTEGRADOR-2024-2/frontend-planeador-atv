'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function TablePendingTutor() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const token = Cookies.get('token');

      if (!token) {
        toast.error('Token no encontrado en cookies');
        return;
      }

      try {
        const response = await fetch('http://localhost:8081/api/v1/session/sessionstutor/tutosTutor', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las sesiones');
        }

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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-CO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
    });
  };
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sesiones del tutor</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Materia</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Estudiante</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.classId} className="text-center">
                <td className="p-2 border">{formatDate(s.classDate)}</td>
                <td className="p-2 border">{s.subjectName}</td>
                <td className="p-2 border">{s.classState}</td>
                <td className="p-2 border">{s.studentName} {s.studentLastname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
