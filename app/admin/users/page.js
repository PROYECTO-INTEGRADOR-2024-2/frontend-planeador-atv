import React from "react";
import NavbarHome from "@/components/NavbarHome";
import UsersTable from "@/components/UsersTable";
import Footer from "../../../src/components/Footer";

function users() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarHome />
      <UsersTable title="Listado de usuarios registrados" className="w-full" />
      <Footer />
    </div>
  );
}

export default users;
