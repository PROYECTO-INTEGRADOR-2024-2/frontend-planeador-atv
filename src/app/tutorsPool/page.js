import React from "react";
import NavbarHome from "@/components/NavbarHome";
import TableTutorsPool from "@/components/TableTutorsPool";
import Footer from "../../components/Footer";

function tutorsPool() {
  return (
    <>
      <NavbarHome />
      <TableTutorsPool
        columns={[
          "ID-Solicitud",
          "ID-Estudiante",
          "Estado solicitud",
          "Fecha solicitud",
          "Acciones"
        ]}
        title={"Solicitudes de Tutor Pendientes"}
      />
      <Footer></Footer>
    </>
  );
}

export default tutorsPool;
