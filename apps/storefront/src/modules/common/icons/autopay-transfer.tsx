import React from "react"
import { IconProps } from "types/icon"
import Image from "next/image"

const AutopayTransfer: React.FC<IconProps> = ({ size = 24, className }) => {
  const mobileRatio = 485 / 115
  const desktopRatio = 800 / 132
  const imageHeight: number = Number(size)
  const mobileWidth: number = imageHeight * mobileRatio
  const desktopWidth: number = imageHeight * desktopRatio

  return (
    <>
      <Image
        src="/images/payment/485x115-bank.png"
        width={mobileWidth}
        height={imageHeight}
        alt="Szybki przelew bankowy"
        className={`${className ?? ""} small:hidden`}
      />
      <Image
        src="/images/payment/800x132-bank.png"
        width={desktopWidth}
        height={imageHeight}
        alt="Szybki przelew bankowy"
        className={`${className ?? ""} hidden small:block`}
      />
    </>
  )
}

export default AutopayTransfer
