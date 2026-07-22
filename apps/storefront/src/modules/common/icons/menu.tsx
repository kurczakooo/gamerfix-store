import React from "react"

import { IconProps } from "types/icon"

const Menu: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z" />
    </svg>
  )
}

export default Menu
