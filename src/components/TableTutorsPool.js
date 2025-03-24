"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const Alert = ({ message, type }) => {
  return (
    <div
      className={`fixed bottom-4 left-4 p-4 rounded-lg z-50 ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
    >
      {message}
    </div>
  );
};

const TableTutorsPool = ({ title, columns }) => {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } else {
      router.push("/landing");
    }
  }, [router]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;

      try {
        const response = await fetch(
          `http://localhost:8081/api/v1/application`
        );
        if (!response.ok) {
          throw new Error("Respuesta no valida");
        }
        const result = await response.json();

        const processed = result.map((item) => {
          const processedItem = { ...item };
          for (let key in processedItem) {
            if (
              typeof processedItem[key] === "number" &&
              processedItem[key] > 1000000000000
            ) {
              const date = new Date(processedItem[key]);
              processedItem[key] = date.toISOString().split("T")[0];
            }
          }
          return Object.values(processedItem);
        });

        const pending = processed.filter(
          (item) => item[2].toLowerCase() === "pendiente"
        );
        const accepted = processed.filter(
          (item) => item[2].toLowerCase() === "aceptada"
        );
        const rejected = processed.filter(
          (item) => item[2].toLowerCase() === "rechazada"
        );

        setPendingApplications(pending);
        setAcceptedApplications(accepted);
        setRejectedApplications(rejected);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchApplications();
  }, [user]);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const handleAcceptApplication = async (applicationId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/application/accept/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al aceptar la solicitud");
      }

      showAlert("Solicitud aceptada exitosamente", "success");

      // Update local state instead of reloading
      const updatedPending = pendingApplications.filter(
        (item) => item[0] !== applicationId
      );
      const updatedAccepted = [
        ...acceptedApplications,
        pendingApplications
          .find((item) => item[0] === applicationId)
          .map((val, index) => (index === 2 ? "ACEPTADA" : val)),
      ];

      setPendingApplications(updatedPending);
      setAcceptedApplications(updatedAccepted);
      setActiveTab("accepted");
    } catch (error) {
      showAlert("Error al aceptar la solicitud", "error");
    }
  };

  const handleRejectApplication = async (applicationId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/application/reject/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al rechazar la solicitud");
      }

      showAlert("Solicitud rechazada exitosamente", "success");

      // Update local state instead of reloading
      const updatedPending = pendingApplications.filter(
        (item) => item[0] !== applicationId
      );
      const updatedRejected = [
        ...rejectedApplications,
        pendingApplications
          .find((item) => item[0] === applicationId)
          .map((val, index) => (index === 2 ? "RECHAZADA" : val)),
      ];

      setPendingApplications(updatedPending);
      setRejectedApplications(updatedRejected);
      setActiveTab("rejected");
    } catch (error) {
      showAlert("Error al rechazar la solicitud", "error");
    }
  };

  const renderActionButtons = (item) => {
    if (activeTab !== "pending") return null;

    return (
      <td className="px-2 py-4 whitespace-nowrap flex justify-center border border-slate-300">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleAcceptApplication(item[0])}
        >
          Aceptar
        </button>
        <button
          className="ml-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleRejectApplication(item[0])}
        >
          Rechazar
        </button>
      </td>
    );
  };

  const renderTable = (applications, acciones) => {
    if (applications.length === 0) {
      return (
        <div className="text-center py-4">No hay solicitudes disponibles</div>
      );
    }

    return (
      <table className="min-w-full divide-y divide-gray-200 border-solid border-slate-400">
        <thead className="bg-gray-50 border border-gray-400">
          <tr className="border border-slate-500">
            {columns.map((item, rowIndex) =>
              item.toString() != "Acciones" ? (
                <th
                  key={rowIndex}
                  className="px-6 py-4 whitespace-nowrap border border-slate-300"
                >
                  {item?.toString() || ""}
                </th>
              ) : (
                ""
              )
            )}
          </tr>
        </thead>
        <tbody className="border border-slate-500">
          {applications.map((item) => (
            <tr key={item[0]}>
              <td className="px-6 py-4 whitespace-nowrap border border-slate-300 text-center">
                {item[0]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap border border-slate-300 text-center">
                {item[1]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap border border-slate-300 text-center">
                {item[2].toUpperCase()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap border border-slate-300 text-center">
                {item[3]}
              </td>
              {renderActionButtons(item)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2 relative">
      {alert && <Alert message={alert.message} type={alert.type} />}

      <div className="bg-gray-200 mx-auto border border-slate-400">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4">{title}</h1>
      </div>

      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 ${activeTab === "pending"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
            }`}
          onClick={() => setActiveTab("pending")}
        >
          Pendientes ({pendingApplications.length})
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "accepted"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
            }`}
          onClick={() => setActiveTab("accepted")}
        >
          Aceptadas ({acceptedApplications.length})
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "rejected"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
            }`}
          onClick={() => setActiveTab("rejected")}
        >
          Rechazadas ({rejectedApplications.length})
        </button>
      </div>

      <div className="p-8">
        {activeTab === "pending" && renderTable(pendingApplications)}
        {activeTab === "accepted" && renderTable(acceptedApplications)}
        {activeTab === "rejected" && renderTable(rejectedApplications)}
      </div>
    </div>
  );
};

export default TableTutorsPool;
