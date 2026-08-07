import React from "react"
import { IconProps } from "types/icon"
import Image from "next/image"

const DpayTransfer: React.FC<IconProps> = ({ size = 24, ...attributes }) => {
  const ratio = 984 / 248

  return (
    <Image
      src="/images/payment/falowiec-niski-banki.png"
      width={Number(size) * ratio}
      height={size}
      alt="Szybki przelew bankowy"
      {...attributes}
    />
  )
}

export default DpayTransfer
