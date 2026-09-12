// import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

// import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

// const SHIPPING_PROFILE_PRIORITY = ["Konsole", "Kontrolery"];

// export async function GET(req: MedusaRequest, res: MedusaResponse) {
//   const cartId = req.query.cart_id as string;

//   if (!cartId) {
//     return res.status(400).json({
//       message: "cart_id is required",
//     });
//   }

//   const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

//   // 1. Get products + shipping profiles from cart
//   const {
//     data: [cart],
//   } = await query.graph({
//     entity: "cart",
//     filters: {
//       id: cartId,
//     },
//     fields: [
//       "id",
//       "items.id",
//       "items.product.id",
//       "items.product.shipping_profile.id",
//     ],
//   });

//   if (!cart) {
//     return res.status(404).json({
//       message: "Cart not found",
//     });
//   }

//   // 2. Get unique shipping profile IDs
//   const shippingProfileIds = [
//     ...new Set(
//       cart.items
//         .map((item) => item.product?.shipping_profile?.id)
//         .filter(Boolean),
//     ),
//   ];

//   // 3. Get shipping options
//   const { data: shippingOptions } = await query.graph({
//     entity: "shipping_option",
//     fields: [
//       "id",
//       "name",
//       "price_type",
//       "provider_id",
//       "shipping_profile.id",
//       "shipping_profile.name",
//       "prices.*",
//     ],
//   });

//   // 4. Keep only options belonging to profiles used by cart items
//   const filteredShippingOptions = shippingOptions
//     .filter(
//       (option) =>
//         option.shipping_profile?.id &&
//         shippingProfileIds.includes(option.shipping_profile.id),
//     )
//     .map((option) => ({
//       ...option,
//       amount: option.prices?.[0]?.amount ?? null,
//     }));

//   return res.json({
//     shipping_options: filteredShippingOptions,
//   });
// }

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

const SHIPPING_PROFILE_PRIORITY = ["Konsole", "Kontrolery"];

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cartId = req.query.cart_id as string;

  if (!cartId) {
    return res.status(400).json({
      message: "cart_id is required",
    });
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  // 1. Get products + shipping profiles from cart
  const {
    data: [cart],
  } = await query.graph({
    entity: "cart",
    filters: {
      id: cartId,
    },
    fields: [
      "id",
      "items.id",
      "items.product.id",
      "items.product.shipping_profile.id",
    ],
  });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
    });
  }

  // 2. Get unique shipping profile IDs
  const shippingProfileIds = [
    ...new Set(
      cart.items
        .map((item) => item.product?.shipping_profile?.id)
        .filter(Boolean),
    ),
  ];

  // 3. Get shipping options
  const { data: shippingOptions } = await query.graph(
    {
      entity: "shipping_option",
      fields: [
        "id",
        "name",
        "price_type",
        "provider_id",
        "shipping_profile.id",
        "shipping_profile.name",
        "prices.*",
      ],
    },
    {
      cache: {
        enable: true,
      },
    },
  );

  // 4. Keep only options belonging to profiles used by cart items
  const extractedShippingOptions = shippingOptions.filter(
    (option) =>
      option.shipping_profile?.id &&
      shippingProfileIds.includes(option.shipping_profile.id),
  );

  // 5. Find the highest-priority shipping profile
  const selectedProfileName = SHIPPING_PROFILE_PRIORITY.find((profileName) =>
    extractedShippingOptions.some(
      (option) => option.shipping_profile?.name === profileName,
    ),
  );

  // 6. Keep only shipping options from the selected profile
  const filteredShippingOptions = extractedShippingOptions
    .filter((option) => option.shipping_profile?.name === selectedProfileName)
    .map((option) => ({
      ...option,
      amount: option.prices?.[0]?.amount ?? null,
    }));

  return res.json({
    shipping_options: filteredShippingOptions,
  });
}
