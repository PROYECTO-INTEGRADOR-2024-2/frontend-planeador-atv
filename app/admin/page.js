import React from "react";
import NavbarHome from "@/components/NavbarHome";
import Footer from "@/components/Footer";
import Card from "@/components/Card";

function admin() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarHome name={"Juan"} rol={"ROLE_ADMIN"} admin />
      <Card
        title="Gestión de tutorias"
        content="Aquí puedes administrar las tutorias disponibles en la plataforma. Es importante estar al tanto de como va el flujo de asiganciones durante el dia a dia."
        text_button="Tutorias"
        ruta="/admin/adminTutos"
      />
      <Card
        title="Gestión de Aplicaciones"
        content="Aquí puedes administrar las aplicaciones para ser tutor, es importante que respondas estas solicitudes, y que ademas notifiques a los estudiantes interesados sobre el estado de su solicitud"
        text_button="Aplicaciones"
        ruta="/admin/activationRequest"
      />
      <Card
        title="Gestión de Usuarios"
        content="Aquí puedes agestionar los estados de los estudiantes, si notas algun compprtamiento indebido o se notifica de algúna deserción puedes deshabilitar usuarios en la plataforma"
        text_button="Gestionar usuarios"
        ruta="/admin/users"
      />
      <Footer />
    </div>
  );
}

export default admin;
