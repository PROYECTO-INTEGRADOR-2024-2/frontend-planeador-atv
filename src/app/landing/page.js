"use client"

import Card from "@/components/Card";
import NavbarHome from "@/components/NavbarHome";
import PersonalTutosTable from "@/components/PersonalTutosTable";
import Footer from "../../components/Footer";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function landing() {
    const router = useRouter()
    useEffect(() => {
      const token = Cookies.get("token");
      const userCookie = Cookies.get("user");
  
      if (token && userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          router.push("/landing");
        }
      } else {
        router.push("/landing");
      }
    }, []);

  


  return (
    <>
      <NavbarHome/>
      <PersonalTutosTable
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
        ruta="../tutorRegister"
      ></Card>
      <Footer></Footer>
    </>
  );
}

export default landing;
