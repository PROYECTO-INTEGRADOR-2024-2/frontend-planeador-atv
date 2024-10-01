"use client";
import React from "react";
import { useState } from "react";
import SubjectRegister from "@/components/SubjectRegister";
import NavbarHome from "@/components/NavbarHome";
import TableDegrees from "@/components/TableDegrees";

function Page() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <NavbarHome name={"Juan"} rol={"Admin"} admin />
      <TableDegrees title={"Gestión de Asignaturas"} />
      <SubjectRegister open={open}></SubjectRegister>
    </div>
  );
}

export default Page;
