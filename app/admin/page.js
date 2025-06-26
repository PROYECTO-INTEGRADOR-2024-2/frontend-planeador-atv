import React from "react";
import NavbarHome from "@/components/NavbarHome";
import Footer from "@/components/Footer";
import Card from "@/components/Card";

function admin() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarHome name={"Juan"} rol={"ROLE_ADMIN"} admin />
      <Card
        title="Gestión de Carreras"
        content="Aquí puedes administrar las carreras disponibles en la plataforma. OPCIONAL"
        text_button="Carreras"
        ruta="/admin/degree"
      />
      <Card
        title="Gestión de Asignaturas"
        content="Aquí puedes administrar las asignaturas disponibles en la plataforma. OPCIONAL"
        text_button="Asignaturas"
        ruta="/admin/subject"
      />
      <Footer />
    </div>
  );
}

export default admin;
