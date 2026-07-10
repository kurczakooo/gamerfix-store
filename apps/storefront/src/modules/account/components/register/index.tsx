"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        Zarejestruj się
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        Stworzenie konta udostępni możliwości takie jak:
      </p>
      <ul className="text-base-regular text-ui-fg-base ml-8 mb-4 list-disc list-inside">
        <li>zarządzanie zamówieniami</li>
        <li>przeglądanie i śledzenie historii zakupów</li>
        <li>brak konieczności wpisywania danych przy kolejnym zamówieniu</li>
      </ul>
      {message?.state === "verification_required" && (
        <div
          className="w-full mb-4 text-center text-base-regular text-ui-fg-base bg-ui-bg-subtle border border-ui-border-base rounded-rounded p-4"
          data-testid="register-verification-message"
        >
          Wysłaliśmy link weryfikacyjny na adres <strong>{message.email}</strong>.
          Zweryfikuj swój email i zaloguj się.
        </div>
      )}
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Imię"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Nazwisko"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="E-mail"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Numer telefonu"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Hasło"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="register-error"
        />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          Tworząc konto, zgadzasz się z{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            Polityką Prywatności
          </LocalizedClientLink>{" "}
          i{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            Regulaminem
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton className="w-full mt-6" data-testid="register-button">
          Zarejestruj się
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Masz już konto?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Zaloguj się
        </button>
        .
      </span>
    </div>
  )
}

export default Register
