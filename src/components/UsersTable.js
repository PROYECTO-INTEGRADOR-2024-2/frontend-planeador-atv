"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaUserLock, FaRegAddressCard, FaOptinMonster, FaAddressBook } from "react-icons/fa6";
import DataTable from "react-data-table-component";
import moment from "moment";

const Alert = ({ message, type }) => {
  return (
    <div
      className={`fixed bottom-4 left-4 p-4 rounded-lg z-50 ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      {message}
    </div>
  );
};

const Modal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl font-bold text-gray-600"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Perfil del Usuario</h2>
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Nombre:</strong> {user.name}
        </p>
        <p>
          <strong>Correo:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong> {user.role}
        </p>
        <p>
          <strong>Ciudad:</strong> {user.city}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          {user.status === "1" ? "Habilitado" : "Deshabilitado"}
        </p>
      </div>
    </div>
  );
};

const UsersTable = ({ title }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("enabled"); // Estado para la pestaña activa: "enabled" o "disabled"
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Estado para el usuario seleccionado
  const [idFilter, setIdFilter] = useState(""); // Filtro de ID
  const [nameFilter, setNameFilter] = useState(""); // Filtro de nombre
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/api/v1/persons");
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }
      const result = await response.json();
      const processed = result.map((user) => ({
        id: user.userId,
        name: `${user.userFirstname} ${user.userLastname}`,
        email: user.userEmail,
        role: user.userRole,
        city: user.userCity,
        status: user.userState,
      }));
      setUsers(processed);
      setFilteredUsers(processed);
    } catch (error) {
      setError(error.message);
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Recargar usuarios cada vez que se monta el componente
  }, []);

  useEffect(() => {
    // Recargar los usuarios al cambiar la pestaña activa
    fetchUsers();
  }, [activeTab]);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchStatus =
        activeTab === "enabled" ? user.status === "1" : user.status === "0";
      const matchId = idFilter ? user.id.toString().includes(idFilter) : true;
      const matchName = nameFilter
        ? user.name.toLowerCase().includes(nameFilter.toLowerCase())
        : true;
      return matchStatus && matchId && matchName;
    });

    setFilteredUsers(filtered);
  }, [idFilter, nameFilter, users, activeTab]);

  const handleDisable = async (id) => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Token no encontrado");
        return;
      }

      const response = await fetch(
        `http://localhost:8081/api/v1/persons/disableUser/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo deshabilitar el usuario");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: 0 } : user
        )
      );

      toast.success(`Usuario ${id} deshabilitado correctamente`);
    } catch (error) {
      console.error("Error en handleDisable:", error);
      toast.error(error.message || "Error al deshabilitar usuario");
    }
  };

  const handleEnable = async (id) => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Token no encontrado");
        return;
      }

      const response = await fetch(
        `http://localhost:8081/api/v1/persons/enableUser/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo habilitar el usuario");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: 1 } : user
        )
      );

      toast.success(`Usuario ${id} habilitado correctamente`);
    } catch (error) {
      console.error("Error en handleEnable:", error);
      toast.error(error.message || "Error al habilitar usuario");
    }
  };

  const handleOpenProfile = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Limpiar filtros al cambiar de pestaña
  useEffect(() => {
    setIdFilter("");
    setNameFilter("");
  }, [activeTab]);

 

  // Estilos personalizados para DataTable
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

  // Definición de columnas para DataTable
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "150px",
    },
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Correo",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Rol",
      selector: (row) => row.role,
      sortable: true,
      width: "150px",
    },
    {
      name: "Ciudad",
      selector: (row) => row.city,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex items-center justify-center gap-x-2 select-none">
          {activeTab === "enabled" ? (
            <>
              <FaUserLock
                size={30}
                className="hover:cursor-pointer hover:scale-110 transition-transform"
                color="orange"
                onClick={() => handleDisable(row.id)}
                title="Deshabilitar Usuario"
              />
              <FaRegAddressCard
                size={30}
                color="blue"
                onClick={() => handleOpenProfile(row)}
                className="hover:cursor-pointer hover:scale-110 transition-transform"
                title="Ver perfil del usuario"
              />
            </>
          ) : (
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleEnable(row.id)}
                className="bg-yellow-200 hover:bg-yellow-300 text-black px-3 py-1 rounded text-sm transition-colors"
              >
                Habilitar
              </button>
              <button
                onClick={() => handleOpenProfile(row)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Ver perfil
              </button>
            </div>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px",
    },
  ];

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2 mx-auto w-full">
      {alert && <Alert message={alert.message} type={alert.type} />}

      {isModalOpen && selectedUser && (
        <Modal user={selectedUser} onClose={handleCloseModal} />
      )}

      <div className="bg-gray-200 border border-slate-400 px-4">
        <h1 className="text-3xl font-bold py-5 text-gray-600">{title}</h1>
      </div>

      {/* Pestañas */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("enabled")}
          className={`py-2 px-4 font-semibold transition-colors ${
            activeTab === "enabled"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600 hover:text-blue-400"
          }`}
        >
          Usuarios Habilitados
        </button>
        <button
          onClick={() => setActiveTab("disabled")}
          className={`py-2 px-4 font-semibold transition-colors ${
            activeTab === "disabled"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600 hover:text-blue-400"
          }`}
        >
          Usuarios Deshabilitados
        </button>
      </div>

      {/* Filtros */}
      <div className="flex space-x-4 p-4">
        <input
          type="text"
          placeholder="Filtrar por ID"
          value={idFilter}
          onChange={(e) => setIdFilter(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          disabled={nameFilter.length > 0}
        />
        <input
          type="text"
          placeholder="Filtrar por Nombre"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          disabled={idFilter.length > 0}
        />
      </div>

      {/* DataTable */}
      <div className="p-4">
        <DataTable
          columns={columns}
          data={filteredUsers}
          progressPending={loading}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          customStyles={customStyles}
          noDataComponent={
            <div className="text-center py-8 text-gray-500">
              No hay usuarios disponibles
            </div>
          }
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
};

export default UsersTable;
