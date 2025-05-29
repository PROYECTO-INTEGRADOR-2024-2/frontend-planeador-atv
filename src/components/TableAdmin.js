"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { useRouter } from "next/navigation";
import SessionReschedule from "./SessionReschedule";
import { toast } from "react-toastify";
import { FaRegTrashAlt, FaExchangeAlt, FaRegEdit } from "react-icons/fa";
import DataTable from "react-data-table-component";

const TablePool = () => {
  const [allTutorials, setAllTutorials] = useState([]);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_id) fetchAll();
  }, [user]);

  const customStyles = {
    rows: {
      style: {
        minHeight: '60px',
        fontSize: '14px',
        borderBottom: '1px solid #ddd',
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
      name: "Fecha y hora",
      selector: (row) => row.classDate,
      cell: (row) => (
        <div className="flex items-center justify-between gap-4 w-full">
          <span className="whitespace-nowrap">
            {format(new Date(row.classDate), "dd MMMM yyyy HH:mm", {
              locale: es,
            })}
          </span>
          <FaRegEdit
            size={18}
            className="hover:cursor-pointer text-blue-600 hover:text-blue-800"
            onClick={() => handleModalReschedule(row.classId)}
            title="Reprogramar tutoría"
          />
        </div>
      ),
      sortable: true,
      width: "200px",
    },
    {
      name: "Materia",
      selector: (row) => row.subjectName,
      sortable: true,
      wrap: true,
    },
    {
      name: "Estado",
      selector: (row) => row.registered ? "Registrada" : "No registrada",
      sortable: true,
    },
    {
      name: "Cancelado por",
      selector: (row) => {
        if (row.canceledBy === "NONE") return "-";
        if (row.canceledBy === "STUDENT") return "Estudiante";
        if (row.canceledBy === "TUTOR") return "Tutor";
        if (row.canceledBy === "ADMIN") return "Admin";
        return "-";
      },
      sortable: true,
    },
    {
      name: "Temas",
      selector: (row) => row.classTopics,
      wrap: true,
    },
    {
      name: "Calificación",
      selector: (row) => row.classRate === 0 ? "..." : row.classRate,
      sortable: true,
      center: true,
    },
    {
      name: "Estudiante",
      selector: (row) => `${row.studentFirstName} ${row.studentLastName}`,
      sortable: true,
      wrap: true,
    },
    {
      name: "Tutor",
      selector: (row) => `${row.tutorFirstName} ${row.tutorLastName}`,
      sortable: true,
      wrap: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex justify-center gap-3">
          <FaRegTrashAlt
            size={18}
            className="text-red-600 hover:text-red-800 hover:cursor-pointer"
            onClick={() => handleCancel(row.classId)}
            title="Cancelar tutoría"
          />
          <FaExchangeAlt
            size={18}
            className="text-blue-600 hover:text-blue-800 hover:cursor-pointer"
            onClick={() => handleChangeTutor(row.classId)}
            title="Cambiar tutor"
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
    },
  ];

  if (!user) return <div className="p-8">Cargando usuario...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-lg font-semibold text-gray-700 mb-4">Tutorías</h1>      
      <DataTable
        columns={columns}
        data={allTutorials}
        customStyles={customStyles}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        progressPending={loading}
        progressComponent={<div className="text-center py-4">Cargando tutorías...</div>}
        noDataComponent="No hay tutorías disponibles"
        highlightOnHover
        pointerOnHover
        responsive
        striped
      />

      <SessionReschedule
        open={openReschedule}
        id={id}
        onClose={closeModalReschedule}
      />
    </div>
  );
};

export default TablePool;