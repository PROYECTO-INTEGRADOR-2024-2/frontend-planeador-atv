"use client";

import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const TutorialForm = () => {
  const router = useRouter();

  // Estados de asignaturas y usuario
  const [dataSubject, setDataSubject] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [subjectApplication, setSubjectApplication] = useState({
    user_id: "",
    subject_ids: [],
  });

  // Estados del archivo
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // Usuario y solicitud del tutor
  const [user, setUser] = useState(null);
  const [tutorRequest, setTutorRequest] = useState({
    userId: "",
    applicationState: "pendiente",
    applicationDate: new Date().toLocaleString("sv-SE").replace(" ", "T"),
    userSemester: "",
  });

  const numberOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      setSubjectApplication((prev) => ({
        ...prev,
        user_id: decodedUser.user_id,
      }));
      setTutorRequest((prev) => ({
        ...prev,
        userId: decodedUser.user_id,
      }));
    }
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/v1/subject/");
        if (!res.ok) throw new Error("No se pudieron cargar las asignaturas.");
        const result = await res.json();
        setDataSubject(result.map((item) => Object.values(item)));
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchSubjects();
  }, []);

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    const idNum = parseInt(id);

    setCheckedItems((prev) => ({
      ...prev,
      [id]: checked,
    }));

    setSubjectApplication((prev) => ({
      ...prev,
      subject_ids: checked
        ? [...prev.subject_ids, idNum]
        : prev.subject_ids.filter((sid) => sid !== idNum),
    }));
  };

  const handleSemesterChange = (e) => {
    setTutorRequest((prev) => ({
      ...prev,
      userSemester: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
    setUploadResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.user_id) {
      toast.error("Debes iniciar sesión.");
      return;
    }

    if (subjectApplication.subject_ids.length === 0) {
      toast.warning("Selecciona al menos una asignatura.");
      return;
    }

    if (!selectedFile) {
      toast.warning("Debes subir tu certificado de matrícula.");
      return;
    }

    if (!tutorRequest.userSemester) {
      toast.warning("Debes seleccionar un semestre.");
      return;
    }

    try {
      // 1. Enviar asignaturas
      const subjectRes = await fetch(
        "http://localhost:8081/api/v1/application/subjects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subjectApplication),
        }
      );

      if (!subjectRes.ok) throw new Error("Error al registrar asignaturas.");

      // 2. Subir archivo
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", user.user_id);

      setIsUploading(true);
      const fileRes = await fetch(
        "http://localhost:8081/api/v1/fileManager/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!fileRes.ok) throw new Error("Error al subir el certificado.");

      // 3. Enviar solicitud general
      const tutorRes = await fetch("http://localhost:8081/api/v1/application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tutorRequest),
      });

      if (!tutorRes.ok) throw new Error("Error al enviar solicitud general.");

      toast.success("Solicitud enviada exitosamente. ¡Bienvenido al equipo!");
      router.push("/landing");
    } catch (error) {
      toast.error(`Hubo un error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-[30vw] bg-[#d9d9d9] px-8 pb-8 rounded-[50px] p-2 mb-8">
      <div className="w-full text-center my-[3vh]">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Solicitud de Registro Tutor
        </h1>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Asignaturas */}
        <div>
          <label className="block text-center font-bold text-gray-900 mb-2">
            Asignaturas
          </label>
          <div className="grid grid-cols-2 gap-4">
            {dataSubject.map((item) => (
              <div className="flex items-center gap-2" key={item[0]}>
                <input
                  type="checkbox"
                  id={item[0]}
                  name={item[0]}
                  checked={checkedItems[item[0]] || false}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={item[0]}>{`${item[0]} - ${item[2]}`}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Semestre */}
        <div>
          <label className="block text-center font-bold text-gray-900 mb-2">
            Semestre
          </label>
          <div className="flex justify-center">
            <select
              value={tutorRequest.userSemester}
              onChange={handleSemesterChange}
              className="rounded-xl bg-[#6f7e91] text-white font-bold text-center px-4 py-2"
            >
              <option value="" disabled>
                Selecciona un semestre
              </option>
              {numberOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Carga de archivo */}
        <div>
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-[#f2f2f2] border-gray-600 hover:border-gray-500"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-12 h-12 mb-2 text-blue-700"
                fill="none"
                viewBox="0 0 20 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021A4 4 0 0 0 5 13h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="text-center text-gray-800">
                <span className="font-semibold">Sube tu certificado</span> o
                arrástralo aquí
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {selectedFile && (
            <p className="text-green-600 text-center mt-2">
              Archivo seleccionado: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Términos */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="terminos" required />
          <label htmlFor="terminos">Acepto términos y condiciones.</label>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="w-[45%] text-white bg-[#ff2727] hover:bg-[#7e2020] font-medium rounded-3xl text-lg py-2"
            onClick={() => router.back()}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="w-[45%] text-white bg-[#6f7e91] hover:bg-[#4d5866] font-medium rounded-3xl text-lg py-2"
          >
            {isUploading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorialForm;
