import { Badge } from "@modules/common/components/ui"

const PaymentOnDeliveryBadge = ({ className }: { className?: string }) => {
  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">+ PLN 5.00</span>
    </Badge>
  )
}

export default PaymentOnDeliveryBadge
