import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@modules/common/components/ui"
import LocalizedClientLink from "../localized-client-link"
type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  external?: boolean
  inline?: boolean
  onClick?: () => void
}

const InteractiveLink = ({
  href,
  children,
  external,
  inline = false,
  onClick,
  ...props
}: InteractiveLinkProps) => {
  const content = (
    <>
      <Text as="span" className="text-ui-fg-interactive">
        {children}
      </Text>
      <ArrowUpRightMini
        className="group-hover:rotate-45 ease-in-out duration-150"
        color="var(--fg-interactive)"
      />
    </>
  )
  const className = `${
    inline ? "inline-flex" : "flex"
  } items-center gap-x-1 group`

  if (external) {
    return (
      <a
        className={className}
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
      className={className}
      href={href}
      onClick={onClick}
      {...props}
    >
      {content}
    </LocalizedClientLink>
  )
}

export default InteractiveLink
