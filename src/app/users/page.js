import React from "react";
import NavbarHome from "@/components/NavbarHome";
import UsersTable from "@/components/UsersTable";
import Footer from "../../components/Footer";

function users() {
  return (
    <>
      <NavbarHome />
      <UsersTable title="Listado de usuarios registrados" />
      <Footer></Footer>
    </>
  );
}

export default users;
