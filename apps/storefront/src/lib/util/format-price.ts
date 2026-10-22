export const formatPrice = (
  formattedPrice: string,
  amount: number,
  currencyCode: string
) => {
  if (currencyCode !== "pln") return formattedPrice

  return `${new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 2,
  }).format(amount)} zł`
}
