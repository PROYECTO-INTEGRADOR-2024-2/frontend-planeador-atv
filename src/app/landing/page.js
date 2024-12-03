import React from "react";
import Card from "@/components/Card";
import NavbarHome from "@/components/NavbarHome";
import Table from "@/components/Table";
import TablePastTutorials from "@/components/TablePastTutorials";
import Footer from "../../components/Footer";

function landing() {
  return (
    <>
      <NavbarHome name={"Juan"} rol={"Student"} />
      <Table
        columns={[
          "ID",
          "Estado",
          "Tutor",
          "Materia",
          "Tema(s)",
          "Fecha",
          "Acciones",
        ]}
        title={"Solicitudes Pendientes"}
      />
      <TablePastTutorials
        columns={[
          "ID",
          "Estado",
          "Tutor",
          "Materia",
          "Tema(s)",
          "Fecha",
          "Acciones",
        ]}
        title={"Tutorías Pasadas"}
      />
      <Card
        title="¿Quieres agendar una tutoría?"
        content="Recuerda incluir los temas que quieres ver en la tutoría. Es importante para que el tutor sepa qué temas quieres resolver en ella, y resuelve tus dudas e inquietudes con el."
        text_button="Agendar una tutoría"
        ruta="/tutorialRegister"
      ></Card>

      <Card
        title="¿Quieres ser tutor?"
        content="En la fundación Antivirus para la deserción te brindamos la oportunidad de colaborar y poder brindar apoyo a estudiantes que lo necesitan, como tu lo necesitaste en algún momento."
        text_button="¡Quiero ser parte del equipo!"
        ruta="../tutorRegister"
      ></Card>
      <Footer></Footer>
    </>
  );
}

export default landing;
