import { declineTransferRequest } from "@lib/data/orders"
import { Heading, Text } from "@modules/common/components/ui"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  const { success, error } = await declineTransferRequest(id, token)

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <>
            <Heading level="h1" className="text-xl text-zinc-900">
              Odrzucono przeniesienie zamówienia!
            </Heading>
            <Text className="text-zinc-600">
              Przeniesienie zamówienia {id} odrzucono pomyślnie.
            </Text>
          </>
        )}
        {!success && (
          <>
            <Text className="text-zinc-600">
              Podczas odrzucania prośby przeniesienia zamówienia wystąpił błąd. Spróbuj ponownie.
            </Text>
            {error && (
              <Text className="text-red-500">Error message: {error}</Text>
            )}
          </>
        )}
      </div>
    </div>
  )
}
