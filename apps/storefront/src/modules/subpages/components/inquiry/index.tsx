import Input from "@modules/common/components/input"
import Textarea from "@modules/common/components/text-area"
import React from "react"

type InquiryData = {
  name: string
  email: string
  phone: string
  subject: string
  content: string
}

type InquiryProps = {
  formData: InquiryData
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
}

const Inquiry = ({ formData, onChange }: InquiryProps) => {
  return (
    <div className="flex h-full flex-col gap-4">
      <Input
        label="Imię i nazwisko"
        name="name"
        autoComplete="given-name"
        value={formData.name}
        onChange={onChange}
        required
        data-testid="inquiry-name-input"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="E-mail"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={onChange}
          required
          data-testid="inquiry-email-input"
        />

        <Input
          label="Numer telefonu"
          name="phone"
          autoComplete="tel"
          value={formData.phone}
          onChange={onChange}
          data-testid="inquiry-phone-input"
        />
      </div>

      <Input
        label="Temat zapytania"
        name="subject"
        value={formData.subject}
        onChange={onChange}
        required
        data-testid="inquiry-subject-input"
      />

      <div className="flex-1 min-h-0">
        <Textarea
          label="Treść zapytania"
          name="content"
          value={formData.content}
          onChange={onChange}
          required
          data-testid="inquiry-content-input"
        />
      </div>
    </div>
  )
}

export default Inquiry
