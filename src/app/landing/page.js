import React from "react";
import Card from "@/components/Card";
import NavbarHome from "@/components/NavbarHome";
import Table from "@/components/Table";
import Footer from "../../components/Footer"

function landing() {
  return (
    <>
      <NavbarHome name={"Juan"} />
      <Table
        columns={[
          "ID",
          "Estado",
          "Estudiante",
          "Materia",
          "Tema(s)",
          "Fecha",
          "Acciones",
        ]}
        title={"Solicitudes Pendientes"}
      />
      <Card
        title="¿Quieres agendar una tutoria?"
        content="Recuerda incluir los temas que quieres ver en la tutoría. Es importante para que el tutor sepa qué temas quieres resolver en ella, y resuelve tus dudas e inquietudes con el."
        text_button="Agendar una tutoria"
        ruta="/tutorialRegister"
      ></Card>

      <Card
        title="¿Quieres ser tutor?"
        content="En la fundación Antivirus para la deserción te brindamos la oportunidad de colaborar y poder brindar apoyo a estudiantes que lo necesitan, como tu lo necesitaste en algún momento."
        text_button="¡Quiero ser parte del equipo!"
        ruta="../register"
      ></Card>
      <Footer></Footer>
    </>
  );
}

export default landing;
