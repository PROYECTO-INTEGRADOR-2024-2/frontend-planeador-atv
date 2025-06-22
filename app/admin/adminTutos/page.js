import React from "react";
import NavbarHome from "@/components/NavbarHome";
import TableAdmin from "@/components/TableAdmin";
import Footer from "/src/components/Footer";

function landing() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarHome name={"Juan"} rol={"Student"} />
      <TableAdmin
        columns={[
          "Estado",
          "Estudiante",
          "Tutor",
          "Materia",
          "Tema(s)",
          "Fecha",
          "Calificación",
          "Acciones",
        ]}
        title={"Tutorías"}
      />
      <Footer />
    </div>
  );
}

export default landing;
