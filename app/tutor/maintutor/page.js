import React from "react";
import Card from "@/components/Card";
import NavbarHome from "@/components/NavbarHome";
import TablePendingTutor from "@/components/TablePendingTutor";
import Footer from "/src/components/Footer";

function MainTutor() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarHome name={"Juan"} rol={"Student"} />
      <TablePendingTutor title={"Gestión de tutorías"} />
      <Card
        title="¿Quieres agendar una tutoría?"
        content="Recuerda incluir los temas que quieres ver en la tutoría. Es importante para que el tutor sepa qué temas quieres resolver en ella, y resuelve tus dudas e inquietudes con el."
        text_button="Agendar una tutoría"
        ruta="/student/tutorialRegister"
      />
      <Footer />
    </div>
  );
}

export default MainTutor;
