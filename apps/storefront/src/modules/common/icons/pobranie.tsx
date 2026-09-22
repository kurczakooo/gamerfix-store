import React from "react"
import { IconProps } from "types/icon"
import Image from "next/image"

const PayOnDelivery: React.FC<IconProps> = ({ size = 24, ...attributes }) => {
  const ratio = 258 / 139

  return (
    <Image
      src="/images/payment/pobranie.jpg"
      width={Number(size) * ratio}
      height={size}
      alt="Płatność za pobraniem"
      {...attributes}
    />
  )
}

export default PayOnDelivery
