"use client"

import { useState } from "react"
import { SubmitButton } from "../../../checkout/components/submit-button"
import { sendInquiry } from "@lib/data/inquiry"
import ErrorMessage from "@modules/checkout/components/error-message"
import Inquiry from "@modules/subpages/components/inquiry"

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    content: "",
  })

  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await sendInquiry(formData)

    setMessage(result)
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="pb-2">
        <Inquiry formData={formData} onChange={handleChange} />

        <SubmitButton className="mt-6" data-testid="submit-inquiry-button">
          Wyślij zapytanie
        </SubmitButton>

        <ErrorMessage error={message} data-testid="inquiry-error-message" />
      </div>
    </form>
  )
}

export default ContactForm
