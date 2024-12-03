"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TableTutorsPool = ({ title, columns }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState([]);
  const [tutor, setTutor] = useState([]);

  const router = useRouter();
  const [user, setUser] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user != null) {
      setUser(JSON.parse(user));
    } else {
      router.push("/landing");
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Usuario que quiero: " + user);
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/session/sessionsstudent/${user.user_id}`
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
    if (user) fetchData();
  }, [user]);

  // Método para traer el tutor por id
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/persons/${data[0][3]}`
        );
        console.log(data);
        if (!response.ok) {
          throw new error("Respuesta no valida");
        }
        const result = await response.json();
        setTutor(result.map((item) => Object.values(item)));
        console.log("Tutor: " + result);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchTutor();
  }, [data]);

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
  }, [error]);

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2 ">
      <div className="bg-gray-200 mx-auto border border-slate-400 ">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">{title}</h1>
      </div>
      <div className="p-8 ">
        <table className="min-w-full divide-y divide-gray-200 border-solid border-slate-400 ">
          <thead className="bg-gray-50 border border-gray-400  ">
            <tr className="border border-slate-500">
              {columns.map((item, rowIndex) => (
                <th
                  key={rowIndex}
                  className="px-6 py-4 whitespace-nowrap border border-slate-300 "
                >
                  {item?.toString() || ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border border-slate-500  ">
            {data.map((item) => (
              <tr key={item.class_id}>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-300 text-center">
                  {item[0]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-300 text-center">
                  {item[1]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-300 text-center">
                  {item[3]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-slate-300 text-center">
                  {item[5]}
                </td>
                <td className="px-2 py-4 whitespace-nowrap flex justify-center border border-slate-300">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setId(item.degree_id);
                      handleModalEditar(item.degree_id);
                    }}
                  >
                    Aceptar
                  </button>
                  <button
                    className="ml-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleModalEliminar(item.degree_id)}
                  >
                    Rechazar
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
export default TableTutorsPool;
