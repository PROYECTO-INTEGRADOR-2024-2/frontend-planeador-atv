import React from "react";
import NavbarHome from "@/components/NavbarHome";
import TablePool from "@/components/TablePool";

function Pool() {
  return (
    <div>
      <NavbarHome name={"Juan"} rol={"Student"} />
      <TablePool
        columns={[
          "Estado",
          "Estudiante",
          "Materia",
          "Tema(s)",
          "Fecha",
          "Acciones",
        ]}
        title={"Pool de tutorías"}
      />
    </div>
  );
}

export default Pool;
