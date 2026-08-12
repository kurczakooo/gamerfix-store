import { Heading } from "@modules/common/components/ui"
import UnderlineLink from "@modules/common/components/interactive-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="text-base-semi">Potrzebujesz pomocy?</Heading>
      <div className="text-base-regular my-2">
        <div className="flex flex-col gap-1">
          <UnderlineLink href="/contact">Kontakt</UnderlineLink>
          <UnderlineLink href="/returns">Zwroty i reklamacje</UnderlineLink>
        </div>
      </div>
    </div>
  )
}

export default Help
