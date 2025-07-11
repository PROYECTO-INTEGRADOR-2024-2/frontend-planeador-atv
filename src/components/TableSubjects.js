"use client";
import React, { useEffect, useState } from "react";
import DeleteSubjectModal from "./DeleteSubjectModal";
import EditSubjectModal from "./EditSubjectModal";
import AddSubjectModal from "./AddSubjectModal";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

const TableSubjects = () => {
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
        const [subjectsResponse, degreesResponse] = await Promise.all([
          fetch("http://localhost:8081/api/v1/subject/"),
          fetch("http://localhost:8081/api/v1/degree"),
        ]);

        if (!subjectsResponse.ok || !degreesResponse.ok) {
          throw new Error("Error en una de las respuestas");
        }

        const subjects = await subjectsResponse.json();
        const degrees = await degreesResponse.json();

        const subjectsWithNames = subjects.map((subject) => {
          const degree = degrees.find((d) => d.degreeId === subject.degreeId);
          return {
            ...subject,
            degreeName: degree ? degree.degreeName : "Carrera desconocida",
          };
        });

        setData(subjectsWithNames);
      } catch (error) {
        setError(error.message);
        console.log("Error al obtener datos: ", error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2">
      <div className="bg-gray-200 mx-auto border border-slate-400 flex flex-row justify-between">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">
          Gestión de asignaturas
        </h1>
        <button
          className="ml-5 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded h-10 mt-4 mr-4"
          onClick={handleModalAgregar}
        >
          Agregar asignatura
        </button>
      </div>
      <div className="p-8">
        <table className="min-w-full divide-y divide-gray-200 border-solid border-slate-500">
          <thead className="bg-gray-50 border border-gray-400">
            <tr className="border border-slate-500">
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider border border-slate-500">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider border border-slate-500">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider border border-slate-500">
                Carrera asociada
              </th>
              <th className="px-6 py-3 text-left text-xl font-bold text-gray-500 tracking-wider border border-slate-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="border border-slate-500">
            {data.map((item) => (
              <tr key={item.subjectId} className="border border-slate-500">
                <td className="border border-slate-500 px-6 py-4 whitespace-nowrap">
                  {item.subjectId}
                </td>
                <td className="border border-slate-500 px-6 py-4 whitespace-nowrap">
                  {item.subjectName}
                </td>
                <td className="border border-slate-500 px-6 py-4 whitespace-nowrap">
                  {item.degreeName}
                </td>
                <td className="border py-4 px-4 whitespace-nowrap flex items-center justify-center gap-x-2 select-none">
                  {/* <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setId(item.subjectId);
                      handleModalEditar(item.subjectId);
                    }}
                  >
                    Editar
                  </button> */}
                  <FaRegEdit
                    size={32}
                    className="hover:cursor-pointer"
                    color="blue"
                    onClick={() => {
                      setId(item.subjectId);
                      handleModalEditar(item.subjectId);
                    }}
                    title="Editar Asignatura"
                  />
                  <FaRegTrashAlt
                    size={32}
                    color="red"
                    onClick={() => handleModalEliminar(item.subjectId)}
                    className="hover:cursor-pointer"
                    title="Eliminar Asignatura"
                  />
                  {/* <button
                    className="ml-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleModalEliminar(item.subjectId)}
                  >
                    Eliminar
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteSubjectModal
        open={openEliminar}
        id={id}
        onClose={closeModalEliminar}
      />
      <EditSubjectModal open={openEditar} id={id} onClose={closeModalEditar} />
      <AddSubjectModal
        open={openAgregar}
        onClose={() => setOpenAgregar(false)}
      />
    </div>
  );
};

export default TableSubjects;
