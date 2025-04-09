'use client'

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export default function ValidateEmail() {
  const { data: session, status } = useSession()

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
          if (data) {
            console.log("El correo ya está registrado")
          } else {
            console.log("El correo es nuevo")
          }
        })
        .catch(err => console.error("Error al consultar backend:", err))
    }
  }, [session, status])

  return <div>Validando correo...</div>
}
