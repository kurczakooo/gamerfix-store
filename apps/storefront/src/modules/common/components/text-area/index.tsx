import { Label } from "@modules/common/components/ui"
import React, { useImperativeHandle } from "react"

type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { name, label, touched: _touched, required, topLabel, className, ...props },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => textareaRef.current!)

    return (
      <div className="flex h-full w-full flex-col">
        {topLabel && (
          <Label className="mb-2 txt-compact-medium-plus">{topLabel}</Label>
        )}

        <div className="relative flex h-full w-full txt-compact-medium">
          <textarea
            ref={textareaRef}
            id={name}
            name={name}
            placeholder=" "
            required={required}
            className={`
              peer
              block h-full min-h-40 w-full resize-none
              rounded-md border border-ui-border-base
              bg-ui-bg-field px-4 pt-5 pb-2
              appearance-none
              focus:outline-none
              focus:ring-0
              focus:shadow-borders-interactive-with-active
              hover:bg-ui-bg-field-hover
              ${className ?? ""}
            `}
            {...props}
          />

          <label
            htmlFor={name}
            onClick={() => textareaRef.current?.focus()}
            className="
              pointer-events-none
              absolute
              left-3
              top-3
              px-1
              text-ui-fg-subtle
              transition-all
              duration-300

              peer-focus:-top-2
              peer-focus:text-xs
              peer-focus:bg-ui-bg-field

              peer-not-placeholder-shown:-top-2
              peer-not-placeholder-shown:text-xs
              peer-not-placeholder-shown:bg-ui-bg-field
            "
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
        </div>
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea
