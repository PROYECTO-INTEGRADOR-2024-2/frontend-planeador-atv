"use client";
import React from "react";
import { useEffect, useState } from "react";

const Table = ({ title, columns }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2 ">
      <div className="bg-gray-200 mx-auto border border-slate-400 ">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">{title}</h1>
      </div>
      <div className="p-8">
        <table className="min-w-full divide-y divide-gray-200 border-solid border-slate-400">
          <thead className="bg-gray-50 border border-gray-400 bg-[#E5E7EB]">
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
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {row.map((cell, index) => (
                  <td
                    className={
                      "px-6 py-4 whitespace-nowrap border border-slate-300"
                    }
                    key={index}
                  >
                    {cell.toString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Table;
