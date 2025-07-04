"use client"
import React, { useState, useEffect } from "react";
import { Check, X, RefreshCw, AlertCircle, User, Calendar, BookOpen, ExternalLink } from 'lucide-react';
import Cookies from "js-cookie";
import NavbarHome from "@/components/NavbarHome";
import Footer from "/src/components/Footer";


const activationRequest = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [procesando, setProcesando] = useState({});

    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");

    const fetchSolicitudes = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:8081/api/v1/application', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}`)
            }
            const data = await response.json();
            setSolicitudes(data || []);

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false);
        }
    }

    const aceptarSolicitud = async (studentId) => {
        setProcesando(prev => ({ ...prev, [studentId]: true }));

        try {
            const response = await fetch(`http://localhost:8081/api/v1/persons/activateTutor/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            // Actualizar el estado local
            setSolicitudes(prev =>
                prev.map(sol =>
                    sol.studentId === studentId
                        ? { ...sol, requestState: 'aceptada' }
                        : sol
                )
            );

            alert(' Solicitud aceptada - Estudiante activado como tutor')
        } catch (err) {
            alert(`Error al aceptar la solicitud: ${err.message}`)
        } finally {
            setProcesando(prev => ({ ...prev, [studentId]: false }));
        }
    }

    const rechazarSolicitud = async (studentId) => {
        setProcesando(prev => ({ ...prev, [studentId]: true }));

        try {
            // Actualizar solo el estado local para rechazar
            setSolicitudes(prev =>
                prev.map(sol =>
                    sol.studentId === studentId
                        ? { ...sol, requestState: 'rechazada' }
                        : sol
                )
            );

            alert('Solicitud rechazada');
        } catch (err) {
            alert(`Error al rechazar solicitud: ${err.message}`);
        } finally {
            setProcesando(prev => ({ ...prev, [studentId]: false }));
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'aceptada':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'rechazada':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    return (
        <>
        <NavbarHome name={"Juan"} rol={"Student"} />
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="w-6 h-6" />
                            Solicitudes de Tutor
                        </h1>
                        <button
                            onClick={fetchSolicitudes}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-800">{error}</span>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-8">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-500">Cargando solicitudes...</p>
                        </div>
                    )}

                    {/* Lista de Solicitudes */}
                    {!loading && !error && solicitudes.length === 0 && (
                        <div className="text-center py-8">
                            <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No hay solicitudes disponibles</p>
                        </div>
                    )}

                    {!loading && solicitudes.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Fecha de Solicitud
                                            </div>
                                        </th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                                            Estado
                                        </th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                                            ID Estudiante
                                        </th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Nombre
                                            </div>
                                        </th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Semestre
                                            </div>
                                        </th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                                            Archivo
                                        </th>
                                        <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {solicitudes.map((solicitud, index) => (
                                        <tr key={solicitud.studentId || index} className="hover:bg-gray-50">
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                {solicitud.requestDate}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getEstadoColor(solicitud.requestState)}`}>
                                                    {solicitud.requestState}
                                                </span>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900 font-mono">
                                                {solicitud.studentId}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium">
                                                {solicitud.studentName}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900 text-center">
                                                {solicitud.semester}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3">
                                                {solicitud.fileUrl && (
                                                    <a
                                                        href={solicitud.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Ver archivo
                                                    </a>
                                                )}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => aceptarSolicitud(solicitud.studentId)}
                                                        disabled={procesando[solicitud.studentId] || solicitud.requestState !== 'pendiente'}
                                                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Aceptar
                                                    </button>
                                                    <button
                                                        onClick={() => rechazarSolicitud(solicitud.studentId)}
                                                        disabled={procesando[solicitud.studentId] || solicitud.requestState !== 'pendiente'}
                                                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Rechazar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Información adicional */}
                    <div className="mt-6 text-sm text-gray-600">
                        <p>Total de solicitudes: {solicitudes.length}</p>
                        <p>Pendientes: {solicitudes.filter(s => s.requestState === 'pendiente').length}</p>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default activationRequest;