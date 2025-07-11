"use client";
import React, { useEffect, useState } from "react";
import DeleteDegreeModal from "./DeleteDegreeModal";
import EditDegreeModal from "./EditDegreeModal";
import AddDegreeModal from "./AddDegreeModal";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

const TableDegrees = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [openEliminar, setOpenEliminar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openAgregar, setOpenAgregar] = useState(false);
  const [id, setId] = useState(null);

  const handleModalEliminar = (id) => {
    setId(id);
    setOpenEliminar(true);
  };

  const closeModalEliminar = () => {
    setOpenEliminar(false);
    setId(null);
  };

  const handleModalEditar = (id) => {
    setId(id);
    setOpenEditar(true);
  };

  const closeModalEditar = () => {
    setOpenEditar(false);
    setId(null);
  };

  const handleModalAgregar = (id) => {
    setId(id);
    setOpenAgregar(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/v1/degree");
        if (!response.ok) {
          throw new Error("Respuesta no válida");
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
    <div className="bg-gray-100 rounded-lg shadow-md py-2">
      <div className="bg-gray-200 mx-auto border border-slate-400 flex flex-row justify-between">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">
          Carreras registradas
        </h1>
        <button
          className="ml-5 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded h-10 mt-4 mr-4"
          onClick={handleModalAgregar}
        >
          Agregar carrera
        </button>
      </div>
      <div className="p-8">
        <table className="min-w-full divide-y divide-gray-200 border-solid border-slate-500">
          <thead className="bg-gray-50 border border-gray-400">
            <tr className="border border-slate-500 select-none">
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider border border-slate-500">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider border border-slate-500">
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
              <tr key={item.degreeId} className="border border-slate-500">
                <td className="px-6 py-4 whitespace-nowrap border border-slate-500">
                  {item.degreeId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-500">
                  {item.degreeName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-500">
                  {item.degreeModality}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-500">
                  {item.degreeDepartment}
                </td>
                <td className="py-4 px-4 border whitespace-nowrap flex items-center justify-center gap-x-2 select-none">
                  <FaRegEdit
                    size={32}
                    className="hover:cursor-pointer"
                    color="blue"
                    onClick={() => {
                      setId(item.degreeId);
                      handleModalEditar(item.degreeId);
                    }}
                    title="Editar Carrera"
                  />
                  <FaRegTrashAlt
                    size={32}
                    color="red"
                    onClick={() => handleModalEliminar(item.degreeId)}
                    className="hover:cursor-pointer"
                    title="Eliminar Carrera"
                  />
                  {/* <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 py-4rounded"
                    onClick={() => {
                      setId(item.degreeId);
                      handleModalEditar(item.degreeId);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="ml-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleModalEliminar(item.degreeId)}
                  >
                    Eliminar
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteDegreeModal
        open={openEliminar}
        id={id}
        onClose={closeModalEliminar}
      />
      <EditDegreeModal open={openEditar} id={id} onClose={closeModalEditar} />
      <AddDegreeModal
        open={openAgregar}
        onClose={() => setOpenAgregar(false)}
      />
    </div>
  );
};

export default TableDegrees;
