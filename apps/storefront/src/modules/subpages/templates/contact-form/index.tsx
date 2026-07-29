"use client"

import { useState } from "react"
import { SubmitButton } from "../../../checkout/components/submit-button"
import { sendInquiry } from "@lib/data/contact-inquiry"
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
  const [success, setSuccess] = useState(false)

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

    setMessage(null)
    setSuccess(false)

    const result = await sendInquiry(formData)

    if (result) {
      setSuccess(true)

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        content: "",
      })
    } else {
      setMessage("Nie udało się wysłać zapytania. Spróbuj ponownie.")
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="pb-2">
        <Inquiry formData={formData} onChange={handleChange} />

        <SubmitButton className="mt-6" data-testid="submit-inquiry-button">
          Wyślij zapytanie
        </SubmitButton>

        {success && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-4 text-green-700">
            Dziękujemy! Twoje zapytanie zostało wysłane. Skontaktujemy się z
            Tobą najszybciej jak to możliwe.
          </div>
        )}

        <ErrorMessage error={message} data-testid="inquiry-error-message" />
      </div>
    </form>
  )
}

export default ContactForm
