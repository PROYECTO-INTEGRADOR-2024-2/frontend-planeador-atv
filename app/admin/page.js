import React from "react";
import NavbarHome from "@/components/NavbarHome";
import Table from "@/components/Table";

function admin() {
  return (
    <>
      <NavbarHome name={"Juan"} rol={"ROLE_ADMIN"} admin />
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
