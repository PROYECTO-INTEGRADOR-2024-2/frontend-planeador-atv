"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import NavbarHome from "@/components/NavbarHome";
import Footer from "/src/components/Footer";

const disponibilidadTutor = () => {
  const [disponibilidad, setDisponibilidad] = useState({});
  const [guardar, setGuardar] = useState(false);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const URLS = {
    DISPONIBILIDAD: "http://localhost:8081/api/v1/tutor/availability",
    OBTENER: "http://localhost:8081/api/v1/tutor/{tutorId}/availability",
  };

  const days = [
    { key: "lunes", name: "Lunes" },
    { key: "martes", name: "Martes" },
    { key: "miercoles", name: "Miercoles" },
    { key: "jueves", name: "Jueves" },
    { key: "viernes", name: "Viernes" },
    { key: "sabado", name: "Sabado" },
    { key: "domingo", name: "Domingo" },
  ];

  const timeSlots = [
    { inicio: "06:00", final: "08:00", periodo: "AM" },
    { inicio: "07:00", final: "09:00", periodo: "AM" },
    { inicio: "08:00", final: "10:00", periodo: "AM" },
    { inicio: "09:00", final: "11:00", periodo: "AM" },
    { inicio: "10:00", final: "12:00", periodo: "PM" },
    { inicio: "11:00", final: "01:00", periodo: "PM" },
    { inicio: "12:00", final: "02:00", periodo: "PM" },
    { inicio: "01:00", final: "03:00", periodo: "PM" },
    { inicio: "02:00", final: "04:00", periodo: "PM" },
    { inicio: "03:00", final: "05:00", periodo: "PM" },
    { inicio: "04:00", final: "06:00", periodo: "PM" },
    { inicio: "05:00", final: "07:00", periodo: "PM" },
    { inicio: "06:00", final: "08:00", periodo: "PM" },
    { inicio: "07:00", final: "09:00", periodo: "PM" },
    { inicio: "08:00", final: "10:00", periodo: "PM" },
  ];

  // Función para obtener la disponibilidad desde el servidor
  const obtenerDisponibilidad = async (tutorId) => {
    try {
      const url = URLS.OBTENER.replace("{tutorId}", tutorId);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 404) {
          // No hay disponibilidad guardada, mantener estado vacío
          console.log("No se encontró disponibilidad previa");
          return;
        }
        throw new Error("Error al cargar la disponibilidad");
      }

      const data = await res.json();
      mapearDisponibilidad(data);
    } catch (err) {
      console.error("Error al obtener disponibilidad:", err);
      toast.error(err.message || "Error al cargar la disponibilidad");
    }
  };

  // Función para mapear la disponibilidad del servidor al formato del componente
  const mapearDisponibilidad = (serverData) => {
    const disponibilidadMapeada = {};

    serverData.forEach((item) => {
      // Encontrar el índice del slot de tiempo que coincida
      const slotIndex = timeSlots.findIndex(
        (slot) =>
          slot.inicio === item.startTime &&
          slot.final === item.endTime &&
          slot.periodo === item.period
      );

      if (slotIndex !== -1) {
        const key = `${item.day}_${slotIndex}`;
        disponibilidadMapeada[key] = true;
      }
    });

    setDisponibilidad(disponibilidadMapeada);
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");

    if (token && userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);

        // Cargar disponibilidad existente
        obtenerDisponibilidad(parsedUser.user_id);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        router.push("/landing");
      }
    } else {
      router.push("/landing");
    }

    setLoading(false);
  }, [router]);

  const isSlotSelected = (day, slotIndex) => {
    return disponibilidad[`${day}_${slotIndex}`] || false;
  };

  const getSelectedCount = () => {
    return Object.values(disponibilidad).filter(Boolean).length;
  };

  const toggleSlot = (day, slotIndex) => {
    const key = `${day}_${slotIndex}`;

    setDisponibilidad((prev) => {
      const updated = { ...prev };
      updated[key] = !prev[key];
      return updated;
    });
  };

  const clearAll = () => {
    setDisponibilidad({});
  };

  const formatearFechas = () => {
    const formateo = [];

    Object.keys(disponibilidad).forEach((key) => {
      if (disponibilidad[key]) {
        const [dia, slotIndex] = key.split("_");
        const slot = timeSlots[parseInt(slotIndex)];

        formateo.push({
          dia: dia,
          horaInicio: slot.inicio,
          horaFinal: slot.final,
          periodo: slot.periodo,
        });
      }
    });
    return formateo;
  };

  const guardarDisponibilidad = () => {
    const dispobilidadJson = {
      tutorId: user.user_id,
      disponibilidad: formatearFechas(),
      totalBloques: getSelectedCount(),
    };
    console.log(
      "Disponibilidad a enviar: ",
      JSON.stringify(dispobilidadJson),
      null,
      2
    );
    setGuardar(true);
    guardarServidor();
    setTimeout(() => setGuardar(false), 2000);
  };

  const guardarServidor = async () => {
    const dispobilidadJson = {
      tutorId: user.user_id,
      disponibilidad: formatearFechas(),
      totalBloques: getSelectedCount(),
    };
    try {
      const res = await fetch(URLS.DISPONIBILIDAD, {
        method: "POST",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dispobilidadJson),
      });

      if (!res.ok) throw new Error("Error al guardar la disponibilidad");

      toast.success("Disponibilidad guardada exitosamente");
    } catch (err) {
      toast.error(err.message || "Error al guardar la disponibilidad");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando disponibilidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavbarHome name={"Juan"} rol={"Student"} />
      <div className="min-h-screen   p-4">
        <div className="max-w-6xl mx-auto">
          {/* Encabezado */}
          <div className="bg-white rounded-2xl  p-6 mb-6 border border-gray-400">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Disponibilidad Horaria
                  </h1>
                </div>
                <p className="text-gray-600">
                  Selecciona tus horarios disponibles
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Clock className="h-5 w-5 text-blue" />
                  Bloques seleccionados
                </div>
                <div className="text-2xl font-bold text-blue-500">
                  {getSelectedCount()}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 flex gap-3">
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              Limpiar todo
            </button>
            {getSelectedCount() > 0 && (
              <button
                onClick={guardarDisponibilidad}
                disabled={guardar}
                className={`px-6 py-2 rounded-lg transition-all text-sm font-medium p-2 ${
                  guardar
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {guardar ? "✓ Guardado" : "Guardar Disponibilidad"}
              </button>
            )}

            <button
              onClick={router.back}
              className="px-4 py-2 bg-[#64748B] text-white border-gray-700 rounded-lg hover:bg-gray-700 hover:border-black transition-colors text-sm font-medium"
            >
              Regresar
            </button>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl  overflow-hidden border border-indigo-100">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Encabezado tabla*/}
                <div className="bg-blue-500 text-white">
                  <div className="grid grid-cols-8 gap-px">
                    <div className="p-4 flex items-center justify-center"></div>
                    {days.map((day) => (
                      <div key={day.key} className="p-4 text-center">
                        <div className="font-semibold text-base">
                          {day.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Columna horarios */}
                <div className="divide-y divide-gray-100">
                  {timeSlots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="grid grid-cols-8 gap-px bg-gray-100"
                    >
                      {/* Time etiqueta  15 filas [i,1] */}
                      <div className="bg-white p-4 flex flex-col items-center justify-center border-r border-gray-200">
                        <div className="text-sm font-semibold text-gray-900">
                          {slot.inicio} - {slot.final}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {slot.periodo}
                        </div>
                      </div>

                      {/* Day casillas */}
                      {days.map((day) => (
                        <div
                          key={day.key}
                          className="bg-white p-3 flex items-center justify-center"
                        >
                          <button
                            onClick={() => toggleSlot(day.key, slotIndex)}
                            className={`w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-105 rounded-lg ${
                              isSlotSelected(day.key, slotIndex)
                                ? "bg-green-500 text-white shadow-lg"
                                : "hover:bg-green-50 border-2 border-dashed border-transparent hover:border-green-200"
                            }`}
                          >
                            {isSlotSelected(day.key, slotIndex) ? (
                              <span className="text-2xl font-bold">✓</span>
                            ) : (
                              <span className="text-gray-400">+</span>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Texto extra */}
          <div className="mt-6 bg-white rounded-xl p-4 border border-green-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-green-500 text-white text-xs font-bold rounded">
                    ✓
                  </div>
                  <span className="text-gray-600">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-sm">
                    +
                  </div>
                  <span className="text-gray-600">No disponible</span>
                </div>
              </div>
              <span className="text-gray-500">
                Haz clic en los bloques para cambiar tu disponibilidad
              </span>
            </div>
          </div>

          {/* Total de bloques */}
          {getSelectedCount() > 0 && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  Has seleccionado {getSelectedCount()} bloques horarios para
                  acompañar estudiantes
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default disponibilidadTutor;
