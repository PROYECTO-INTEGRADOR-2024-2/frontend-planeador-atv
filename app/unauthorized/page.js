"use client";

import { useRouter } from "next/navigation";

export default function unauthorized() {
  const router = useRouter();

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Acceso denegado
        </h2>
        <p className="text-gray-600 mb-6">
          No tienes permiso para acceder a esta página. Por favor, contacta con
          un administrador si crees que esto es un error.
        </p>
        <button
          onClick={() => router.back()}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Volver atrás
        </button>
      </div>
    </div>
  );
}
