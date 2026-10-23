"use client"

import { Button } from "@modules/common/components/ui"

export default function ReturnFormDownloadButton() {
  const downloadForm = () => {
    const link = document.createElement("a")
    link.href = "/files/gamerfix_zwrot.pdf"
    link.download = "gamerfix_zwrot.pdf"
    link.click()
  }

  return (
    <Button
      onClick={downloadForm}
      data-testid="return-form-button"
      className="text-large-semi"
    >
      Pobierz formularz
    </Button>
  )
}
