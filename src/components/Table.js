"use client";
import React from "react";
import { useEffect, useState } from "react";

const Table = ({ title, columns }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/session/tutos"
        );
        if (!response.ok) {
          throw new error("Respuesta no valida");
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
        const response = await fetch("http://localhost:8080/api/v1/subject/");
        if (!response.ok) {
          throw new error("Respuesta no valida");
        }
        const result = await response.json();
        setSubject(result.map((item) => Object.values(item)));
      } catch (error) {
        setError(error.message);
      }
      return;
    };
    fetchDataSubject();
  }, []);

  function getNom(data1, dataSub) {
    let nombre;
    for (var i = 0; i < data1.lenght; i++) {
      if (data1[i][4] == dataSub[i][0]) {
        nombre = datasub[i][1];
      }
    }
    return nombre;
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2 ">
      <div className="bg-gray-200 mx-auto border border-slate-400 ">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">{title}</h1>
      </div>
      <div className="p-8">
        <table className="min-w-full divide-y divide-gray-200 border-solid border-slate-400">
          <thead className="bg-gray-50 border border-gray-400">
            <tr className="border border-slate-500">
              {columns.map((item, rowIndex) => (
                <th
                  key={rowIndex}
                  className="px-6 py-4 whitespace-nowrap border border-slate-300"
                >
                  {item?.toString() || ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border border-slate-500">
            {data.map((item) => (
              <tr key={item.class_id}>
                <td className="px-6 py-4 whitespace-nowrap">{item[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item[1]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item[2]}</td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {subject.find((element) => element[0] == item[4])[1]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item[5]}</td>
                {/*Hora*/}
                <td className="px-6 py-4 whitespace-nowrap">{item[6]}</td>
                <td className="px-6 py-4 whitespace-nowrap flex flex-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setId(item.degree_id);
                      handleModalEditar(item.degree_id);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="ml-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleModalEliminar(item.degree_id)}
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
export default Table;
