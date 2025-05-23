import React from "react";
import NavbarHome from "@/components/NavbarHome";
import TablePool from "@/components/TablePool";
import Footer from "../../components/Footer";

function Pool() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarHome name={"Juan"} rol={"Student"} />
      <TablePool
        columns={["Estado", "Estudiante", "Materia", "Tema(s)", "Fecha"]}
        title={"Pool de tutorías"}
      />
      <Footer />
    </div>
  );
}

export default Pool;
