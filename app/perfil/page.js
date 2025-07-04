"use client"
import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Edit2, Save, X, AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import NavbarHome from "@/components/NavbarHome";
import Footer from "/src/components/Footer";

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState({});
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(null);
    const [departmentData, setDepartmentData] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    // Función para obtener datos de departamentos y ciudades
    const fetchDepartmentData = async () => {
        try {
            const response = await fetch(
                "https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json"
            );
            if (!response.ok) {
                throw new Error("Error al obtener datos de departamentos");
            }
            const data = await response.json();
            setDepartmentData(data);
        } catch (error) {
            console.error("Error al cargar departamentos:", error);
        }
    };

    // Función para obtener el ID del usuario desde el token en cookies
    const getUserIdFromToken = () => {
        try {
            const token = Cookies.get("token");
            if (!token) {
                throw new Error('Token no encontrado en cookies');
            }

            const decodedUser = jwtDecode(token);
            return decodedUser.user_id;
        } catch (error) {
            console.error('Error al obtener ID del token:', error);
            return null;
        }
    };

    // Función para obtener la información del usuario
    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            const userId = getUserIdFromToken();

            if (!userId) {
                throw new Error('No se pudo obtener el ID del usuario');
            }

            const response = await fetch(`http://localhost:8081/api/v1/persons/${userId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener la información del usuario');
            }

            const data = await response.json();
            setUserInfo(data);
            setEditedInfo({
                userPhone: data.userPhone,
                userDepartment: data.userDepartment,
                userCity: data.userCity
            });
            setSelectedDepartment(data.userDepartment);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar la información del usuario
    const updateUserInfo = async () => {
        try {
            setUpdateLoading(true);
            const userId = getUserIdFromToken();

            const response = await fetch(`http://localhost:8081/api/v1/persons/${userId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userInfo,
                    userPhone: editedInfo.userPhone,
                    userDepartment: editedInfo.userDepartment,
                    userCity: editedInfo.userCity
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la información');
            }

            const updatedData = await response.json();
            setUserInfo(updatedData);
            setIsEditing(false);
            setUpdateMessage({ type: 'success', text: 'Información actualizada correctamente' });

            setTimeout(() => setUpdateMessage(null), 3000);
        } catch (err) {
            setUpdateMessage({ type: 'error', text: err.message });
            setTimeout(() => setUpdateMessage(null), 3000);
        } finally {
            setUpdateLoading(false);
        }
    };

    // Función para manejar cambios en los campos editables
    const handleInputChange = (field, value) => {
        setEditedInfo(prev => ({
            ...prev,
            [field]: value
        }));

        // Si cambia el departamento, actualizar el estado y limpiar la ciudad
        if (field === 'userDepartment') {
            setSelectedDepartment(value);
            setEditedInfo(prev => ({
                ...prev,
                userDepartment: value,
                userCity: '' // Limpiar ciudad cuando cambie departamento
            }));
        }
    };

    // Función para cancelar la edición
    const cancelEdit = () => {
        setEditedInfo({
            userPhone: userInfo.userPhone,
            userDepartment: userInfo.userDepartment,
            userCity: userInfo.userCity
        });
        setSelectedDepartment(userInfo.userDepartment);
        setIsEditing(false);
    };

    useEffect(() => {
        fetchUserInfo();
        fetchDepartmentData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando información del perfil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Error</h2>
                    <p className="text-gray-600 text-center mb-4">{error}</p>
                    <button
                        onClick={fetchUserInfo}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <NavbarHome name={"Juan"} rol={"Student"} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
                                    <p className="text-gray-600">Información personal y configuración</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isEditing
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {isEditing ? (
                                    <>
                                        <X className="w-4 h-4" />
                                        <span>Cancelar</span>
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="w-4 h-4" />
                                        <span>Editar</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mensaje de actualización */}
                    {updateMessage && (
                        <div className={`mb-6 p-4 rounded-lg ${updateMessage.type === 'success'
                                ? 'bg-green-100 border border-green-200 text-green-700'
                                : 'bg-red-100 border border-red-200 text-red-700'
                            }`}>
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-5 h-5" />
                                <span>{updateMessage.text}</span>
                            </div>
                        </div>
                    )}

                    {/* Información del usuario */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Información Personal</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ID (Solo lectura) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ID de Usuario
                                </label>
                                <input
                                    type="text"
                                    value={`${userInfo.userId} (${userInfo.userIdType})`}
                                    readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            {/* Nombre (Solo lectura) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    value={`${userInfo.userFirstname} ${userInfo.userLastname}`}
                                    readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            {/* Correo (Solo lectura) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    value={userInfo.userEmail}
                                    readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            {/* Teléfono (Editable) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="inline w-4 h-4 mr-1" />
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={isEditing ? editedInfo.userPhone : userInfo.userPhone}
                                    onChange={(e) => handleInputChange('userPhone', e.target.value)}
                                    readOnly={!isEditing}
                                    className={`w-full p-3 border rounded-lg ${isEditing
                                            ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            : 'border-gray-300 bg-gray-50'
                                        }`}
                                    placeholder="Ingresa tu número de teléfono"
                                />
                            </div>

                            {/* Departamento (Editable) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="inline w-4 h-4 mr-1" />
                                    Departamento
                                </label>
                                {isEditing ? (
                                    <select
                                        value={editedInfo.userDepartment}
                                        onChange={(e) => handleInputChange('userDepartment', e.target.value)}
                                        className="w-full p-3 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        <option value="">Seleccione un departamento</option>
                                        {departmentData.map((item, index) => (
                                            <option key={index} value={item.departamento}>
                                                {item.departamento}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={userInfo.userDepartment}
                                        readOnly
                                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                                    />
                                )}
                            </div>

                            {/* Ciudad (Editable) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="inline w-4 h-4 mr-1" />
                                    Ciudad
                                </label>
                                {isEditing ? (
                                    <select
                                        value={editedInfo.userCity}
                                        onChange={(e) => handleInputChange('userCity', e.target.value)}
                                        className="w-full p-3 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        disabled={!selectedDepartment}
                                    >
                                        <option value="">
                                            {selectedDepartment ? 'Seleccione una ciudad' : 'Primero seleccione un departamento'}
                                        </option>
                                        {selectedDepartment && departmentData
                                            .find((dept) => dept.departamento === selectedDepartment)
                                            ?.ciudades?.map((city, index) => (
                                                <option key={index} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={userInfo.userCity}
                                        readOnly
                                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Botones de acción */}
                        {isEditing && (
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    onClick={cancelEdit}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={updateUserInfo}
                                    disabled={updateLoading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                >
                                    {updateLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Guardando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Guardar Cambios</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Información adicional */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Información de Cuenta</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rol del Usuario
                                </label>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {userInfo.userRole.replace('ROLE_', '')}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado de la Cuenta
                                </label>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${userInfo.userState === '1'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {userInfo.userState === '1' ? 'Activa' : 'Inactiva'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserProfile;