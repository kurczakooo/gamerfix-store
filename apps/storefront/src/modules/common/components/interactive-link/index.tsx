import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@modules/common/components/ui"
import LocalizedClientLink from "../localized-client-link"
type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  external?: boolean
  onClick?: () => void
}

const InteractiveLink = ({
  href,
  children,
  external,
  onClick,
  ...props
}: InteractiveLinkProps) => {
  const content = (
    <>
      <Text className="text-ui-fg-interactive">{children}</Text>
      <ArrowUpRightMini
        className="group-hover:rotate-45 ease-in-out duration-150"
        color="var(--fg-interactive)"
      />
    </>
  )

  if (external) {
    return (
      <a
        className="flex gap-x-1 items-center group"
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <LocalizedClientLink
      className="flex gap-x-1 items-center group"
      href={href}
      onClick={onClick}
      {...props}
    >
      {content}
    </LocalizedClientLink>
  )
}

export default InteractiveLink
