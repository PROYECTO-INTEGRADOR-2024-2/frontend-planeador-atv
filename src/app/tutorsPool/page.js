import React from "react";
import NavbarHome from "@/components/NavbarHome";
import TableTutorsPool from "@/components/TableTutorsPool";
import Footer from "../../components/Footer";

function tutorsPool() {
  return (
    <>
      <NavbarHome name={"Juan"} rol={"ADMIN"} />
      <TableTutorsPool
        columns={[
          "ID",
          "ID Estudiante",
          "Estudiante",
          "Fecha",
          "Fecha",
          "Acciones",
        ]}
        title={"Solicitudes de Tutor Pendientes"}
      />
      <Footer></Footer>
    </>
  );
}

export default tutorsPool;
