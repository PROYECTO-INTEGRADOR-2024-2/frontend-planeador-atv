'use client'

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";

import { jwtDecode } from "jwt-decode";
export default function ValidateEmail() {
  const { data: session, status } = useSession()
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      const email = session.user.email

      fetch(`http://localhost:8081/api/v1/persons/email/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data === true) {
            console.log("El correo ya está registrado")
            fetch("http://localhost:8081/api/v1/auth/google", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: JSON.stringify({ email })
            })
              .then(res => res.json())
              .then(authData => {
                const user = jwtDecode(authData.token);
                console.log("Token recibido:", authData.token)
                localStorage.setItem("token", authData.token)
                localStorage.setItem("user", JSON.stringify(user));
                router.push("../landing")
              })
              .catch(err => console.error("Error al solicitar token:", err))

          } else {
            console.log("El correo es nuevo")
            // Redirigir a completar registro, si quieres:
            // window.location.href = "/complete-reg"
          }
        })
        .catch(err => console.error("Error al consultar backend:", err))
    }
  }, [session, status])

  return <div>Validando correo...</div>
}
