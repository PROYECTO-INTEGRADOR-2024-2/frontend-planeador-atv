"use client";
import React from "react";
import { useState } from "react";
import DegreeRegisterForm from "@/components/DegreeRegisterForm";
import NavbarHome from "@/components/NavbarHome";
import TableDegrees from "@/components/TableDegrees";
import Footer from "../../../src/components/Footer";

function Page() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarHome name={"Juan"} rol={"ROLE_ADMIN"} admin />
      <TableDegrees title={"Gestión de Asignaturas"} />
      <DegreeRegisterForm open={open}></DegreeRegisterForm>
      <Footer />
    </div>
  );
}

export default Page;
