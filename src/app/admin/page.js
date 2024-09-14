import React from "react";
import Card from "@/components/Card";
import NavbarHome from "@/components/NavbarHome";
import Table from "@/components/Table";

function admin() {
  return (
    <>
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
    </>
  );
}

export default admin;
