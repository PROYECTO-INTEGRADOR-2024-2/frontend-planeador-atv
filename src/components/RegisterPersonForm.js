"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";



const RegisterPersonForm = () => {
  const PERSON_API_BASE_URL = "http://localhost:8080/api/v1/persons";
  const DEPARTMENT_DATA_URL = "https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json"
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState({
    user_id: "",
    user_id_type: "",
    user_name: "",
    user_lastname: "",
    user_email: "",
    user_password: "",
    user_phone: "",
    user_department: "",
    user_city: "",
    user_state: "",
    user_role: "",
    success: "",
  });

  const [person, setPerson] = useState({
    user_id: "",
    user_id_type: "",
    user_name: "",
    user_lastname: "",
    user_email: "",
    user_password: "",
    user_phone: "",
    user_department: "",
    user_city: "",
    user_state: "1",
    user_role: "Student",
  });


  const handleChange = (event) => {
    const value = event.target.value;
    setPerson({ ...person, [event.target.name]: value });
  };
  const handleChangeConfirm = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);
  };

  const savePerson = async (e) => {
    e.preventDefault();
    const response = await fetch(PERSON_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const _person = await response.json();
    reset(e);
  };

  const[data, setData] =useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json"
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

  // const obtainData = async () => {
  //   await fetch(DEPARTMENT_DATA_URL)
  //   .then((data) => {
  //       return data.json();
  // })
    
  // }

  const dataDprtmnt = async () => {
    let dataDepartment = await fetch(
      "https://www.datos.gov.co/resource/xdk5-pm3f.json"
    )
      .then((data) => {
          return data.json();
    })
    return dataDepartment
    }

  console.log(dataDprtmnt())

  const reset = (e) => {
    e.preventDefault();
    setPerson({
      user_id: "",
      user_id_type: "",
      user_name: "",
      user_lastname: "",
      user_email: "",
      user_password: "",
      user_phone: "",
      user_department: "Antioquia",
      user_city: "Bello",
      user_state: "1",
      user_role: "Student",
    });
  };

  const validateFormInput = (event) => {
    event.preventDefault();

    // Inicializamos un objeto con los errores de entrada
    let inputError = {
      user_id: "",
      user_id_type: "",
      user_name: "",
      user_lastname: "",
      user_email: "",
      user_password: "",
      user_phone: "",
      user_department: "Antioquia",
      user_city: "Bello",
      user_state: "1",
      user_role: "Student",
    };
    let confirmPWD = "";

    // Verificamos si el email o la contraseña están vacíos
    if (
      !person.user_name &&
      !person.user_email &&
      !person.user_id &&
      !person.user_lastname &&
      !person.user_password &&
      !person.phone
    ) {
      setFormError({
        ...inputError,
        id: "Por favor ingrese su identificación",
        name: "Por favor ingrese su nombre",
        lastName: "Por favor ingrese su apellido",
        email: "Ingrese un email válido",
        password: "La contraseña no debería estar vacía",
        phone: "Por favor ingrese su número de teléfono",
      });
      return;
    }

    if (!person.user_id) {
      setFormError({
        ...inputError,
        id: "Por favor ingrese su identificación",
      });
      return;
    }
    if (!person.user_name) {
      setFormError({
        ...inputError,
        name: "Por favor ingrese su nombre",
      });
      return;
    }
    if (!person.user_lastname) {
      setFormError({
        ...inputError,
        lastName: "Por favor ingrese su apellido",
      });
      return;
    }
    if (!person.user_email) {
      setFormError({
        ...inputError,
        email: "Por favor ingrese su correo electrónico",
      });
      return;
    }
    if (!person.user_email.match(/\D+@udea.edu.co$/gi)) {
      setFormError({
        ...inputError,
        email: "Por favor ingrese su correo electrónico de la universidad.",
      });
      return;
    }
    if (!person.user_password) {
      setFormError({
        ...inputError,
        password: "La contraseña no debería de estar vacía",
      });
      return;
    }
    if (confirmPassword !== person.user_password) {
      setFormError({
        ...inputError,
        confirmPassword: "Las contraseñas no coinciden",
      });
      return;
    }
    if (!person.user_phone) {
      setFormError({
        ...inputError,
        phone: "Por favor ingrese su número de teléfono",
      });
      return;
    }

    setFormError(inputError);
    savePerson(event);
    setConfirmPassword("");
  };

  return (
    <div className="basis-full h-[100vh] md:basis-2/5 overflow-auto">
      <div className="px-[5vw] 2xl:mt-[5vh] sm:my-[8vh]  min-[300px]:mt-[10vh]">
        <div className="text-center pb-[3vh] overflow-auto">
          <div className="flex justify-center h-[50px]">
            <Image
              src={"/images/logo-lock.png"}
              alt={"lock"}
              height={50}
              width={50}
            />
          </div>
          <h1 className="font-bold text-2xl">Registro</h1>
        </div>
        <form className="space-y-4 md:space-y-2" onSubmit={validateFormInput}>
          <div>
            <label
              htmlFor="user_id_type"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Seleccione su tipo de documento
            </label>
            <select
              id="user_id_type"
              name="user_id_type"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-2"
              onChange={(e) => handleChange(e)}
              value={person.user_id_type}
            >
              <option>C.C</option>
              <option>T.I</option>
              <option>Opción 3</option>
              <option>Opción 4</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="user_id"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Digite su número de documento
            </label>
            <input
              type="text"
              id="user_id"
              name="user_id"
              inputMode="numeric"
              pattern="[0-9]{9,15}"
              placeholder="Número de documento"
              title="Utiliza solo números"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
              value={person.user_id}
              onChange={(e) => handleChange(e)}
            />
            <p className="text-red-500 text-xs">{formError.id}</p>
          </div>
          <div>
            <label
              htmlFor="user_name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Nombre (Sin apellidos)
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              pattern="\D+"
              placeholder="Nombres"
              title="Utiliza solo letras"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
              value={person.user_name}
              onChange={(e) => handleChange(e)}
            />
            <p className="text-red-500 text-xs">{formError.name}</p>
          </div>
          <div>
            <label
              htmlFor="user_lastname"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Apellidos
            </label>
            <input
              type="text"
              id="user_lastname"
              name="user_lastname"
              pattern="\D+"
              placeholder="Apellidos"
              title="Utiliza solo letras"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
              value={person.user_lastname}
              onChange={(e) => handleChange(e)}
            />
            <p className="text-red-500 text-xs">{formError.lastName}</p>
          </div>
          <div>
            <label
              htmlFor="user_email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Correo electrónico
            </label>
            <input
              type="user_email"
              name="user_email"
              id="user_email"
              title="Utiliza tu correo UdeA"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full 2xl:p-2.5 md:p-1"
              placeholder="name@udea.edu.co"
              required=""
              value={person.user_email}
              onChange={(e) => handleChange(e)}
            />
            <p className="text-red-500 text-xs">{formError.email}</p>
          </div>
          <div>
            <label
              htmlFor="user_id_type"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Departamento
            </label>
            <select
              id="user_id_type"
              name="user_id_type"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-2"
              onChange={(e) => handleChange(e)}
              value={person.user_id_type}
            >
              {/* {data.map((item, index) => (
              <option key={index}>{item.departamento}</option>
            ))} */}
              
            </select>
          </div>
          <div>
            <label
              htmlFor="user_password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Contraseña
            </label>
            <input
              type="password"
              name="user_password"
              id="user_password"
              placeholder="••••••••"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full 2xl:p-2.5 md:p-1"
              required=""
              value={person.user_password}
              onChange={(e) => handleChange(e)}
            />
            <p className="text-red-500 text-xs">{formError.password}</p>
          </div>

          <div>
            <label
              htmlFor="confirm_password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Confirme su contraseña
            </label>
            <input
              type="password"
              name="confirm_pasword"
              id="confirm_password"
              placeholder="••••••••"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full 2xl:p-2.5 md:p-1"
              required=""
              onChange={(e) => handleChangeConfirm(e)}
            />
            <p className="text-red-500 text-xs">{formError.confirmPassword}</p>
          </div>
          <div>
            <label
              htmlFor="user_phone"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Número de teléfono
            </label>
            <input
              type="text"
              id="user_phone"
              name="user_phone"
              inputMode="numeric"
              pattern="[0-9]{10}"
              placeholder="Número de teléfono"
              title="Utiliza solo números y numeros de teléfono correctos xxx-xxx-xxxx"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 md:p-1"
              value={person.user_phone}
              onChange={(e) => handleChange(e)}
            />
            <p className="text-red-500 text-xs">{formError.phone}</p>
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                aria-describedby="terms"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded focus:ring-3 focus:ring-primary-300"
                required=""
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-light text-gray-500">
                Acepto los{" "}
                <a
                  className="font-medium text-blue-700 hover:underline"
                  href="#"
                >
                  términos y condiciones.
                </a>
              </label>
            </div>
          </div>
          <button
            id="submitBtn"
            name="submitBtn"
            type="submit"
            className="w-full text-white bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 2xl:py-2.5 text-center md:p-1"
          // onClick={savePerson}
          >
            Crear cuenta
          </button>
          <p className="text-sm font-light text-gray-500">
            ¿Ya tienes una cuenta?{" "}
            <a
              href="../login"
              className="font-medium text-blue-600 hover:underline"
            >
              Inicia Sesión aquí.
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPersonForm;