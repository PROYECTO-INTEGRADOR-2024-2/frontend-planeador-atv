"use client";
import React from "react";
import { useState } from "react";
import DegreeRegisterForm from "@/components/DegreeRegisterForm";
import NavbarHome from "@/components/NavbarHome";
import Table from "@/components/TableDegrees";

function Page() {
  const [open, setOpen] = useState(false);

  // Función para cerrar modal
  const handleClose = () => {
    setOpen(false);
  };

  // Función para abrir modal
  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <div>
      <NavbarHome name={"Juan"} rol={"Admin"} admin />
      <Table
        columns={[
          "Fecha y Hora",
          "Estudiante",
          "Materia",
          "Tema(s)",
          "Estado Solicitud",
          "Acciones",
          "ID",
        ]}
        title={"Gestión de Asignaturas"}
      />
      <DegreeRegisterForm open={open}></DegreeRegisterForm>
    </div>
  );
}

export default Page;
