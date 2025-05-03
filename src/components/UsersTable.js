"use client";
import React, { useEffect, useState } from "react";

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
  const [filterId, setFilterId] = useState("");
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
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
        }));
        setUsers(processed);
        setFilteredUsers(processed);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!filterId) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) =>
          user.id.toLowerCase().includes(filterId.toLowerCase())
        )
      );
    }
  }, [filterId, users]);

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  const handleDisable = (id) => {
    console.log(`Deshabilitar usuario ${id}`);
    setAlert({ message: `Usuario ${id} deshabilitado`, type: "success" });
  };

  const handleDelete = (id) => {
    console.log(`Eliminar usuario ${id}`);
    setAlert({ message: `Usuario ${id} eliminado`, type: "success" });
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2 relative max-w-7xl mx-auto">
      {alert && <Alert message={alert.message} type={alert.type} />}

      <div className="bg-gray-200 border border-slate-400 px-4">
        <h1 className="text-3xl font-bold py-5 text-gray-600">{title}</h1>
      </div>

      <div className="p-4">
        <input
          type="text"
          placeholder="Filtrar por ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          className="w-64 p-2 border border-gray-300 rounded"
        />
      </div>

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
                    {["student", "tutor"].includes(user.role.toLowerCase()) ? (
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
                        <div className="text-gray-400">—</div>
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
