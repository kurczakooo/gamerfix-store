import React from "react"
import { IconProps } from "types/icon"
import Image from "next/image"

const Blik: React.FC<IconProps> = ({ size = 24, ...attributes }) => {
  const ratio = 105.67 / 50

  return (
    <Image
      src="/images/payment/blik_telefon.svg"
      width={Number(size) * ratio}
      height={size}
      alt="Płatność Blik"
      {...attributes}
    />
  )
}

export default Blik
