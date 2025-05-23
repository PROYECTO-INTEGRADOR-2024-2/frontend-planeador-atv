import React from "react";
import NavbarHome from "@/components/NavbarHome";
import TablePendingTutor from "@/components/TablePendingTutor";
import Footer from "../../components/Footer";

function MainTutor() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarHome name={"Juan"} rol={"Student"} />
      <TablePendingTutor title={"Gestión de tutorías"} />
      <Footer />
    </div>
  );
}

export default MainTutor;
