import React from "react";
import Link from "next/link";
import { useState } from "react";
import { FileQuestion, Book, Star, Plus, Minus, Users } from "lucide-react";
import Image from "next/image";
import fotoTest from "../../public/images/foto-test1.png";
import fotoTest2 from "../../public/images/foto-test2.png";
import fotoTest3 from "../../public/images/foto-test3.png";

const HeroN = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="bg-[#f5f6f8]">
      <main className="flex-col">
        <section className="w-full py-8 md:py-12">
          <div className="md:px-6">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Fundación Antivirus para la deserción
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl py-2">
                  Mantengase al tanto de todas las estrategias y oportunidades
                  que la fundación te trae, como estudiante de grado 11° o si
                  recien inicias tu carrera como ingeniero de Sistemas en la
                  Universidad de Antioquia.
                </p>
              </div>
              <div className="space-x-4 py-4">
                <button className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Empezar
                </button>
                <button variant="outline">Saber más</button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-10 ">
          <div className="md:px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Estrategias
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <FileQuestion className="h-16 w-16 text-gray-500" />
                <h3 className="text-2xl font-bold">Tutorias Academicas</h3>
                <p className="text-xl text-gray-500 text-center">
                  En esta estrategia podras gozar de un espacio personalizado
                  con un tutor, el cual atendera todas tus dudas relacionadas a
                  la asignatura que te esta generando problema.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <Users className="h-16 w-16 text-gray-500" />
                <h3 className="text-2xl font-bold">Grupos de estudio</h3>
                <p className="text-xl text-gray-500 text-center">
                  Este espacio va a ser un lugar de estudio para ti, en el cual
                  vas a estar acompañados con mas colegas tuyos que ven la misma
                  asignatura y orientados por un tutor que los va a guiar semana
                  a semana.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <Book className="h-16 w-16 text-gray-500" />
                <h3 className="text-2xl font-bold">Talleres Nivelate</h3>
                <p className="text-xl text-gray-500 text-center">
                  Esta estrategia permite consolidar todos los conocimientos
                  mediantes actividades y ejercicios guiados por un tutor, para
                  la preparación de actividades evaluativas, y tambien vas a
                  tener la oportunidad de resolver tus dudas.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 ">
          <div className=" md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Testimonios
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-center">
                  <Image
                    src={fotoTest}
                    alt="Logo ATV"
                    style={{ width: "200px", height: "auto" }}
                  />
                </div>
                <p className="text-gray-600 mb-4 text-lg text-center">
                  "La fundación ha sido demasiado valiosa para mi, gracias a
                  ellos pude mantenerme en la Universidad de Antioquia y ahora
                  cuento con un excelente promedio academico."
                </p>

                <p className="font-semibold text-right">Joaquina Martinez </p>
                <p className="italic text-right">Ing. Sistemas</p>
              </div>
              {/*Testimonio modulo 2*/}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-center">
                  <Image
                    src={fotoTest2}
                    alt="Logo ATV"
                    style={{ width: "200px", height: "auto" }}
                  />
                </div>
                <p className="text-gray-600 mb-4 text-lg text-center">
                  "Gracias a la capacidad de los tutores de la fundación pude
                  superar esa materia que habia generado tantos problemas con la
                  continuación de mi avance academico"
                </p>

                <p className="font-semibold text-right">Brayan O'conner </p>
                <p className="italic text-right">Ing. Materiales</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-center">
                  <Image
                    src={fotoTest3}
                    alt="Logo ATV"
                    style={{ width: "200px", height: "auto" }}
                  />
                </div>
                <p className="text-gray-600 mb-4 text-lg text-center">
                  "La fundación pude brindarme la oportunidad de empezar con mi
                  vida profesional, ya que tenia mucha incertidumbre si en algún
                  momento podia tener el acceso a educación superior"
                </p>

                <p className="font-semibold text-right">Arnold Casas </p>
                <p className="italic text-right">Ing. Industrial</p>
              </div>
            </div>
          </div>
        </section>
        <section id="faq" className="w-full py-12 md:py-2 md:pb-12  ">
          <div className="md:px-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "¿Como puedo solicitar una tutoria?",
                  a: "Para solicitar un espacio recuerda que debes pertenecer al porgrama de Ingenieria de Sistemas, puedes solicitar el espacio despues de haberte registrado en la plataforma, en la sección de SOLICITUD DE TUTORIAS.",
                },
                {
                  q: "¿Cómo puedo pertenecer a la red de tutores?",
                  a: "Ofrecemos guías detalladas en la cual diligencias un formulario mostrando que disponibilidad y que materias te gustaria dictar, y posteriormente nos adjuntas tu historia academica.",
                },
                {
                  q: "¿Necesito pagar?",
                  a: "No, nuestra organización, es una fundación sin animo de lucro, buscamos prevenir la desercicón mediante muchas estrategias, por lo que puedes gozar de todos estos espacios sin pagar nada.",
                },
                {
                  q: "¿Cuantas tutorias puedo solicitar?",
                  a: "Puedes solicitar la cantidad de espacios que sean necesarios, y participar en las estrategias que sean ofertadas por la Fundación, no hay ningún limite.",
                },
                {
                  q: "¿Que pasa si no soy del programa Ingenieria de Sistemas?",
                  a: "La unica estrategia exclusiva de este programa son las tutorias personalizadas, de resto los talleres y los grupos de estudio son abiertos para toda la facultad",
                },
              ].map((faq, i) => (
                <div key={i} className="border-b pb-4">
                  <button
                    className="flex text-lg justify-between items-center w-full text-left"
                    onClick={() => toggleFaq(i)}
                  >
                    <span className="font-semibold">{faq.q}</span>
                    {openFaq === i ? (
                      <Minus className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </button>
                  {openFaq === i && (
                    <p className="mt-2 text-gray-600 text-lg">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HeroN;
