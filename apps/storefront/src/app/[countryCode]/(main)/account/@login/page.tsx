import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Zaloguj się",
  description: "Zaloguj się.",
}

export default function Login() {
  return <LoginTemplate />
}
