"use client"

import React, { useEffect, useActionState } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { requestPasswordReset } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({
  customer: _customer,
}) => {
  const [successState, setSuccessState] = React.useState(false)

  const updatePassword = async (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    const newPassword = formData.get("new_password") as string
    const confirm = formData.get("confirm_password") as string

    if (!newPassword || newPassword !== confirm) {
      return {
        success: false,
        error: "Nowe hasło rożni się od hasła w polu potwierdzenia",
      }
    }

    // Delegate to server-side helper which verifies current password and
    // triggers a recovery/reset flow (sends reset email). This keeps the
    // sensitive operations server-side.
    const res = await requestPasswordReset(_currentState, formData as FormData)
    if (res && res.success) {
      return { success: true, error: null }
    }

    return {
      success: false,
      error: res?.error || "Napotkano błąd przy zmianie hasła",
    }
  }

  const [state, formAction] = useActionState(updatePassword, {
    error: null as string | null,
    success: false,
  })

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  return (
    <form
      action={formAction}
      onReset={() => clearState()}
      className="w-full overflow-visible"
    >
      <AccountInfo
        label="Hasło"
        currentInfo={`Hasło jest ukryte ze względów bezpieczeństwa`}
        isSuccess={successState}
        isError={!!state?.error}
        errorMessage={state.error || undefined}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Stare hasło"
            name="old_password"
            required
            type="password"
            data-testid="old-password-input"
          />
          <Input
            label="Nowe hasło"
            type="password"
            name="new_password"
            required
            data-testid="new-password-input"
          />
          <Input
            label="Potwierdź nowe hasło"
            type="password"
            name="confirm_password"
            required
            data-testid="confirm-password-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
