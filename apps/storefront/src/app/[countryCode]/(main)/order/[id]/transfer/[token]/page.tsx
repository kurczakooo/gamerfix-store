import { Heading, Text } from "@modules/common/components/ui"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <Heading level="h1" className="text-xl text-zinc-900">
          Prośba przeniesienia zamówienia numer {id}
        </Heading>
        <Text className="text-zinc-600">
        Otrzymałeś(-aś) prośbę o przeniesienie własności swojego zamówienia ({id}).
        Jeśli wyrażasz zgodę, możesz zatwierdzić przeniesienie, klikając przycisk
        poniżej.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <Text className="text-zinc-600">
        Po zaakceptowaniu nowy właściciel przejmie wszystkie obowiązki i uprawnienia
        związane z tym zamówieniem.
        </Text>
        <Text className="text-zinc-600">
        Jeśli nie rozpoznajesz tej prośby lub chcesz zachować własność zamówienia,
        nie musisz podejmować żadnych działań.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
