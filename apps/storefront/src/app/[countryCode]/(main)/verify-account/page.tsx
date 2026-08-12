import { Metadata } from "next"
import { Suspense } from "react"

import VerifyAccount from "@modules/account/components/verify-account"

export const metadata: Metadata = {
  title: "Weryfikacja adresu email | Gamer Fix",
  description:
    "Weryfikacja adresu email w celu założenia konta klienta na sklepie i w serwisie Gamer Fix",
}

export default function VerifyAccountPage() {
  return (
    <div className="w-full flex justify-center px-8 py-12">
      <Suspense
        fallback={
          <p className="text-base-regular text-ui-fg-base">
            Weryfikowanie adresu email...
          </p>
        }
      >
        <VerifyAccount />
      </Suspense>
    </div>
  )
}
