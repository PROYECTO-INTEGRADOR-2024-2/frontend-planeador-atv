"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Alert = ({ message, type }) => {
  return (
    <div
      className={`fixed bottom-4 left-4 p-4 rounded-lg z-50 ${type === "success"
        ? "bg-green-500 text-white"
        : "bg-red-500 text-white"
        }`}
    >
      {message}
    </div>
  );
};

const UsersTable = ({ title }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("enabled"); // Estado para la pestaña activa: "enabled" o "disabled"
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchUsers = async () => {
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
        status: user.userState
      }));
      setUsers(processed);
      setFilteredUsers(processed);
    } catch (error) {
      setError(error.message);
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
    // Filtrar usuarios según el estado y la pestaña activa
    if (activeTab === "enabled") {
      setFilteredUsers(users.filter((user) => user.status === "1"));
    } else if (activeTab === "disabled") {
      setFilteredUsers(users.filter((user) => user.status === "0"));
    }
  }, [activeTab, users]);

  const handleDisable = async (id) => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Token no encontrado");
        return;
      }

      const response = await fetch(`http://localhost:8081/api/v1/persons/disableUser/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

      const response = await fetch(`http://localhost:8081/api/v1/persons/enableUser/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

  const handleDelete = (id) => {
    console.log(`Eliminar usuario ${id}`);
    setAlert({ message: `Usuario ${id} eliminado`, type: "success" });
    setTimeout(() => setAlert(null), 3000);
  };

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2 relative max-w-7xl mx-auto">
      {alert && <Alert message={alert.message} type={alert.type} />}

      <div className="bg-gray-200 border border-slate-400 px-4">
        <h1 className="text-3xl font-bold py-5 text-gray-600">{title}</h1>
      </div>

      {/* Pestañas */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("enabled")}
          className={`py-2 px-4 font-semibold ${
            activeTab === "enabled" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
          }`}
        >
          Usuarios Habilitados
        </button>
        <button
          onClick={() => setActiveTab("disabled")}
          className={`py-2 px-4 font-semibold ${
            activeTab === "disabled" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
          }`}
        >
          Usuarios Deshabilitados
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="p-4 overflow-x-auto">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-4">No hay usuarios disponibles</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 border border-slate-400">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 border border-slate-300">ID</th>
                <th className="px-6 py-4 border border-slate-300">Nombre</th>
                <th className="px-6 py-4 border border-slate-300">Correo</th>
                <th className="px-6 py-4 border border-slate-300">Rol</th>
                <th className="px-6 py-4 border border-slate-300">Ciudad</th>
                <th className="px-6 py-4 border border-slate-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="px-6 py-4 border border-slate-300">{user.id}</td>
                  <td className="px-6 py-4 border border-slate-300">{user.name}</td>
                  <td className="px-6 py-4 border border-slate-300">{user.email}</td>
                  <td className="px-6 py-4 border border-slate-300">{user.role}</td>
                  <td className="px-6 py-4 border border-slate-300">{user.city}</td>
                  <td className="px-6 py-4 border border-slate-300">
                    {activeTab === "enabled" ? (
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleDisable(user.id)}
                          className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Deshabilitar
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleEnable(user.id)}
                          className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Habilitar
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersTable;
