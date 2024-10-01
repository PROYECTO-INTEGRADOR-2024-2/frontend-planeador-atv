"use client";
import React from "react";
import { useEffect, useState } from "react";

const TableDegrees = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const handleOpenEliminar = (id) => {};
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/degree");
        if (!response.ok) {
          throw new error("Respuesta no valida");
        }
        const result = await response.json();
        setData(result);
        console.log(
          "-------------------------------------------------------------"
        );
        console.log(result);
      } catch (error) {
        setError(error.message);
        console.log(
          "-------------------------------------------------------------"
        );
        console.log(error.message);
      }
    };
    fetchData();
  }, [error]);
  console.log("cantidad de datos en la extraccion de la API:" + data.length);

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2 ">
      <div className="bg-gray-200 mx-auto border border-slate-400 ">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">
          Carreras registradas
        </h1>
      </div>
      <div className="p-8">
        <table className="min-w-full divide-y divide-gray-200 border-solid border-slate-500">
          <thead className="bg-gray-50 border border-gray-400">
            <tr className="border border-slate-500">
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider border border-slate-500">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider  border border-slate-500">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider  border border-slate-500">
                Modalidad
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider border border-slate-500">
                Facultad
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider border border-slate-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="border border-slate-500">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.degree_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.degree_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.degree_modality}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.degree_department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button>Editar</button>
                  <button>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TableDegrees;
