"use client";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const TablePool = ({ title, columns }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      setUser(user);
    }
  }, []);

  const acceptSession = async (id) => {
    try {
      const acceptRequest = {
        sessionId: id,
        tutorId: user?.user_id,
      };

      const response = await fetch(
        `http://localhost:8081/api/v1/session/sessionsPoolAccept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(acceptRequest),
        }
      );

      if (!response.ok) {
        throw new Error("Error al aceptar la sesión");
      }

      window.location.reload();
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/v1/session/pool"
        );
        if (!response.ok) {
          throw new Error("Respuesta no válida");
        }
        const result = await response.json();
        setData(result.map((item) => Object.values(item)));
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataSubject = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/v1/subject/");
        if (!response.ok) {
          throw new Error("Respuesta no válida");
        }
        const result = await response.json();
        setSubject(result.map((item) => Object.values(item)));
      } catch (error) {
        setError(error.message);
      }
    };
    fetchDataSubject();
  }, []);

  const allColumns = [...columns, "Acciones"];

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2">
      <div className="bg-gray-200 mx-auto border border-slate-400">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">{title}</h1>
      </div>

      {error && (
        <div className="p-4 text-red-500 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      <div className="p-8">
        <table className="min-w-full divide-y divide-gray-200 border-solid border-slate-400">
          <thead className="bg-gray-50 border border-gray-400">
            <tr className="border border-slate-500">
              {allColumns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-4 whitespace-nowrap border border-slate-300"
                >
                  {column?.toString() || ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border border-slate-500">
            {data.map((item) => (
              <tr key={item[0]} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap border-b">
                  {item[1]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b">
                  {item[2]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b">
                  {subject.find((element) => element[0] === item[4])?.[2] ||
                    "Materia no encontrada"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b">
                  {item[5]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b">
                  {item[6]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b">
                  <div className="flex gap-2 justify-center">
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => acceptSession(item[0])}
                    >
                      Aceptar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No hay tutorías pendientes
          </div>
        )}
      </div>
    </div>
  );
};

export default TablePool;
