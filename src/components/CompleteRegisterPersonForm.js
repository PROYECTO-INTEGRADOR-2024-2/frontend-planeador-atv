"use client";
import Image from "next/legacy/image";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ModalRegister from "./ModalRegister";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

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
    userId: "",
    userIdType: "",
    userFirstname: "",
    userLastname: "",
    userPhone: "",
    userDepartment: "",
    userCity: "",
  });

  const [person, setPerson] = useState({
    userId: "",
    userIdType: "",
    userFirstname: "",
    userLastname: "",
    userPhone: "",
    userDepartment: "",
    userCity: "",
    userState: "1",
    userRole: "ROLE_STUDENT",
    userEmail: "",
    userPassword: "oauth_temp_123",
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
    if (person.userDepartment) {
      const selected = departmentsData.find(
        (dep) => dep.departamento === person.userDepartment
      );
      setCities(selected?.ciudades || []);
    }
  }, [person.userDepartment, departmentsData]);

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
          Cookies.set("token", authData.token);
          Cookies.set("user", JSON.stringify(user));

          switch (user.user_role) {
            case "ROLE_STUDENT":
              router.push("/student/landing");
              break;
            case "ROLE_TUTOR":
              router.push("/tutor/maintutor");
              break;
            case "ROLE_ADMIN":
              router.push("/admin");
              break;
            default:
              toast.error("Usuario desconectado, por favor iniciar sesión.");
              router.push("/login");
              return;
          }
        })
        .catch((err) => console.error("Error al solicitar token:", err));
    } catch (error) {
      console.error("Error en el registro:", error.message);
    }
  };

  const validateFormInput = (e) => {
    e.preventDefault();
    const errors = {};
    if (!person.userIdType) errors.userIdType = "Seleccione un tipo de ID";
    if (!person.userId) errors.userId = "Ingrese su número de documento";
    if (!person.userFirstname) errors.userFirstname = "Ingrese su nombre";
    if (!person.userLastname) errors.userLastname = "Ingrese sus apellidos";
    if (!person.userPhone) errors.userPhone = "Ingrese su teléfono";
    if (!person.userDepartment)
      errors.userDepartment = "Seleccione un departamento";
    if (!person.userCity) errors.userCity = "Seleccione una ciudad";

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
            name="userIdType"
            onChange={handleChange}
            value={person.userIdType}
            className="w-full border p-2 rounded"
          >
            <option value="">Tipo de documento</option>
            <option value="C.C">C.C</option>
            <option value="T.I">T.I</option>
          </select>
          <p className="text-red-500 text-xs">{formError.userIdType}</p>

          <input
            type="text"
            name="userId"
            placeholder="Número de documento"
            value={person.userId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-xs">{formError.userId}</p>

          <input
            type="text"
            name="userFirstname"
            placeholder="Nombres"
            value={person.userFirstname}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-xs">{formError.userFirstname}</p>

          <input
            type="text"
            name="userLastname"
            placeholder="Apellidos"
            value={person.userLastname}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-xs">{formError.userLastname}</p>

          <select
            name="userDepartment"
            onChange={handleChange}
            value={person.userDepartment}
            className="w-full border p-2 rounded"
          >
            <option value="">Seleccione su departamento</option>
            {departmentsData.map((dep, idx) => (
              <option key={idx} value={dep.departamento}>
                {dep.departamento}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-xs">{formError.userDepartment}</p>

          <select
            name="userCity"
            onChange={handleChange}
            value={person.userCity}
            className="w-full border p-2 rounded"
          >
            <option value="">Seleccione su ciudad</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-xs">{formError.userCity}</p>

          <input
            type="tel"
            name="userPhone"
            placeholder="Teléfono"
            value={person.userPhone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-xs">{formError.userPhone}</p>

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
