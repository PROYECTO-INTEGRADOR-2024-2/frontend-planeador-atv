"use client";
import React, { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaRegAddressCard, FaCheck,FaTimes, FaAddressBook} from "react-icons/fa";
import DataTable from "react-data-table-component";
import moment from "moment";

const TablePool = () => {
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

  const closeModal = () => {
    setShowModal(false);
    setStudentData(null);
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
            <div className="flex gap-3 text-2xl ">
              {estado === "Pendiente" && (
                <>
                  <button onClick={() => handleAccept(row.classId)} title="Aceptar">
                    <FaCheck className="text-green-600 " />
                  </button>
                  
                </>
              )}
              {estado === "Aceptada" && (
                <>
                  <button onClick={() => handleCancel(row.classId)} title="Cancelar">
                    <FaMixer className="text-yellow-600 " />
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
        <DataTable columns={columns} data={data} progressPending={loading} pagination customStyles={customStyles}/>
  
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
};

export default TablePool;
