import React from "react";
import NavbarHome from "@/components/NavbarHome";
import TableTutorsPool from "@/components/TableTutorsPool";
import Footer from "/src/components/Footer";

function tutorsPool() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarHome />
      <TableTutorsPool
        columns={[
          "ID-Solicitud",
          "ID-Estudiante",
          "Estado solicitud",
          "Fecha solicitud",
          "Acciones",
        ]}
        title={"Solicitudes de Tutor Pendientes"}
      />
      <Footer />
    </div>
  );
}

export default tutorsPool;
