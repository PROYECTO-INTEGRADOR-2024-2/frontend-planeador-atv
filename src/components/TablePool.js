"use client";
import React, { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaRegAddressCard, FaCheck } from "react-icons/fa";

const TablePool = ({ title, columns }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const fetchedOnce = useRef(false);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const URL_STUDENT = "http://localhost:8081/api/v1/persons/";

  const URLS = {
    POOL: "http://localhost:8081/api/v1/session/pool",
    STUDENT: "http://localhost:8081/api/v1/persons/",
    ACCEPT: "http://localhost:8081/api/v1/session/accept/",
    REJECT: "http://localhost:8081/api/v1/session/rejectClass/",
  };

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
  }, []);

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchData = async () => {
      const token = Cookies.get("token");
      if (!token) return toast.error("Token no encontrado en cookies");

      try {
        const response = await fetch(URLS.POOL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener las sesiones");

        const data = await response.json();
        setData(data);
        toast.success("Sesiones cargadas correctamente");
      } catch (error) {
        toast.error(error.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (sessionId) => {
    const token = Cookies.get("token");
    if (!token) return toast.error("Token no encontrado");
    console.log(`Se hará la petición a ${URLS.ACCEPT}${sessionId}`);
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
    } catch (err) {
      toast.error(err.message || "Error al aceptar la sesión");
    }
  };

  const handlePerfilStudent = async (studentId) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Token no encontrado");
      return;
    }

    try {
      const res = await fetch(`${URLS.STUDENT}${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("No se pudo obtener la información del estudiante");
      }

      const data = await res.json();

      const filteredStudent = {
        Nombre: data.userFirstname,
        Apellido: data.userLastname,
        Correo: data.userEmail,
        Teléfono: data.userPhone,
        Departamento: data.userDepartment,
        Ciudad: data.userCity,
      };

      setStudentData(filteredStudent);
      setShowModal(true);
    } catch (err) {
      toast.error(err.message || "Error al cargar perfil del estudiante");
    }
  };
  const allColumns = [...columns, "Acciones"];

  const closeModal = () => {
    setShowModal(false);
    setStudentData(null);
  };

  const renderTable = () => {
    if (loading) {
      return <div className="text-center py-4">Cargando sesiones...</div>;
    }

    if (error) {
      return <div className="text-center py-4 text-red-600">{error}</div>;
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-4">No hay sesiones disponibles</div>
      );
    }

    return (
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
          {data.map((session) => (
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
                {session.canceledBy !== "NONE"
                  ? "Cancelada"
                  : session.registered && session.classRate != 0
                  ? "Cerrada"
                  : session.registered
                  ? "Realizada"
                  : "Pendiente"}
              </td>
              <td className="px-6 py-4 border text-center">
                {`${session.studentName} ${session.studentLastname}`}
              </td>
              <td className="px-6 py-4 border text-center space-y-2">
                <div className="py-4 px-4 border whitespace-nowrap flex items-center justify-center gap-x-2 select-none">
                  {/* <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                    onClick={() => handleAccept(session.classId)}
                  >
                    Aceptar tutoría
                  </button> */}
                  <FaCheck
                    size={30}
                    className="hover:cursor-pointer"
                    color="green"
                    onClick={() => handleAccept(session.classId)}
                    title="Aceptar tutoría"
                  />
                  <FaRegAddressCard
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
                    Ver perfil de estudiante
                  </button> */}
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
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">{title}</h1>
      </div>
      <div className="p-8">{renderTable()}</div>

      {showModal && studentData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Perfil del Estudiante</h2>
            <ul className="space-y-2">
              {Object.entries(studentData).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablePool;
