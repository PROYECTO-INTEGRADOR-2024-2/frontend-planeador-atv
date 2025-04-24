import React from "react";
import Card from "@/components/Card";
import NavbarHome from "@/components/NavbarHome";
import TableAdmin from "@/components/TableAdmin";
import Footer from "../../components/Footer";

function landing() {
  return (
    <div className="flex flex-col min-h-screen">
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
        title={"Tutorias"}
      />
      <Footer></Footer>
    </div>
  );
}

export default landing;
