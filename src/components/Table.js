"use client";
import React from "react";
import { useEffect, useState } from "react";

const Table = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://66e0cd542fb67ac16f2a9ccb.mockapi.io/api/atv/tutorias"
        );
        if (!response.ok) {
          throw new error("Respuesta no valida");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2 ">
      <div className="bg-gray-200 mx-auto border border-slate-400 ">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">
          Solicitudes pendientes
        </h1>
      </div>
      <div className="p-8">
        <table className="min-w-full divide-y divide-gray-200 border-solid border-slate-400">
          <thead className="bg-gray-50 border border-gray-400">
            <tr className="border border-slate-500">
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider border border-slate-400">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider  border border-slate-400">
                Estudiante
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider  border border-slate-400">
                Materia
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider border border-slate-400">
                Tema(s)
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider  border border-slate-400">
                Estado Solicitud
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider border border-slate-400">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="border border-slate-300">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-300">
                  {item.fecha}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-300">
                  {item.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-300">
                  {item.asignatura}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-300">
                  {item.Tema}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-300">
                  {item.Estado.toString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-300">
                  {item.Acciones}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Table;
