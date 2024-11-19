import React from "react";
import NavbarHome from "@/components/NavbarHome";
import TablePendingTutor from "@/components/TablePendingTutor";

function MainTutor() {
  return (
    <div>
      <NavbarHome name={"Juan"} rol={"Student"} />
      <TablePendingTutor
        columns={[
          "Estado",
          "Estudiante",
          "Materia",
          "Tema(s)",
          "Fecha",
          "Acciones",
        ]}
        title={"Gestión de tutorías"}
      />
    </div>
  );
}

export default MainTutor;
