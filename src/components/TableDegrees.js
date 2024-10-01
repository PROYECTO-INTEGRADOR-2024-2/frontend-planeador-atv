"use client";
import React, { useEffect, useState } from "react";

const TableDegrees = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [openEliminar, setOpenEliminar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [id, setId] = useState(null);

  const handleOpenEliminar = (id) => {
    console.log("Eliminar: " + id);
  };

  const handleOpenEditar = (id) => {
    console.log("Editar: " + id);
  };

  useEffect(() => {
    if (openEliminar && id) {
      console.log("openEliminar: " + openEliminar);
      handleOpenEliminar(id);
    }
  }, [openEliminar, id]);

  useEffect(() => {
    if (openEditar && id) {
      console.log("openEditar: " + openEditar);
      handleOpenEditar(id);
    }
  }, [openEditar, id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/degree");
        if (!response.ok) {
          throw new Error("Respuesta no válida");
        }
        const result = await response.json();
        setData(result);
        console.log("Datos obtenidos: ", result);
      } catch (error) {
        setError(error.message);
        console.log("Error al obtener datos: ", error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2">
      <div className="bg-gray-200 mx-auto border border-slate-400">
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
            {data.map((item) => (
              <tr key={item.degree_id}>
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
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setId(item.degree_id);
                      setOpenEditar(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="ml-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setId(item.degree_id);
                      setOpenEliminar(true);
                    }}
                  >
                    Eliminar
                  </button>
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
