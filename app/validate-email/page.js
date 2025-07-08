"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function ValidateEmail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      console.log("session", session);
      const email = session.user.email;

      fetch(`http://localhost:8081/api/v1/persons/email/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data === true) {
            console.log("El correo ya está registrado");
            fetch("http://localhost:8081/api/v1/auth/google", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ email }),
            })
              .then((res) => res.json())
              .then((authData) => {
                const user = jwtDecode(authData.token);
                console.log("Token recibido:", authData.token);
                Cookies.set("token", authData.token);
                Cookies.set("user", JSON.stringify(user));
                switch (user.user_role) {
                  case "ROLE_STUDENT":
                    router.push("/student/landing");
                    break;
                  case "ROLE_TUTOR":
                    router.push("/tutor/maintutor");
                    break;
                  case "ROLE_ADMIN":
                    router.push("/admin");
                    break;
                  default:
                    toast.error(
                      "Usuario desconectado, por favor iniciar sesión."
                    );
                    router.push("/landing");
                    return;
                }
              })
              .catch((err) => console.error("Error al solicitar token:", err));
          } else {
            if (email.split("@").pop().trim() === "udea.edu.co") {
              router.push("../complete-reg");
              console.log("El correo es nuevo");
            } else {
              toast.error("El correo no pertenece a la UDEA");
              router.push("../login");
            }
          }
        })
        .catch((err) => console.error("Error al consultar backend:", err));
    }
  }, [session, status]);

  return <div>Validando correo...</div>;
}
