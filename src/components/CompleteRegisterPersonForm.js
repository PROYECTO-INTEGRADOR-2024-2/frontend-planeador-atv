"use client";
import Image from "next/legacy/image";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ModalRegister from "./ModalRegister";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const CompleteRegisterPersonForm = () => {
  const PERSON_API_BASE_URL = "http://localhost:8081/api/v1/auth/register";
  const DEPARTMENT_DATA_URL =
    "https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json";

  const { data: session, status } = useSession();
  const router = useRouter();

  const [departmentsData, setDepartmentsData] = useState([]);
  const [cities, setCities] = useState([]);
  const [openRegister, setOpenRegister] = useState(false);

  const [formError, setFormError] = useState({
    user_id: "",
    user_id_type: "",
    user_firstname: "",
    user_lastname: "",
    user_phone: "",
    user_department: "",
    user_city: "",
  });

  const [person, setPerson] = useState({
    user_id: "",
    user_id_type: "",
    user_firstname: "",
    user_lastname: "",
    user_phone: "",
    user_department: "",
    user_city: "",
    user_state: "1",
    user_role: "STUDENT",
    userEmail: "",
    user_password: "oauth_temp_123", 
  });

  useEffect(() => {
    if (status === "authenticated") {
      setPerson((prev) => ({
        ...prev,
        userEmail: session?.user?.email || "",
      }));
    }
  }, [session, status]);

  useEffect(() => {
    if (person.user_department) {
      const selected = departmentsData.find(
        (dep) => dep.departamento === person.user_department
      );
      setCities(selected?.ciudades || []);
    }
  }, [person.user_department, departmentsData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(DEPARTMENT_DATA_URL);
        if (!response.ok) throw new Error("Respuesta no válida");
        const result = await response.json();
        setDepartmentsData(result);
      } catch (error) {
        console.error("Error al cargar departamentos:", error.message);
      }
    };
    fetchData();
  }, []);

  const handleModalRegister = () => setOpenRegister(true);
  const closeModalRegister = () => setOpenRegister(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
  };

  const savePerson = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(PERSON_API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(person),
      });

      if (!response.ok) throw new Error("Algo salió mal en el registro");

      await response.json();

      console.log("El correo ya está registrado");
      fetch("http://localhost:8081/api/v1/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: person.userEmail }),
      })
        .then((res) => res.json())
        .then((authData) => {
          const user = jwtDecode(authData.token);
          console.log("Token recibido:", authData.token);
          localStorage.setItem("token", authData.token);
          localStorage.setItem("user", JSON.stringify(user));
          router.push("../landing");
        })
        .catch((err) => console.error("Error al solicitar token:", err));
    } catch (error) {
      console.error("Error en el registro:", error.message);
    }
  };

  const validateFormInput = (e) => {
    e.preventDefault();
    const errors = {};
    if (!person.user_id_type) errors.user_id_type = "Seleccione un tipo de ID";
    if (!person.user_id) errors.user_id = "Ingrese su número de documento";
    if (!person.user_firstname) errors.user_firstname = "Ingrese su nombre";
    if (!person.user_lastname) errors.user_lastname = "Ingrese sus apellidos";
    if (!person.user_phone) errors.user_phone = "Ingrese su teléfono";
    if (!person.user_department)
      errors.user_department = "Seleccione un departamento";
    if (!person.user_city) errors.user_city = "Seleccione una ciudad";

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    setFormError({});
    savePerson(e);
  };

  if (status !== "authenticated") {
    return <div className="p-4 text-center">Cargando sesión...</div>;
  }

  return (
    <div className="basis-full h-[100vh] md:basis-2/5 overflow-auto">
      <div className="px-[5vw] 2xl:mt-[5vh] sm:my-[8vh] min-[300px]:mt-[10vh]">
        <div className="text-center pb-[3vh] overflow-auto">
          <div className="flex justify-center h-[50px]">
            <Image
              src={"/images/logo-lock.png"}
              alt={"lock"}
              height={50}
              width={50}
            />
          </div>
          <h1 className="font-bold text-2xl">Completa el registro</h1>
        </div>
        <form className="space-y-4 md:space-y-2" onSubmit={validateFormInput}>
          <select
            name="user_id_type"
            onChange={handleChange}
            value={person.user_id_type}
            className="w-full border p-2 rounded"
          >
            <option value="">Tipo de documento</option>
            <option value="C.C">C.C</option>
            <option value="T.I">T.I</option>
          </select>
          <p className="text-red-500 text-xs">{formError.user_id_type}</p>

          <input
            type="text"
            name="user_id"
            placeholder="Número de documento"
            value={person.user_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-xs">{formError.user_id}</p>

          <input
            type="text"
            name="user_firstname"
            placeholder="Nombres"
            value={person.user_firstname}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-xs">{formError.user_firstname}</p>

          <input
            type="text"
            name="user_lastname"
            placeholder="Apellidos"
            value={person.user_lastname}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-xs">{formError.user_lastname}</p>

          <select
            name="user_department"
            onChange={handleChange}
            value={person.user_department}
            className="w-full border p-2 rounded"
          >
            <option value="">Seleccione su departamento</option>
            {departmentsData.map((dep, idx) => (
              <option key={idx} value={dep.departamento}>
                {dep.departamento}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-xs">{formError.user_department}</p>

          <select
            name="user_city"
            onChange={handleChange}
            value={person.user_city}
            className="w-full border p-2 rounded"
          >
            <option value="">Seleccione su ciudad</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-xs">{formError.user_city}</p>

          <input
            type="tel"
            name="user_phone"
            placeholder="Teléfono"
            value={person.user_phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-xs">{formError.user_phone}</p>

          <button
            type="submit"
            className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-800"
          >
            Crear cuenta
          </button>
        </form>
      </div>
      <ModalRegister open={openRegister} onClose={closeModalRegister} />
    </div>
  );
};

export default CompleteRegisterPersonForm;
