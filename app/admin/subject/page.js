"use client";
import React from "react";
import { useState } from "react";
import SubjectRegister from "@/components/SubjectRegister";
import NavbarHome from "@/components/NavbarHome";
import TableSubjects from "@/components/TableSubjects";
import Footer from "../../../src/components/Footer";

function Page() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarHome name={"Juan"} rol={"ROLE_ADMIN"} admin />
      <TableSubjects title={"Gestión de Asignaturas"} />
      <SubjectRegister open={open}></SubjectRegister>
      <Footer />
    </div>
  );
}

export default Page;
