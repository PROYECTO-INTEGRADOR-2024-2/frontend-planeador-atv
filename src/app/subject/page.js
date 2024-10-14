"use client";
import React from "react";
import { useState } from "react";
import SubjectRegister from "@/components/SubjectRegister";
import NavbarHome from "@/components/NavbarHome";
import TableSubjects from "@/components/TableSubjects";

function Page() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <NavbarHome name={"Juan"} rol={"Admin"} admin />
      <TableSubjects title={"Gestión de Asignaturas"} />
      <SubjectRegister open={open}></SubjectRegister>
    </div>
  );
}

export default Page;
